import type { VNode, ComponentInternalInstance } from 'vue'
export interface MessageProps {
  message?: string | VNode
  duration?: number           // 消息持续时间
  showClose?: boolean         // 是否显示关闭按钮
  type?: 'success' | 'info' | 'warning' | 'error'
  onDestory: () => void       // 2.2 函数式卸载组件的方法，且是必选的
  offset?: number             // 3.7 组件之间的偏移量
  id: string                  // 3.11.3 组件传入自己 id 到 getLastBottomOffset() 的参数中，同时因为是必选的， CreateMesssageProps 也要忽略
  zIndex: number              // 5.1 通过 createMessage 给组件添加 zIndex
  transitionName?: string     // 8. 添加可自定义过度动画
}

export type CreateMesssageProps = Omit<MessageProps, 'onDestory' | 'id' | 'zIndex'>   // 2.3 对于创建组件的参数 props，忽略通过 createMessage 扩展的属性

// 3.1（多个组件之间位置的计算）用于存储 createMessage 函数创建的实例
export interface MessageContext {
  id: string
  vnode: VNode
  props: MessageProps
  vm: ComponentInternalInstance       // 3.11.1 Vue 组件内部实例
  destroy: () => void                 // 4.2 实例上的手动删除方法
}