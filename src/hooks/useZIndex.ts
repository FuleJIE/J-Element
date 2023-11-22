// 动态增加 CSS 属性 zIndex
import { ref, computed } from 'vue'

const zIndex = ref(0)
const useZIndex = (initialValue = 2000) => {
  const initialZIndex = ref(initialValue)
  const currentZIndex = computed(() => initialZIndex.value + zIndex.value)
  const nextZIndex = () => {
    zIndex.value++
    return currentZIndex.value
  }
  return {
    initialZIndex,
    currentZIndex,
    nextZIndex
  }
}

export default useZIndex