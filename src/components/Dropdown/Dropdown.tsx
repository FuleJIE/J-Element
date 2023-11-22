import { defineComponent, computed, Fragment, ref } from "vue";
import type { PropType } from "vue";
import type { Placement, Options } from "@popperjs/core";
import type { MenuOption } from './types'
import Tooltip from "../Tooltip/Tooltip.vue";
import type { TooltipInstance } from "../Tooltip/types";

export default defineComponent({
  name: 'HjDropdown',
  props: {
    placement: {
      type: String as PropType<Placement>,
      default: 'bottom'
    },
    trigger: {
      type: String as PropType<'hover' | 'click'>,
      default: 'hover'
    },
    transition: {
      type: String,
      default: 'fade'
    },
    openDelay: {
      type: Number,
      default: 0
    },
    closeDelay: {
      type: Number,
      default: 0
    },
    popperOptions: {
      type: Object as PropType<Options>
    },
    menuOptions: {
      type: Array as PropType<MenuOption[]>,
      required: true
    },
    hideAfterClick: {
      type: Boolean,
      default: true
    }
  },
  emits: ['visible-change', 'select'],
  setup(props,{ slots, emit, expose }) {
    // 1. JSX 中不能使用 v-for，因此循环生成节点。在 vue 中为 JSX 提供了 Fragment 用来生成空节点 ⇒ 效果类似于 template
    // 2. JSX 中也不能使用 v-if，通过三元表达式的形式展现
    // 3. JSX 中对 VNode 是非常友好的，可以直接展示，不需要通过通用组件 RenderVnode 解析了
    const options = computed(() => {
      return props.menuOptions.map(item => {
        return (
          <Fragment key={item.key}>
            { item.divided ? <li role="separator" class="divided-placeholder" />  : ''}
            <li
              class={{'hj-dropdown__item': true, 'is-disabled': item.disabled, 'is-divided': item.divided }}
              id={`dropdown-item-${item.key}`}
              onClick={() => itemClick(item)}
            >
              { item.label }
              {/* <RenderVnode :vNode="item.label"/> */}
            </li>
          </Fragment>
        )
      })
    })
    // 还原方法，暴露实例
    const tooltipRef = ref<TooltipInstance | null>(null)
    const visibleChange = (e: boolean) => {
      emit('visible-change', e) 
    }
    const itemClick = (e: MenuOption) => {
      if (e.disabled) {
        return
      }
      emit('select', e)
      // 点击选项后关闭菜单（点击 disabled 的不会被关闭）
      if(props.hideAfterClick) {
        tooltipRef.value?.hide()
      }
    }
    expose({
      show: () => tooltipRef.value?.show(),
      hide: () => tooltipRef.value?.hide()
    })
    // render function (JSX 语法)
    return () => (
      <div
        class="hj-dropdown"
      >
        <Tooltip
          trigger={props.trigger}
          placement={props.placement}
          popper-options={props.popperOptions}
          open-delay={props.openDelay}
          close-delay={props.closeDelay}
          ref={tooltipRef}
          onVisible-change={visibleChange}
        >
          {{
            default: () => slots.default && slots.default(),
            content: () => (
              <ul class="hj-dropdown__menu">
                { options.value }
              </ul>
            )
          }}
        </Tooltip>
      </div>
    )
  }
})