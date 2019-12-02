# Vue dyangjs Property Decorator

## License
MIT License

## Install

```bash
npm i -D dyangjs-property-decorator
```
## Usage

There are several decorators:
- [`@Prop`](#Prop)
- [`@Emit`](#Emit)
- [`@Watch`](#Watch)
- [`@Provide`](#Provide)
- [`@Inject`](#Inject)
- [`@Prop`](#Prop)
- [`@Component`](#Component)

There are several class:
- [`VueComponent`](#VueComponent)

There are several implements:
- [`ComponentExtend`](#ComponentExtend)

## See also

```tsx
import VueComponent,{ ComponentExtend, Component, Props } from 'dyangjs-property-decorator';

@Component({
    name:"YourComponentName"
})
class YourComponent extends VueComponent implements ComponentExtend{
    /** Props */
    @Props({
        default:"",
        type:String
    })
    text!:string

    /** Computed */
    get computedData(){
        return {
            testValue:1
        }
    }

    /** Methods */
    ClickMethod(){
        console.log('Click Method!!!');
    }

    /** 触发input事件 */
    @Emit('input')
    EmitInput(value:boolean){
        return value;
    }
    /** 触发change事件 */
    @Emit('change')
    EmitChange(value:any){
        return value;
    }

    @Watch("value")
    changeValue(value,valu1){
        console.log(value,valu1)
    }

    @Provide()
    test1(){
        return {
            'Form':this.value
        }
    }

    @Inject({
        from:"Form",
        default(){
            return undefined
        }
    })
    Form:any

    render(h){
        return {
            <button onClick={this.ClickMethod}>Click Me!</button>
        }
    }
}
export default YourComponent;
```


is equivalent to

```js
export default {
    props:{
        text:{
            default:"",
            type:String
        }
    },
    computed:{
        computedData(){
            return {
                testValue:1
            }
        }
    },
    watch:{
        value:function changeValue(value,valu1){
            console.log(value,valu1)
        }
    },
    provide(){
        return {
            'Form':this.value
        }
    },
    inject:{
        from:"Form",
        default(){
            return undefined
        }
    },
    methdos:{
        ClickMethod(){
            console.log('Click Method!!!');
        }
    }
}
```