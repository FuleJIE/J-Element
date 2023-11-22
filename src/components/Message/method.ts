// render 函数（不是渲染函数 h） - 用于将组件 Render 到 DOM 节点上
import { render, h, shallowReactive } from 'vue'
import type { CreateMesssageProps, MessageContext } from "./types"
import MessageConstructor from './Message.vue'
import useZIndex from '../../hooks/useZIndex'

// 3.1 中枢神经
let seed = 1
// const instances: MessageContext[] = []
// const instances: MessageContext[] = reactive([]) // 3.9 关键一招：解决组件不能成功获取到上一次的 bottomOffset
const instances: MessageContext[] = shallowReactive([]) // 优化性能

export const createMessage = (props: CreateMesssageProps) => {
  const id = `message_${seed++}`
  const { nextZIndex } = useZIndex()    // 5.4 使用 hooks - useZIndex 导出的方法，来动态增加 zIndex

  const container = document.createElement('div') // 1.1 要挂载的 DOM 节点
  // 2.1 扩展参数 props，加入卸载函数，在创建 vnode 时重新传入 newProps
  const destroy = () => {
    // 3.5 当卸载组件时，我们不仅要在文档中对应删除，还要删除数组中的当前实例
    const idx = instances.findIndex(instance => instance.id === id)
    if (idx === -1) return
    instances.splice(idx, 1)

    render(null, container) 
  }
  // 4.1 手动调用删除（并添加到 instance 属性中）
  // 要用与组件内部统一的逻辑去删除组件 -- visible.value = false，其实就是手动的调整组件中的 visible 的值。（visible 是通过 expose 暴露出来的）
  const manualDestroy = ()  => {
    const instance = instances.find(instance => instance.id === id)
    if (instance) {
      instance.vm.exposed!.visible.value = false      // expose 暴露出来的响应式对象不仅可以取值，还可以进行赋值
    }
  }
  const newProps = {
    ...props,
    onDestory: destroy,
    id,    // 3.11.4 将中枢神经的 id 添加到新 props 中，让组件可以拿到
    zIndex: nextZIndex()      // 5.2 添加 zIndex
  }
  const vnode = h(MessageConstructor, newProps) // 1.2 创建对应的 vnode 节点
  render(vnode, container) // 1.3 将 vnode 渲染到 DOM 节点上

  // 1.4 最后，将 DOM 节点插入到 body 中（去掉我们创建的多余的外层 div）; 非空断言操作符（类型断言的快捷方式 -- !）
  document.body.appendChild(container.firstElementChild!)

  // 3.11.2 获取 vue 组件内部实例对象（vnode 上的一个属性 component）并添加到 Message 实例对象属性中
  const vm = vnode.component!
  // 3.2 将所有用 createMessage() 创建的实例用数组的形式存储起来
  const instance = {
    id,
    vnode,
    props: newProps,
    vm,
    destroy: manualDestroy
  }
  instances.push(instance)
  return instance       // 3.3 导出当前实例，后期在这个实例上面添加的属性和方法都可以返回到这个实例中，供使用者进行调用
}

// 3.4 获取上一个 Message 实例
export const getLastInstance = () => {
  return instances.at(-1)   // 数组最后一项
}

// 3.8 获取上一个实例的 BottomOffset
export const getLastBottomOffset = (id: string) => {
  const idx = instances.findIndex(instance => instance.id === id)
  if (idx <= 0) {
    // 这里把 -1 和 0 整合了 -- 第一项的情况（0px）
    return 0
  } else {
    const prev = instances[idx - 1]
    return prev.vm.exposed!.bottomOffset.value
  }
}

// 由测试改进
export const closeAll = () => {
  instances.forEach(instance => {
    instance.destroy()
  })
}