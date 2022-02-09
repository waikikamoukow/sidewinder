<div align='center'>

<h1>Sidewinder</h1>

<p>Web Service Framework for Node and Browsers</p>

<img src="https://github.com/sinclairzx81/sidewinder/blob/master/build/assets/sidewinder.png?raw=true" />

[<img src="https://img.shields.io/npm/v/@sidewinder/contract?label=%40sidewinder%2Fcontract">](https://www.npmjs.com/package/@sidewinder/contract) [<img src="https://img.shields.io/npm/v/@sidewinder/server?label=%40sidewinder%2Fserver">](https://www.npmjs.com/package/@sidewinder/server) [<img src="https://img.shields.io/npm/v/@sidewinder/client?label=%40sidewinder%2Fclient">](https://www.npmjs.com/package/@sidewinder/client)

</div>

## Overview

Sidewinder is a strictly typed NodeJS Web Service framework built primarily for micro service architectures. It enables one to create schema validated RPC methods that can be trivially called across a network. It offers functionality for both unidirectional (http) and bidirectional (web socket) method calls, and provides this functionality under a unified service programming model.

Sidewinder offers functionality similar to gRPC but uses JSON RPC 2.0 for the wire protocol, JSON Schema for message validation and offers optional binary message encoding using MsgPack.

License MIT

## Contents

- [Overview](#Overview)
- [Install](#Install)
- [Example](#Example)
- [Contract](libs/contract/readme.md)
- [Server](libs/server/readme.md)
- [Client](libs/client/readme.md)
- [Testing](#Testing)
- [Classes](#Classes)


## Install

```bash
$ npm install @sidewinder/contract   # Function Schematics
$ npm install @sidewinder/server     # Http and Web Socket Services
$ npm install @sidewinder/client     # Http and Web Socket Clients
```

## Example

[TypeScript Example Link](https://www.typescriptlang.org/play?#code/JYWwDg9gTgLgBAbzgFQJ5gKZwL5z-g-AMyghDgHIABAZ2ABMMB3YAO0agHoBjCVmKAENuMCgChQkWIjgAJCDRgAaOAHUMAIwDKGKADdg3LLhJlKtBszYdONXXt3jJ0eEnUaAwgBtgGfjkJiUnJqOkYWdl0eHz9RMTFOTjgAWlS09IzMrOyc3LychKSPPgFhGELCuGL+IREaOEEoLDYYXSJhDHqYAAtBeEYabihgDSxuQS8vQQ0vLBAMHoh6er44O31DToA6OAAhVDhK7l7WAHM2U4aqktr4VAgAVzgQQQO2PQmGPqwNCB6qmL+aBwHT6XQ7LSWCIcSoPOxdbpYNCYLRDYBgeC8cDAWZQOAwCBrGB9QwTLwHY4YbgAa3xiLgvCgTRErE6KyIcF+PUqklm834JL4NB2yCgFJO5zOdKwRAgkwgEUuYEagnmrSg9UE7DgTRgDygrHx6G2FUSKXyFstVut6XivFYimuNTKcAAvChjVtqqURAAKBBiAiyqAvGAALkoACsaHwKEpA-h1g4oBGA4E8BRBPR6BQI8iMFsAGIPVgiYB8X0AbXzWwAcg8QKMoL6AJQqGv1xu6VsAXXbns7TdbbYTgQoNAeGlzHswRZLZYr1YHDaHbZnBcH3ZbffXdZXW5H6coIAeXmnNeLpZg5dYVY7++ba-vXcfO+fq8P6Yo9GAenPnsvBdbyXWdN0fftQIfXsII3KCW0-PBsDEbAW3iM0bQwzCsOSSpQQMIxTSSPDNnqMBSAMRgGT4IYFmacA+ViQUHTgYMnR9GBhRBexNh1KkMF-DBKkEOAS2AABHB5mkYfhgCIXw8VYjBhG6OBWSYXiJM6GAdgASXojB+WJa8hQZLURLsOlgBoHlpOvOTdHxQlBBoGNuGAb5pQZQEYB0+g4BYf5FA8poJOAJo-NYnosBCyTFB2SpkHpWV5UVKjKN5AzYgRLAAAMk10HK2NuZ4Fm6JZhUI81sOqmqsjtIV4CTHj3TUtRNGIoxfW9W5UKaowtjVMr6F9TNszjOBfW4bzfJUQQVA0Fs3QAPiuABqTleu4-rBqWEaJynFRJum+hZvmxbXRW4Tkg2sQ+oLHbhooE8z0OqbfH4GaGjO5argAKhuu6BtK3bv1-cajvenyTq+jafuEpIFvqh14DKx0WuYOQFBgVsxFR7S4QwX07tQvGth8RQ-F9ABWAAGOnUMqWqmeZypvEhyq2ayqjWFZERHK4jYjE4xKxm8+ocvGSZW0Koh52Mw0rLgNgiF0cLKlMcgoqKsoRSSuUvAVC5ud5jj+a1u64DxjA-OmCAHCE7VJa8eolOOOAIA5YBTYeirEkZ5mA+wpHHTe2I3VUjH3E5-gupuMoVAoboYBgMAw0SA3JbxsNabpzgKFQ+1HSzPz3UEJhBC9rzIa2J2RuL8aAEYVAAJgLhq1kncOy4rzFvJrsk9snRuW7b5HnlPLvy8r0P+H7qWntPYe4FbsRC-6X9J57qvYjnrwRp-P8VCb5fR5jWYyYgU4q2LlR9pUZ6VAPntFrNSsAGYVGSY-m5UGmtipnsQA)

Sidewinder services consist of three main components, a [Contract](libs/contract/readme.md), [Service](libs/server/readme.md) and [Client](libs/client/readme.md). A Contract defines a set of callable RPC methods and is shared between both Client and Server. A Service provides an implementation for a Contract; and a Client calls methods implemented on the Service. Contracts are used to infer type safe functions on Services and Clients, well as validate method calls made over the network.

The following demonstrates general usage.

```typescript
import { Type }             from '@sidewinder/contract'
import { Host, WebService } from '@sidewinder/server'
import { WebClient }        from '@sidewinder/client'

// ---------------------------------------------------------------------------
// Contract
//
// Contracts are interfaces that describe callable methods on services. By 
// changing a Contract you may invalidate both Client or Server. Sidewinder
// uses the TypeScript compiler to statically check the correctness of both
// implementations. Try changing the following parameters and return types.
//
// ---------------------------------------------------------------------------

const Contract = Type.Contract({
    format: 'json',
    server: {
        'add': Type.Function([Type.Number(), Type.Number()], Type.Number()),
        'sub': Type.Function([Type.Number(), Type.Number()], Type.Number()),
        'mul': Type.Function([Type.Number(), Type.Number()], Type.Number()),
        'div': Type.Function([Type.Number(), Type.Number()], Type.Number()),
    }
})

// ---------------------------------------------------------------------------
// Service
//
// Services provide concrete implementations for Contracts. Service receive
// a unique identifier for each new request. Implementations can use this
// identifier to associate the clientId with state required for the request. 
// The following code implements the `server` Contract methods.
//
// ---------------------------------------------------------------------------

const service = new WebService(Contract)
service.method('add', (clientId, a, b) => a + b)
service.method('sub', (clientId, a, b) => a - b)
service.method('mul', (clientId, a, b) => a * b)
service.method('div', (clientId, a, b) => a / b)

const host = new Host()
host.use(service)
host.listen(5000)

// ---------------------------------------------------------------------------
// Client
//
// Clients connect to Services. The clients `call()` function is inferred
// from the Contract. The following connects to the service hosted above
// and calls each of its methods.
//
// ---------------------------------------------------------------------------

const client = new WebClient(Contract, 'http://localhost:5000/')
const add = await client.call('add', 1, 2)
const sub = await client.call('sub', 1, 2)
const mul = await client.call('mul', 1, 2)
const div = await client.call('div', 1, 2)
console.log([add, sub, mul, div]) // [3, -1, 2, 0.5]
```



## Testing

[TypeScript Example Link](https://www.typescriptlang.org/play?#code/JYWwDg9gTgLgBAbzgFQJ5gKZwL5z-uAMyghDgHIABAZ2ABMMB3YAOwagHoBjCFmKAIZcY5AFChIsRHADqGAEYBlDFABuwLllzFSFGvSat2HaitUqxojhzgBaew8dPnL12-ce3VmwGFe-IRhvO09QsPCIx1FRHhZqeD8+QWE4AF4UdAwAOkSA4QAKBFECQmgQARgALgoAK2pecgAaYvxTNRVqooICcgE6OnJqtEwsgDEAVxZhYF58gG1h7IA5cZB5FXyASkaMkZW1jc2AXR3FrP31qC3tlrxsUWxN6OsQyLf39+DlNQ0MYI+AYDPNFYvE4G11Jo0nAWExZApvpCMPlcskYE8YrwwX06BMpjAZixoRDflkQBgYAALCB0fK9fpNOD5LgAG2AGD4AEk6DsBDt5Js0gA+OACOAAajgAueNiBcvlDmCyAw8X+CvVAJBWPgOOhAkYAmAOv6eOms3IAB5WeyuXQhYyAIw7ABMGOAhHyuoAhKl0gBmQVUkiMOAAUSgJCu5AAqrCAB6YYQYOhwKAq8YskSbIA)

Sidewinder allows service methods to be tested directly without implicating the network. The `method(...)` function used to define service methods returns an awaitable function that when called; will execute the body of the function. The returned function implements the same schema validation checks that are used to validate data received via RPC.

```typescript
import { Type }       from '@sidewinder/contract'
import { WebService } from '@sidewinder/server'

// ---------------------------------------------------------------------------
// Contract
// ---------------------------------------------------------------------------

const Contract = Type.Contract({
    format: 'json',
    server: {
        'add': Type.Function([Type.Number(), Type.Number()], Type.Number()),
    }
})

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

const service = new WebService(Contract)

const addFunction = service.method('add', (clientId, a, b) => a + b)

// ---------------------------------------------------------------------------
// Test
// ---------------------------------------------------------------------------

const add = await addFunction('<clientId>', 1, 2)

if(add !== 3) throw Error('Unexpected result')
```

## Classes

[TypeScript Example Link](https://www.typescriptlang.org/play?#code/JYWwDg9gTgLgBAbzgFQJ5gKZwL5z-g-AMyghDgHIABAZ2ABMMB3YAO0agHoBjCVmKAENuMCgChQkWIjgAJCDRgAaOAHUMAIwDKGKADdg3LLhJlKtBszYdONXXt3ixnTnAC0Hz1+8-ff-wGB-s6uAMJ8AsIwIe5BcfEJiV5iYrysinDh-EIicAC8KOgYAHRZkSIAFAhiBETQIIIwAFyUAFY0fBRKNfh2+rot1YT4FIL09BQtaJjFAGIArqwiwHwVANrTJQBy8yAauhUAlCqbxTt7B4cAuidFZ7v7UEfHPcMUNPMak4UzC0swK1Y61O50eR1uM1BlxuP22D0uL2GeAoIHmABtvqc-stVhs7lCnsdYfcLoSYSD4YTEUiKPRgHpMXdsQDcRTSeDiQSjuT8ZTnt0CNgxNhDikXLEkpKpVKYgBZRoACx0+kMGBi0o1mqCKQwAA8pPBuGjBDQaHAADIQADmVt0MlecDR1oqxVdgigVpoLUErFQayuhxkaQ6aJKTqtLrdHpogaFQrEeoNcCNJrN8pgSvsqrgepgGHYZvU2izRgAPDAihAiJkIjkYAA+RAO4MCeYiaAVMBQemNLBQDBjPho1CO622qAtS023SBoZIj6YJ5lOuiwUOsCfNGGOBjej5OAZ4A0YogDAZiD0CqjcZdOAVI3AfMwACS9BUghUGkDeUbSEPx-DcdinDK9uEENFQz3XcKEOABuOB+xgeYoFYHc4AAajgDQcFXfANw0LduDgD5sIKf8TzPBULyvEjb3vLcn1fd9P2-X8DwVI9gLHXQuIjCgwIgjA91ouCELPZDUMEdwsJw9dN23VE0X3cjT3PS8UXROiH0Yt8dxY-I2PIwCeJA-jwMguBFJg+DEIktCACoZJFOSCO3Ok9GUjjj1Uqj1PcrSGP4Ji9Kw1iZCM7ioF40DzKEuB-NE2yULQ1xsOc+MW2IkssAKVhmDgdNMxVIwKjypgLUi54Yj6AwjGKXcr1LbSgvoetbwARhUAAmQ5igzfMKn7D40XgH9EFdYoRTgcUIDAFlWHAlJMqojJcvy+RFCOMQVpgYp5jsCoatVUUduAo88yBABWAAGW7DiAA)

Sidewinder provides support for class based programming by allowing RPC service types to be extended. This allows services to define dependencies via constructors and provides a basis for dependency injection. Sidewinder does not support decorators, but instead reuses the `method(...)` function defined on the base class. This allows functions to infer parameter and return types without explicit annotation.

```typescript
import { Type }             from '@sidewinder/contract'
import { Host, WebService } from '@sidewinder/server'

// ---------------------------------------------------------------------------
// Contract
// ---------------------------------------------------------------------------

const Contract = Type.Contract({
    format: 'json',
    server: {
        'add': Type.Function([Type.Number(), Type.Number()], Type.Number()),
        'sub': Type.Function([Type.Number(), Type.Number()], Type.Number()),
        'mul': Type.Function([Type.Number(), Type.Number()], Type.Number()),
        'div': Type.Function([Type.Number(), Type.Number()], Type.Number()),
    }
})

// ---------------------------------------------------------------------------
// MathService
// ---------------------------------------------------------------------------

export class Logger { 
    log(...args: any[]) { console.log(...args) }
}

export class MathService extends WebService<typeof Contract> {
    constructor(private readonly logger: Logger) {
        super(Contract)
    }
    public add = this.method('add', (clientId, a, b) => { this.logger.log('called add'); return a + b })
    public sub = this.method('sub', (clientId, a, b) => { this.logger.log('called sub'); return a - b })
    public mul = this.method('mul', (clientId, a, b) => { this.logger.log('called mul'); return a * b })
    public div = this.method('div', (clientId, a, b) => { this.logger.log('called div'); return a / b })
}

const service = new MathService(new Logger())
// service.add('<clientId>', 1, 2).then(result => {...}) // optional

const host = new Host()
host.use(service)
host.listen(5000)
```