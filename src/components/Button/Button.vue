<template>
  <button
    ref="_ref"
    class="hj-button"
    :class="{
      [`hj-button--${type}`]: type,
      [`hj-button--${size}`]: size,
      'is-plain': plain,
      'is-round': round,
      'is-circle': circle,
      'is-disabled': disabled,
      'is-loading': loading
    }"
    :disabled="disabled || loading"
    :type="nativeType"
    :autofocus="autofocus"
  >
    <Icon icon="spinner" spin v-if="loading"/>
    <Icon :icon="icon" v-if="icon" />
    <span>
      <slot />
    </span>
  </button>
</template>

<!-- <script lang="ts">
// 只是用来定义一些组件的属性，两块script会自动合并
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'HjButton' // 如果不定义的话，默认为当前vue文件的名称
})
</script> -->
<script setup lang="ts">
import { ref } from 'vue';
import type { ButtonProps } from './types';
import Icon from '../Icon/Icon.vue' // 引入图标组件
defineOptions({ // 可以在 setup 中定义一些组件属性
  name: 'HjButton'
})
// 1.3 有了这个属性类型后，我们就可以确定组件的 props，并当作泛型传入
// defineProps<ButtonProps>()
// 2. 当 nativeType 属性不传时，给他设定默认值为 'button'
withDefaults(defineProps<ButtonProps>(), {
  nativeType: 'button'
})

// 1.4 第二种方式
// import { buttonProps } from './types'
// defineProps(buttonProps)

// 3. 把组件内部的原生 button DOM 节点（组件实例）暴露出去（defineExpose, 显示的指定要暴露出去的属性），因为使用 script setup 的组件默认是关闭的
const _ref = ref<HTMLButtonElement>()
defineExpose({
  ref: _ref  // 注意：ref 会和在普通实例中一样被自动解包 
})
</script>