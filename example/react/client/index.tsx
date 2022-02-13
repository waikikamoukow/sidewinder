import * as React from 'react'
import * as ReactDOM from 'react-dom'

import { TSchema, Type } from '@sidewinder/contract'
import { Form, Default } from '@sidewinder/react'

export interface AppProperties<T extends TSchema = TSchema> {
    schema: T
    value?: T['$static']
}

export function App(props: AppProperties) {
    const [value, setValue] = React.useState(props.value)
    function onChange(value: any) {
        setValue(value)
    }
    return <div className="app">
        <div className='left'>
            <Form
                schema={props.schema}
                value={value as any}
                onChange={onChange}
            />
        </div>
        <div className="right">
            <pre>{JSON.stringify(value, null, 2)}</pre>
        </div>
    </div>
}

const F = Type.Function([Type.String(), Type.Number()], Type.String())

const Schema = F

ReactDOM.render(<App schema={Schema} />, document.getElementById('react'))


