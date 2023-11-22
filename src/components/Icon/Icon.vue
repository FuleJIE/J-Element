<template>
  <i class="hj-icon" :class="{ [`hj-icon--${type}`]: type }" :style="customStyles" v-bind="$attrs">
    <!-- 1.2 将 FontAwesomeIconProps 中的所有 属性展开到组件 Icon 使用-->
    <!-- 1.4 此时就可以通过没有参数的 v-bind 将 $props 绑定到非根节点上了，其会将一个对象的所有属性都作为 attribute 应用到目标元素上（重点！） -->
    <!-- <font-awesome-icon v-bind="$props"/> -->
    <!-- 2.3 替换使用过滤后的 $props -->
    <font-awesome-icon v-bind="filteredProps"/>
  </i>
</template>

<script setup lang='ts'>
// import type { FontAwesomeIconProps } from '@fortawesome/vue-fontawesome'; // 1.1 （确定属性） FontAwesome 中已有提供图标的一系列属性 IconPark，将其直引入使用
import type { IconProps } from './types' // 1.5.1 由于 Vue3 setup 的限制，还不能直接从第三方导入 类型，进行使用
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome' // FontAwesome 基于 Vue3 的包装（组件）
import { omit } from 'lodash-es' // 2.1 omit方法可以过滤掉对象中要被忽略的属性，通过传入键值
import { computed } from 'vue';
defineOptions({
  name: 'HjIcon',
  // 1.3 $props 可以拿到所有的属性，但是 $props 默认是添加到根节点上的（i），所以这里我们要禁用【透传】，props 就不会透传到根组件上了
  inheritAttrs: false
})

// defineProps<IconProps>()
// 2.2 过滤 $props 中自定义的属性，剩下FontAwesomeIcon原始属性，传给它这个组件
const props = defineProps<IconProps>()
// const filteredProps = omit(props, ['type', 'color'])

// 3.2（Icon）同样一个小问题，当我们动态修改 props 时，本地的值没有得到更新
const filteredProps = computed(() => omit(props, ['type', 'color']))  

// 2.5 添加 color 属性（内联 style 优先级高于 class ，冲突时可以对其覆盖）
const customStyles = computed(() => {
  return props.color ? { color: props.color } : {}
})
</script>