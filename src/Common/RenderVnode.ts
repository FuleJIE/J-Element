// 脱离 Vue 这种文件类型的组件，使用 render function 写一个中介渲染函数组件，通过这个渲染函数组件可以自动解析传入的 VNode 节点
import { defineComponent } from "vue";

const RenderVnode = defineComponent({
  props: {
    vNode: {
      type: [String, Object],
      requierd: true
    }
  },
  setup(props) {
    return () => props.vNode
  }
})

export default RenderVnode