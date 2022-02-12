/*--------------------------------------------------------------------------

@sidewinder/react

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

import * as React from 'react'
import { TLiteral, TUnion }          from '@sidewinder/contract'
import { SchemaComponentProperties } from './schema'
import { Default }                   from './default'

function isRenderable<T extends TUnion>(union: T) {
    return union.anyOf.every(schema => schema.kind === 'Literal')
}

export interface UnionComponentProperties<T extends TUnion> extends SchemaComponentProperties {
    schema: T
    property: string
    value: T['$static']
}

export function UnionComponent<T extends TUnion>(props: UnionComponentProperties<T>) {
    const [state, setState] = React.useState(props.value)
    
    async function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const schema = (props.schema.anyOf as any).find((schema: TLiteral) => {
            
        })
        props.onChange(props.property, e.target.value)
        setState(e.target.value) 
    }
    
    if(isRenderable(props.schema)) {
        return <div className='type-union'>
            <select onChange={onChange} value={state as any}>
                {props.schema.anyOf.map((schema, index) => {
                    return <option key={index}>{Default.Create(schema) as any}</option>
                })}
            </select>
        </div>
    } else {
        return <div className='type-union'>
            <span>Can only render unions of literal values</span>
        </div>
    }
}
