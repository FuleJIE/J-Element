// 给 选定目标 上添加事件的钩子函数
import { onBeforeUnmount, onMounted, watch, isRef, unref } from "vue";
import type { Ref } from "vue";     // 对 vue 进行特殊优化，可以接收一个 ref 响应式对象

export default function useEventListener (
  // target: EventTarget,
  target: EventTarget | Ref<EventTarget | null>,
  event: string,
  handler: (e: Event) => any
) {
  if (isRef(target)) {
    // 判断 target 如果是 ref 对象，应该使用 watch 监听变化
    watch(target, (value, oldValue) => {
      // target 不仅可能由 null 变为 EventTarget，还有可能由一个 EventTarget 变成另一个 EventTarget。因此我们要先对旧值进行解绑
      oldValue?.removeEventListener(event, handler)
      value?.addEventListener(event, handler)
    })
    
  } else {
    onMounted(() => {
      target.addEventListener(event, handler)
    })
  }
  // unref() -- 是一个辅助函数，用于解包由 ref 或 reactive 创建的响应式对象，获取其原始值。（如果参数不是响应式对象，则直接返回其本身）
  onBeforeUnmount(() => {
    unref(target)?.removeEventListener(event, handler)
  })
}