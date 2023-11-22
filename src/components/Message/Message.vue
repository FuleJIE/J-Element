<template>
<Transition
  :name="transitionName"
  @enter="updateHeight"
  @after-leave="destoryComponent"
>
  <div
    v-show="visible"
    class="hj-message"
    :class="{
      [`hj-message--${type}`]: type,
      'is-close': showClose
    }"
    role="alert"
    ref="messageRef"
    :style="cssStyle"
    @mouseenter="clearTimer"
    @mouseleave="startTimer"
  >
    <div class="hj-message__content">
      <slot>
        <!-- 这里 message 是可以选的，但 vNode 属性是必选的，因此用 v-if 类型断言 -->
        <RenderVnode :vNode="message" v-if="message"/>
      </slot>
    </div>
    <div class="hj-message__close" v-if="showClose">
      <!-- 这里使用 .stop 事件修饰符，阻止冒泡 -->
      <Icon @click.stop="visible = false" icon="xmark"/>
    </div>
  </div>
</Transition> 
</template>

<script setup lang='ts'>
import { ref, onMounted, watch, computed, nextTick } from 'vue';
import type { MessageProps } from './types';
import RenderVnode from '../../Common/RenderVnode'
import Icon from '../Icon/Icon.vue'
import { getLastInstance, getLastBottomOffset } from './method'
import useEventListener from '../..//hooks/useEventListener';

const props = withDefaults(defineProps<MessageProps>(), {
  duration: 3000,
  type: 'info',
  offset: 20,
  transitionName: 'fade-up'
})
// （交互）定义一个变量，控制组件显示/隐藏
const visible = ref(false)
// 3.6 获取上一个 Message 实例
// const prevInstance = getLastInstance()
// console.log('prev', prevInstance)
// 3.9 HTMLDivElement 用于表示 <div> 元素，它是 HTMLElement 的子类
const messageRef = ref<HTMLDivElement>()
// 3.10 计算偏移高度
// 3.10.1 当前这个 div 的高度 - 初始 visible = false 时，高度为 0，当 onMounted 后，再进行更新
const height = ref(0)
// 3.10.2 获取上一个实例的 BottomOffset，第一个是 0
const lastOffset = computed(() => getLastBottomOffset(props.id))
// 3.10.3 计算当前元素应有的 top
const topOffset = computed(() => lastOffset.value + props.offset)
// 3.10.4 计算当前元素的 bottomOffset，为下一个元素预留（通过 defineExpose）
const bottomOffset = computed(() => topOffset.value + height.value)
// 3.10.5 为根节点动态添加 CSS 样式
const cssStyle = computed(() => ({
  top: topOffset.value + 'px',
  zIndex: props.zIndex    // 5.3
}))

let timer: any
function startTimer() {
  if(props.duration === 0) return
  timer = setTimeout(() => {
    visible.value = false
  }, props.duration)
}
// 7. hover 到 Message 上面的时候不会自动关闭
function clearTimer() {
  clearTimeout(timer)
}
onMounted(async () => {
  visible.value = true
  startTimer()
  // 3.10.6 更新 height 的值（由于当前是同步的，即使 visible 被设置为 true ，DOM 节点其实还没来得及更新，我们需要等待 DOM 更新完毕，再取对应的值）
  // // async + await nextTick
  // await nextTick()      // 等待 DOM 更新完成
  // height.value = messageRef.value!.getBoundingClientRect().height // getBoundingClientRect() 可以拿到一系列和坐标相关的值
})

// 6. 添加键盘关闭（按 esc 可以关闭 Message）
function keydown(e: Event) {
  const event = e as KeyboardEvent
  if (event.code === 'Escape') {
    visible.value = false     // 这里还是使用统一的逻辑，所有的操作都通过 visible 控制，并且组件内对 visible 变化进行监听，然后调用卸载函数进行卸载
  }
} 
useEventListener(document, 'keydown', keydown)

// 2. 函数式实现组件卸载（通过扩展 props）
// watch(visible, (newValue) => {
//   if(!newValue) {
//     props.onDestory()
//   }
// })
// 8. 使用 Transition - JavaScript 钩子，在组件进入和离开的时候，进行高度设置和组件卸载（替换上面的逻辑）
function updateHeight () {
  height.value = messageRef.value!.getBoundingClientRect().height
}
function destoryComponent () {
  props.onDestory()
}

// 3.10.7 将当前元素的 bottomOffset 暴露出去，为下一个元素预留
defineExpose({
  bottomOffset,
  visible
})
</script>