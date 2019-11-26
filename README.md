# Vue dyangjs Property Decorator

## License
MIT License

## Install

```bash
npm i -S dyangjs-property-decorator
```
## Usage

There are several decorators:
- [`@Prop`](#Prop)
- [`@Component`](#Component)

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
    methdos:{
        ClickMethod(){
            console.log('Click Method!!!');
        }
    }
}
```