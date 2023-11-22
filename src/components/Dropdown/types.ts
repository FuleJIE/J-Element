import type { TooltipProps } from '../Tooltip/types' // 基于 Tooltip 的二次开发
import type { VNode } from 'vue'

export interface DropdownProps extends TooltipProps {
  menuOptions: MenuOption[]
  hideAfterClick?: boolean    // 点击选项后关闭菜单
}
export interface MenuOption {
  label: string | VNode       // 选项的内容，需要支持复杂结构
  key: string | number        // 每一个选项对应的标识符
  disabled?: boolean
  divided?: boolean           // 选项之间是否有分隔符（分隔线）
}

export interface DropdownEmits {
  (e: 'visible-change', value: boolean): void;
  (e: 'select', value: MenuOption): void; // 选择哪一个选项
}

export interface DropdownInstance {
	show: () => void;
  hide: () => void;
}