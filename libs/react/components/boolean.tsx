import { TBoolean } from '@sidewinder/contract'
import { SchemaComponentProperties } from './schema'
import * as React from 'react'

export interface BooleanComponentProperties<T extends TBoolean> extends SchemaComponentProperties {
    schema: T
    property: string
    value: T['$static']
}

export function BooleanComponent<T extends TBoolean>(props: BooleanComponentProperties<T>) {
    const [state, setState] = React.useState(props.value)
    function onChange(e: React.ChangeEvent<HTMLInputElement>) {
        props.onChange(props.property, e.target.value)
        setState(() => e.target.checked)
    }
    return <div className='type-boolean'>
        <div className='input'>
            <input type='checkbox' 
                placeholder={props.schema.placeholder} 
                name={props.property} 
                checked={state}
                onChange={onChange}
            ></input>
        </div>
    </div>
}

