// 通用hooks -- 点击元素外侧关闭展示 
import { onMounted, onBeforeUnmount, type Ref } from 'vue'
// 1. 参数：传入响应式节点，确定在哪个 DOM 节点外侧; 传入点击外侧要执行的回调函数
const useClickOutside = (elementRef: Ref<undefined | HTMLElement>, callback: (e: MouseEvent) => void) => {
  const handler = (e: MouseEvent) => {
    // e 是个鼠标事件，通过 e.target 可以获取当前点击的 DOM 节点
    // Node.contains() 判断一个节点是否是当前节点的后代（包括当前节点本身）（关键！）
    if (elementRef.value && e.target) {
      if (!elementRef.value.contains(e.target as HTMLElement)) {
        callback(e) // 把当前点击的节点传出去以便使用
      }
    }
  }
  // 应该将点击区域设为 document，在其身上添加事件（记得有始有终）
  onMounted(() => {
    document.addEventListener('click', handler)
  })
  onBeforeUnmount(() => {
    document.removeEventListener('click', handler)
  })
}

export default useClickOutside