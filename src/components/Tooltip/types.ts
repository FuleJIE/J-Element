import type { Placement, Options } from "@popperjs/core"

export interface TooltipProps {
  content?: string
  trigger?: 'hover' | 'click'         // 触发的方式
  placement?: Placement               // popper 的展示方位
  manual?: boolean                    // 是否开启手动触发
  popperOptions?: Partial<Options>    // 5.1 将 Popper 的参数 Options 对应的类型改为可选的
  transition?: string                 // 6.1 添加动画
  openDelay?: number                  // 7.1 支持延迟显示/隐藏
  closeDelay?: number
}

export interface TooltipEmits {
  (e: 'visible-change', value: boolean): void
}

export interface TooltipInstance {
  show: () => void
  hide: () => void
}