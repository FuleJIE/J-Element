
import { createApp } from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core' // Fontawesome 图标库
import { fas } from '@fortawesome/free-solid-svg-icons' // 图标库 free-solid 中所有图标
// import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome' // FontAwesome 基于 Vue3 的包装（组件）
import App from './App.vue'

// import './assets/main.css' // 使用 reset.css 规定了系统默认样式了，就不需要原来的样式了，防止干扰
import './styles/index.css' // 导入全局 CSS 自定义属性（变量）

library.add(fas) // 添加这些图标

createApp(App)
// .component('font-awesome-icon', FontAwesomeIcon) // 注册为全局组件（在所有的子组件中可以直接使用）（改为在 Icon 组件中引用）
.mount('#app')
