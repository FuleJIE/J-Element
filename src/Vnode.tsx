// 1.1 该文件不需要 template，只有 script，因此 .vue 可以改为 .ts
// 1.2 因为当 DOM 结构比较复杂时，h 函数的写法就比较麻烦且难懂了，这时 JSX 就派上用场了，因此 .ts ⇒ .tsx（让 JSX 语法可以被转换成 DOM 节点）
// <script lang="ts">
import { h, defineComponent, ref } from 'vue'
// const vnode = h('div', { id: 'foo' }, 'hello')
export default defineComponent({
  name: 'Vnode',
  props: {
    msg: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const count = ref(1)
    // 第一种写法：render function 渲染函数
    // return () => h('h1', props.msg + count.value) // h 如果没有第二个参数，可以直接写第三个参数
    // 第二种写法：JSX（变量使用一个花括号 ）
    return () => (
      <div>
        <h1>{props.msg}</h1>
        <p>{count.value}</p>
      </div>
    )
  }
})