import type { Ref, InjectionKey } from 'vue'
export type NameType = string | number

export interface CollapseProps {
  modelValue: NameType[]       // 3.1.1 支持 v-model
  accordion?: boolean          // 手风琴模式
}

export interface CollapseItemProps {
  name: NameType
  title?: string
  disabled?: boolean
}

// 3.1.2 确定对应的事件
export interface CollapseEmits {
  (e: 'update:modelValue', values: NameType[]): void      // 支持 v-model 对应的事件（事件名称是固定的）
  (e: 'change', values: NameType[]): void                 // 点击 title 触发的事件
}

// 1.3 定义依赖注入的类型
export interface CollapseContext {
  activeNames: Ref<NameType[]>
  handleItemClick: (name: NameType) => void
}
// 1.4 要使用 Symbol() 来定义依赖注入独一无二的 key
export const collapseContextKey: InjectionKey<CollapseContext> = Symbol('collapseContextKey')