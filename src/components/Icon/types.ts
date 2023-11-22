// 1.5.2 使用中间继承的方式，也还是报错
// import type { FontAwesomeIconProps } from '@fortawesome/vue-fontawesome' // 1.1 （确定属性） FontAwesome 中已有提供图标的一系列属性 IconPark，将其直引入使用
// export interface IconProps extends FontAwesomeIconProps {
  
// }

// 1.5.3 因此只能下策，直接复制 FontAwesomeIconProps 中的所有属性，重新定义
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
export interface IconProps {
  // 1. 支持组件的原生属性
  border?: boolean
  fixedWidth?: boolean
  flip?: 'horizontal' | 'vertical' | 'both'
  icon: object | Array<string> | string | IconDefinition
  mask?: object | Array<string> | string
  listItem?: boolean
  pull?: 'right' | 'left'
  pulse?: boolean
  rotation?: 90 | 180 | 270 | '90' | '180' | '270'
  swapOpacity?: boolean
  size?: '2xs' | 'xs' | 'sm' | 'lg' | 'xl' | '2xl' | '1x' | '2x' | '3x' | '4x' | '5x' | '6x' | '7x' | '8x' | '9x' | '10x'
  spin?: boolean
  transform?: object | string
  symbol?: boolean | string
  title?: string
  inverse?: boolean
  bounce?: boolean
  shake?: boolean
  beat?: boolean
  fade?: boolean
  beatFade?: boolean
  spinPulse?: boolean
  spinReverse?: boolean

  // 2. 扩充组件属性
  type?: 'primary' | 'success' | 'info' | 'warning' | 'danger' // 自己组件库的色彩系统
  color?: string  // 图标的颜色
}
