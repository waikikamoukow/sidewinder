/*--------------------------------------------------------------------------

@sidewinder/server

The MIT License (MIT)

Copyright (c) 2022 Haydn Paterson (sinclair) <haydn.developer@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

---------------------------------------------------------------------------*/

import { TContract, ContextMapping, ResolveContextMapping, ResolveContractMethodParameters, ResolveContractMethodReturnType, TFunction } from '@sidewinder/contract'
import { Methods, Exception, Encoder, JsonEncoder, MsgPackEncoder, RpcErrorCode, RpcProtocol } from '@sidewinder/shared'
import { Request, Response } from 'express'
import { IncomingMessage } from 'http'

export type WebServiceAuthorizeCallback = (clientId: string, request: IncomingMessage) => Promise<boolean> | boolean
export type WebServiceConnectCallback = (clientId: string) => Promise<void> | void
export type WebServiceErrorCallback = (clientId: string, error: unknown) => void
export type WebServiceCloseCallback = (clientId: string) => Promise<void> | void

export class WebService<Contract extends TContract> {
    private onAuthorizeCallback: WebServiceAuthorizeCallback
    private onConnectCallback: WebServiceConnectCallback
    private onErrorCallback: WebServiceErrorCallback
    private onCloseCallback: WebServiceCloseCallback
    private readonly encoder: Encoder
    private readonly methods: Methods

    constructor(public readonly contract: Contract) {
        this.onAuthorizeCallback = () => true
        this.onConnectCallback = () => { }
        this.onErrorCallback = () => { }
        this.onCloseCallback = () => { }
        this.encoder = this.contract.format === 'json' ? new JsonEncoder() : new MsgPackEncoder()
        this.methods = new Methods()
    }

    /**
     * Subscribes to authorize events. This event is raised each time a http rpc request is made. Callers
     * can use this event to setup any associated state for the request
     */
    public event(event: 'authorize', callback: WebServiceAuthorizeCallback): WebServiceAuthorizeCallback
    
    /**
     * Subscribes to connect events. This event is raised immediately following a successful authorization.
     * Callers can use this event to initialize any additional associated state for the clientId.
     */
    public event(event: 'connect', callback: WebServiceConnectCallback): WebServiceConnectCallback
    
    /**
     * Subscribes to error events. This event is raised if there are any http transport errors. This event
     * is usually immediately followed by a close event.
     */
    public event(event: 'error', callback: WebServiceErrorCallback): WebServiceErrorCallback
    
    /**
     * Subscribes to close events. This event is raised once the http rpc method has executed and the
     * http / tcp transport is about to terminate. Callers can use this event to clean up any associated
     * state for the clientId.
     */
    public event(event: 'close', callback: WebServiceCloseCallback): WebServiceCloseCallback

    /** Sucribes to events */
    public event(event: string, callback: (...args: any[]) => any): any {
        switch (event) {
            case 'authorize': { this.onAuthorizeCallback = callback; break }
            case 'connect': { this.onConnectCallback = callback; break }
            case 'error': { this.onErrorCallback = callback; break }
            case 'close': { this.onCloseCallback = callback; break }
            default: throw Error(`Unknown event '${event}'`)
        }
        return callback
    }

    /** Defines an method implementation */
    public method<
        Method extends keyof Contract['$static']['server'],
        Parameters extends ResolveContractMethodParameters<Contract['$static']['server'][Method]>,
        ReturnType extends ResolveContractMethodReturnType<Contract['$static']['server'][Method]>,
        Mapping extends ContextMapping<any>
    >(
        method: Method,
        mapping: Mapping,
        callback: (context: ResolveContextMapping<Mapping>, ...params: Parameters) => Promise<ReturnType> | ReturnType
    ): (clientId: string, ...params: Parameters) => Promise<ReturnType>

