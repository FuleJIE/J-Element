<template>
  <div
    class="hj-collapse-item"
    :class="{
      'is-disabled': disabled
    }"
  >
    <!-- 这里 class 命名是参考 BEM 命名规则，如果是修饰 a 的样式的 ⇒ "a--xxx"，如果是属于 a 的并且描述 a 中的内容的 ⇒ "a__xxx" -->
    <div 
      class="hj-collapse-item__header" 
      :class="{
        'is-disabled': disabled,
        'is-active': isActive
      }" 
      :id="`item-header-${name}`" 
      @click="handleClick"
    >
      <slot name="title">{{ title }}</slot>
      <Icon icon="angle-right" class="header-angle" />
    </div>
    <!-- 4.1 添加原生 Transition 组件  -->
    <Transition name="slide" v-on="transitionEvents">
      <!-- 4.4 添加一个父节点，解决 padding 卡顿问题，并把 v-show 移动到这个父节点身上 -->
      <div class="hj-collapse-item__wrapper" v-show="isActive">
        <div class="hj-collapse-item__content" :id="`item-content-${name}`">
          <slot/>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang='ts'>
import { inject, computed } from 'vue'
import type { CollapseItemProps } from './types';
import { collapseContextKey } from './types'
import Icon from '../Icon/Icon.vue' // 引入图标组件

defineOptions({
  name: 'HjCollapseItem'
})
// 这里定义变量存储 props 中的值，方便后续逻辑使用 
const props = defineProps<CollapseItemProps>()

// 1.5 引入
const collapseContext = inject(collapseContextKey)

// 2.1 判断当前 item 的 content 是否要显示
const isActive = computed(() => collapseContext?.activeNames.value.includes(props.name))
// 2.2 处理函数
const handleClick = () => {
  // 考虑到 disabled 属性，如果是 disabled 时，不需要做任何处理，应该直接返回
  if(props.disabled) { return }
  // 如果是其他情况就继续调用下去（传入当前 item 的唯一标识 name 属性）
  collapseContext?.handleItemClick(props.name)
}

// 4.3 通过一个事件 object，包裹 Transition 的 6 个 JavaScript 钩子，然后用 v-on 赋值给 Transition 标签上（就不用一个个添加了）
// transitionEvents 是个 object 是 Record 类型，它的 key 是 string（JavaScript 钩子名），它的值是对应的函数 function，函数有一个参数 el 对应的 HTMLElement
// Record<K,T> 构造具有给定类型 T 的一组属性 K 的类型。在将一个类型的属性映射到另一个类型的属性时，Record 非常方便。（待理解）
const transitionEvents: Record<string, (el: HTMLElement) => void> = {
  beforeEnter(el) {
    el.style.height = '0px'
    // 4.5 添加 overflow: hidden 解决 子元素超出父元素的问题（看起来：子元素直接显示出来，动画才慢慢过渡）
    el.style.overflow = 'hidden'
  },
  enter(el) {
    el.style.height = `${el.scrollHeight}px` // scrollHeight - 元素内容的总高度，包括超出视口范围的部分
  },
  afterEnter(el) {
    // 动画已经结束，不需要这个属性了，删除
    el.style.height = ''
    el.style.overflow = ''
  },
  beforeLeave(el) {
    el.style.height = `${el.scrollHeight}px`
    el.style.overflow = 'hidden'
  },
  leave(el) {
    el.style.height = '0px'
  },
  afterLeave(el) {
    el.style.height = ''
    el.style.overflow = ''
  }
}


</script>