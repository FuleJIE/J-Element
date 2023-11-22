import type { PropType } from 'vue'

// 1.1 属性 type 和 size（由于它们都是需要从几个特定的字符串中选择，所以想到使用字符串 类型别名字面量）
export type ButtonType = 'primary' | 'success' | 'info' | 'warning' | 'danger'
export type ButtonSize = 'large' | 'small'
// 2. 原生 button 的原生属性
export type NativeType = 'submit' | 'reset' | 'button'

// 1.2 组件属性对应的interface（组件所有的属性都是可选的，不传就是默认值）
export interface ButtonProps {
  type?: ButtonType
  size?: ButtonSize
  plain?: boolean
  round?: boolean
  circle?: boolean
  disabled?: boolean
  nativeType?: NativeType
  autofocus?: boolean
  // 引入图标组件
  icon?: string
  loading?: boolean
}

// 3.2 描述暴露的组件实例
export interface ButtonInstance {
  ref: HTMLButtonElement
}

// 1.4 声明props有两种方式：一个是通过类型标注（纯类型，更简便，但不支持复杂类型），第二个是通过传入一个props对象形式（字符串数组也可）（Element-Plus目前是这种方式，局限于Vue3.3以前不支持外部类型导入）
export const buttonProps = {
  type: {
    type: String as PropType<ButtonType>
  },
  size: {
    type: String as PropType<ButtonSize>
  },
  plain: {
    type: Boolean
  },
  round: {
    type: Boolean
  },
  circle: {
    type: Boolean
  },
  disabled: {
    type: Boolean
  }
}