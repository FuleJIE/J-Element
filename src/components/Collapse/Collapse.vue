<template>
  <div
    class="hj-collapse"
  >
    <slot/>
  </div>
</template>

<script setup lang='ts'>
import { ref, provide, watch } from 'vue';
import type { NameType, CollapseProps, CollapseEmits } from './types';
import { collapseContextKey } from './types'
defineOptions({
  name: 'HjCollapse'
})

const props = defineProps<CollapseProps>()
const emits = defineEmits<CollapseEmits>()

// 在父组件中处理激活数组的变化（默认所有 item 都是关闭的，即数组为空）
// const activeNames = ref<NameType[]>([])
// 3.2.1 将 v-model 初始化到 activeNames 上，而不是空数组了
const activeNames = ref<NameType[]>(props.modelValue)
// 3.4.1 修复一个小问题：当我们动态的修改 modelValue 这个 props 值时，本地的值没有得到更新
watch(() => props.modelValue, () => {
  activeNames.value = props.modelValue
})

// 处理函数（1.1 要传给item子组件调用）
const handleItemClick = (item: NameType) => {
  if (props.accordion) {
    // 考虑手风琴模式
    // 如果当前点击项是数组里的第一项（唯一一项），则清除当前项，否则替换成当前项
    // 并且用仅有一个数组元素的数组，去更新当前 activeNames，使得 activeNames 要么为空，要么为之前为展开的点击项
    activeNames.value = [ activeNames.value[0] === item ? '' : item ]
  } else {
    // 不考虑手风琴模式
    const index = activeNames.value.indexOf(item)
    if (index > -1) {
      // 存在，删除数组对应一项
      activeNames.value.splice(index, 1)
    } else {
      // 不存在，插入对应的 name
      activeNames.value.push(item)
    }
  }

  // 3.2.2 触发 v-model 事件
  // emits('update:modelValue', activeNames.value)
  // emits('change', activeNames.value)
  let _activeNames = [... activeNames.value] // （此处由测试发现 - Collapse2.test.tsx）由于调用事件，传入的参数是 ref，所以会导致获取到的数据也是 ref 对象，activeNames 又是个数组，因此返回的是对象的引用，有时可能导致第一次和第二次调用获取的结果是相等的，这里我们把他转为普通数组传入
  emits('update:modelValue', _activeNames)
  emits('change', _activeNames)
}

// 1.2 由于当前子组件是 slot 形式，没法通过 props 传递，所以使用 Provide/Inject 来透传（实现了不用属性，从父组件到子组件的通信方式）
provide(collapseContextKey, {
  activeNames,
  handleItemClick
})
</script>