    /** Defines an method implementation */
    public method<
        Method extends keyof Contract['$static']['server'],
        Parameters extends ResolveContractMethodParameters<Contract['$static']['server'][Method]>,
        ReturnType extends ResolveContractMethodReturnType<Contract['$static']['server'][Method]>
    >(
        method: Method,
        callback: (clientId: string, ...params: Parameters) => Promise<ReturnType> | ReturnType
    ): (clientId: string, ...params: Parameters) => Promise<ReturnType>

    /** Defines an method implementation */
    public method(...args: any[]): any {
        const [method, mapping, callback] = (args.length === 3) ? [args[0], args[1], args[2]] : [args[0], (x: any) => x, args[1]]
        if((this.contract.server as any)[method] === undefined) throw Error(`Cannot define method '${method}' as it does not exist in contract`)
        this.methods.register(method, (this.contract.server as any)[method], mapping, callback)
        return async (clientId: string, ...params: any[]) => await this.methods.executeServerMethod(clientId, method, params)
    }

    private readRequest(request: Request): Promise<Uint8Array> {
        return new Promise((resolve, reject) => {
            const buffers: Buffer[] = []
            request.on('data', buffer => buffers.push(buffer))
            request.on('error', error => reject(error))
            request.on('end', () => resolve(Buffer.concat(buffers)))
        })
    }

    private writeResponse(response: Response, status: number, data: Uint8Array): Promise<void> {
        return new Promise((resolve, reject) => {
            response.writeHead(status, {
                'Content-Type': 'application/x-sidewinder',
                'Content-Length': data.length.toString()
            })
            response.end(data, () => resolve())
        })
    }

    /** HOST FUNCTION: This function is called by the host up accept a RPC request  */
    public async accept(clientId: string, request: Request, response: Response) {
        try {
            // -----------------------------------------------------------------------
            // Authorization
            // -----------------------------------------------------------------------

            const authorized = await this.onAuthorizeCallback(clientId, request)
            if (!authorized) {
                const [code, data, message] = [RpcErrorCode.InvalidRequest, {}, 'Unauthorized']
                return await this.writeResponse(response, 200, this.encoder.encode(RpcProtocol.encodeError('unknown', {
                    data, code, message
                })))
            }

            // -----------------------------------------------------------------------
            // Connection Callback
            // -----------------------------------------------------------------------

            await this.onConnectCallback(clientId)

            // -----------------------------------------------------------------------
            // Execute
            // -----------------------------------------------------------------------

            const data = await this.readRequest(request)
            const message = RpcProtocol.decodeAny(this.encoder.decode(data))
            if (message === undefined) return
            if (message.type === 'request') {
                const request = message.data
                const result = await this.methods.executeServerProtocol(clientId, request)
                if (result.type === 'result-with-response' || result.type === 'error-with-response') {
                    this.writeResponse(response, 200, this.encoder.encode(result.response))
                } else {
                    this.writeResponse(response, 200, Buffer.alloc(0))
                }
            } else {
                const [code, data, message] = [RpcErrorCode.InvalidRequest, {}, 'Invalid Request']
                return await this.writeResponse(response, 200, this.encoder.encode(RpcProtocol.encodeError('unknown', {
                    data, code, message
                })))
            }
        } catch (error) {
            this.onErrorCallback(clientId, error)
            if (error instanceof Exception) {
                const [code, data, message] = [error.code, error.data, error.message]
                return await this.writeResponse(response, 200, this.encoder.encode(RpcProtocol.encodeError('unknown', {
                    data, code, message
                })))
            } else {
                const [code, data, message] = [RpcErrorCode.InternalServerError, {}, 'Internal Server Error']
                return await this.writeResponse(response, 200, this.encoder.encode(RpcProtocol.encodeError('unknown', {
                    data, code, message
                })))
            }
        }

        // ------------------------------------------------------------------
        // Close Callback
        // ------------------------------------------------------------------

        await this.onCloseCallback(clientId)
    }
}