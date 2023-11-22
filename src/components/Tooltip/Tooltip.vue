<template>
  <div
    class="hj-tooltip"
    v-on="outerEvents"
    ref="popperContainerNode"
  >
    <div
      class="hj-tooltip__trigger"
      ref="triggerNode"
      v-on="events"
    >
      <slot />
    </div>
    <Transition :name="transition">
      <div
        v-if="isOpen"
        class="hj-tooltip__popper"
        ref="popperNode"
      >
        <slot name="content">
          {{ content }}
        </slot>
        <div id="arrow" data-popper-arrow></div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang='ts'>
import { ref, reactive, watch, onUnmounted, computed } from 'vue';
import type { TooltipProps, TooltipEmits, TooltipInstance } from './types'
import { createPopper } from '@popperjs/core';
import type { Instance } from '@popperjs/core';  // createPopper 会返回一个实例，上面有很多操作方法
import useClickOutside from '../../hooks/useClickOutside'
import { debounce } from 'lodash-es'; // 防抖函数
defineOptions({
  name: 'HjTooltip'
})
const props = withDefaults(defineProps<TooltipProps>(), {
  placement: 'bottom',
  trigger: 'hover',
  transition: 'fade',
  openDelay: 0,
  closeDelay: 0
})
const emits = defineEmits<TooltipEmits>()
// 5.2 支持 Popper 参数 Options
const popperOptions = computed(() => {
  return {
    // placement 在 popperOptions 中也可以提供，因此它的优先级要比 popperOptions 低，放在前面进行覆盖（混入）
    placement: props.placement,
    modifiers: [    //  popper 的偏移量
      {
        name: 'offset',
        options: {
          offset: [0, 9]
        }
      }
    ],
    ...props.popperOptions
  }
})
const isOpen = ref(false)

// 2. 动态事件（切换 trigger: hover | click 对应的回调）
let events: Record<string, any> = reactive({})  // 这两者要设置成响应式对象，这样，当 trigger 发生变化时，更新了这些动态事件，在模板上才能对应自动更新
let outerEvents: Record<string, any> = reactive({})  // 2.4 解决小bug，要求移出 trigger + popper 才隐藏 Popper

// 1.1 popper 的两个 DOM 节点
const triggerNode = ref<HTMLElement>() // 触发区的节点
const popperNode = ref<HTMLElement>() // 展示区的节点
let popperInstance: Instance | null = null // 定义 Popper 实例

// 2.1 （trigger: hover）对应的两个开关函数
// 7.2 支持延迟显示/隐藏 （加入 setTimeout）
const open = () => {
  isOpen.value = true
  emits('visible-change', true)
}
const close = () => {
  isOpen.value = false
  emits('visible-change', false)
}

// 7.3 加入 防抖 优化
const openDebounce = debounce(open, props.openDelay)
const closeDebounce = debounce(close, props.closeDelay)

// 7.4 再次优化（取消掉上一次的相反操作）
const openFinal = () => {
  closeDebounce.cancel()
  openDebounce()
}
const closeFinal = () => {
  openDebounce.cancel()
  closeDebounce()
}

// 1.2 开关 Popper，同时调用 emits 事件（trigger: click）
const togglePopper = () => {
  // isOpen.value = !isOpen.value
  // emits('visible-change', isOpen.value)
  if (isOpen.value) {
    closeFinal()
  } else {
    openFinal()
  }
}

// 2.2 对于 trigger 属性，动态添加不同的事件
const attachEvents = () => {
  if (props.trigger === 'hover') {
    events['mouseenter'] = openFinal
    // events['mouseleave'] = close
    outerEvents['mouseleave'] = closeFinal // 2.4 解决小bug，要求移出 trigger + popper 才隐藏 Popper
  } else if (props.trigger === 'click') {
    events['click'] = togglePopper
  }
}
// 4.1 加上条件，如果没有设置手动触发，才加上动态事件
if (!props.manual) {
  // 2.3 注意：并且要在 setup 执行时，手动执行一次 attachEvents 函数，添加上当前对应的事件
  attachEvents()
}
// 4.2 并且当 manual 属性发生变化时，我们要做出相应更改（这点是通性，当前组件已经出现多次）
watch(() => props.manual, (isManual) => {
  if (isManual) {
    events = {}
    outerEvents = {}
  } else {
    attachEvents()
  }
})
// 2.5 并且：要监听 trigger 属性的修改，如果修改了，我们要对事件进行重置
watch(() => props.trigger, (newTrigger, oldTrigger) => {
  // 4.1 同样这里也要加上 manual 的判断
  if (newTrigger !== oldTrigger && !props.manual) {
    events = {}
    outerEvents = {}
    attachEvents()
  }
})

// 1.3 当 togglePopper 开关 popper 时，要进行监听 popper 是否是打开状态，以创建 Popper 实例
watch(isOpen, (newValue) => {
  // 如果 popper 是打开状态(isOpen = true)，就创建实例，否则销毁实例（错误：这样会导致 popper 闪烁，应该当绑定的节点不存在时才销毁实例）
  if (newValue) {
    if (triggerNode.value && popperNode.value) {
      // popperInstance = createPopper(triggerNode.value, popperNode.value, { placement: props.placement })
      // 5.3 将选项替换为计算过的 popperOptions
      popperInstance = createPopper(triggerNode.value, popperNode.value, popperOptions.value)
    } else {
      popperInstance?.destroy()
    }
  } 
  // 注意： watch 的调用时间，要设置在 DOM 节点生成之后才触发，此时 ref（triggerNode，popperNode）才能获取得到当前的 DOM 节点
}, { flush: 'post'})

// 3. 调用自定义 hooks - useClickOutside，实现点击外侧隐藏
const popperContainerNode = ref<HTMLElement>() // 这个响应式节点，即针对“谁”的外侧，应该是根节点（囊括这整个组件）
useClickOutside(popperContainerNode, () => {
  // 4.1 同样这里也要加上 manual 的判断（否则会有bug）
  if (props.trigger === 'click' && isOpen.value && !props.manual) {
    closeFinal()
  }
})

// 一点优化工作（收尾），主动卸载 Popper 实例，因为可能 isOpen 并没有触发相关逻辑
onUnmounted(() => {
  popperInstance?.destroy()
})

// 4.3 暴露组件实例的两个方法
defineExpose<TooltipInstance>({
  'show': openFinal,
  'hide': closeFinal
})
</script>