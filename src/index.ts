import Vue,{ CreateElement, VNode, ComponentOptions } from 'vue';
import VueRouter,{ Route } from 'vue-router';
import { NormalizedScopedSlot } from 'vue/types/vnode';

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
        const props = proto.props;
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
        options.props = props;
        return options;
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