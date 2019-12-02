import Vue,{ CreateElement, VNode, ComponentOptions } from 'vue';
import VueRouter,{ Route } from 'vue-router';
import { NormalizedScopedSlot } from 'vue/types/vnode';

/** Inject 参数 */
interface InjectOptions {
    from:string,
    default?:Function
}

/** 是否Promise函数 */
const isPromise = (obj:any) => {
    return obj instanceof Promise || (obj && typeof obj.then === 'function');
}

/**
 * 对象合并
 * @param {*} targer Object
 * @param {*} source Object
 */
export function Merge(targer:Object, source:Object) {
    let value = new Object();
    for (let key in targer) {
        value[key] = typeof source[key] == 'number' ? source[key] : (source[key] || targer[key]);
    }
    for (let key in source) {
        if (targer[key]) continue;
        value[key] = source[key];
    }
    return value;
}

/** Vue定义继承类 */
export class VueComponent {
    $el?: Element;
    $options?: ComponentOptions<Vue>;
    $parent?: Vue;
    $root?: Vue;
    $children?: Vue[];
    $refs?: { [key: string]: Vue | Element | Vue[] | Element[] };
    $slots?: { [key: string]: VNode[] | undefined };
    $scopedSlots?: { [key: string]: NormalizedScopedSlot | undefined };    
    $data?: Record<string, any>;
    $props?: Record<string, any>;    
    $vnode?: VNode;
    $attrs?: Record<string, string>;
    $listeners?: Record<string, Function | Function[]>;
    $router?:VueRouter
    $route?:Route
    $emit?:(event:string,args:any) => void
}

/** Props装饰器 */
export function Props(options?: any) {
    if (options === void 0) { options = {}; }
    return function (target:any, key:string) {
        let data:any = new Object();
        const old = target.props || new Object();
        data[key] = options;
        target.props = Merge(old,data);
    };
}

/** Vue组件装饰器 */
export function Component(options?:any){
    return (target:any) => {
        if (options === void 0) { options = {}; }
        options.name = options.name || target._componentTag || target.name;
        var proto = target.prototype;
        const keys = ['props','provide','inject','watch'];
        let baseObjs:any = new Object();
        keys.map(key=>{
            baseObjs[key] = proto[key]
        });
        const Hooks = [
            'data',
            'beforeCreate',
            'created',
            'beforeMount',
            'mounted',
            'beforeDestroy',
            'destroyed',
            'beforeUpdate',
            'updated',
            'activated',
            'deactivated',
            'render',
            'errorCaptured',
            'serverPrefetch' // 2.6
        ];
        Object.getOwnPropertyNames(proto).forEach(function (key) {            
            if (key === 'constructor') {
                return;
            }
            if (Hooks.indexOf(key) > -1) {
                options[key] = proto[key];
                return;
            }
            var descriptor:any = Object.getOwnPropertyDescriptor(proto, key);            
            if (descriptor.value !== void 0) {
                // methods
                if (typeof descriptor.value === 'function') {
                    (options.methods || (options.methods = {}))[key] = descriptor.value;
                }
                else {
                    // typescript decorated data
                    (options.mixins || (options.mixins = [])).push({
                        data: function () {
                            let _a:any;
                            return _a = {}, _a[key] = descriptor.value, _a;
                        }
                    });
                }
            }
            else if (descriptor.get || descriptor.set) {
                // computed properties
                (options.computed || (options.computed = {}))[key] = {
                    get: descriptor.get,
                    set: descriptor.set
                };
            }
        });
        // decorate options
        var decorators = target.__decorators__;        
        if (decorators) {
            decorators.forEach(function (fn:Function) { return fn(options); });
            delete target.__decorators__;
        }     
        options = Merge(options,baseObjs);
        return options;
    }
}

/** Vue Provide 装饰器 */
export function Provide(){
    return function (target:any,method:string,descriptor:PropertyDescriptor){
        const data = descriptor.value;
        target.provide = typeof data === 'function' ? data : undefined;
    }
}

/** Vue Inject 装饰器*/
export function Inject(options:InjectOptions){
    return function (target:any, key:string) {
        let data:any = new Object();
        data[key] = options;
        target.inject = data;
    };
}

/** Vue Watch 装饰器 */
export function  Watch(event:string,options?:any){
    if (options === void 0) { options = {}; }
    return function (target:any, key:string,descriptor: PropertyDescriptor) {
        const value = descriptor.value;
        let data:any = new Object();
        const old = target.watch || new Object();
        if(options.deep){
            data[event] = Merge(options,{
                handler:value
            });
        }else{
            data[event] = value;
        }
        target.watch = Merge(old,data);
    };
}

/** Vue Emit事件装饰器 */
export function Emit(event:string){
    return function (target, key: string, descriptor: PropertyDescriptor) {
        var original = descriptor.value;
        descriptor.value = function emitter(){
            var _this:any = this;
            var args:any = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var emit = function (returnValue) {
                if (returnValue !== undefined)
                    args.unshift(returnValue);
                _this.$emit.apply(_this, [event || key].concat(args));
            };
            var returnValue = original.apply(this, args);
            if (isPromise(returnValue)) {
                returnValue.then(function (returnValue) {
                    emit(returnValue);
                });
            }
            else {
                emit(returnValue);
            }
            return returnValue;
        }
    }
}

/** Vue 实现类 */
export interface ComponentExtend{
    render?:(h:CreateElement) => any
    data?:()=>Object
    beforeCreate?:() => void    
    created?:() => void
    beforeMount?:() => void
    mounted?:() => void
    beforeDestroy?:() => void
    destroyed?:() => void
    beforeUpdate?:() => void
    updated?:() => void
    activated?:() => void
    deactivated?:() => void
    errorCaptured?:() => void
    /** Vue version > 2.6 */
    serverPrefetch?:() => void
}

export default VueComponent;