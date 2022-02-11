import { TSchema, Type } from '@sidewinder/contract'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { SchemaComponent, Defaults } from '@sidewinder/react'

export interface AppProperties<T extends TSchema = TSchema> {
    schema: T
    value:  T['$static']
}

export function App(props: AppProperties) {
    const [value, setValue] = React.useState(props.value)
    function onChange(_: string, value: any) {
        setValue(value)
    }
    return <div className="app">
        <div className='left'>
            <SchemaComponent 
                property='new' 
                schema={props.schema} 
                value={value} 
                onChange={onChange} 
                />
        </div>
        <div className="right">
            <pre>{JSON.stringify(value, null, 2)}</pre>
        </div>
    </div>
}

const Vector = Type.Object({
    x: Type.Number(),
    y: Type.Number(),
    z: Type.Number()
})

const Schema = Type.Array(Vector, { minItems: 2 })

// const Value = [
//     {x: 1, y: 2, z: 3},
//     {x: 1, y: 2, z: 3},
//     {x: 1, y: 2, z: 3},
// ] as const

const Value = Defaults.resolve(Schema)

ReactDOM.render(<App schema={Schema} value={Value} />, document.getElementById('react'))


