import { describe, test, expect } from "vitest";
import Button from "./Button.vue";
import { mount } from '@vue/test-utils'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome' // 3.1 判断组件 FontAwesomeIcon 是否存在
import Icon from '../Icon/Icon.vue'

describe('Button vue', () => {
  // 1. 测试基础 button
  test('basic button', () => {
    // 将 Button 挂载到一个节点上（通过工具 mount）
    const wrapper = mount(Button, {
      props: {
        type: 'primary'
      },
      slots: {
        default: '你好button'
      }
    })
    console.log(wrapper.html()) // 输出挂载节点的 html
    // 报错：ReferenceError: document is not defined（vitest 默认环境是在 node 下的，没有对应的 DOM 环境）（配置 vitest.config.ts 解决）

    // 1.1 测试传入的 props 对应的 className 是否存在
    expect(wrapper.classes()).toContain('hj-button--primary') // wrapper.classes() 返回根节点上的 className
    // 1.2 slots 中的内容是否正确显示
    expect(wrapper.get('button').text()).toBe('你好button') // get() 获取根节点上的元素（如果找不到会报错），而 find 不会
    // 1.3 测试事件 events
    wrapper.get('button').trigger('click') // trigger() 触发事件 
    console.log(wrapper.emitted()) // wrapper.emitted() 返回一个对象，输出现在被触发的所有事件的名称 // 输出：{ click: [ [ [MouseEvent] ] ] }
    expect(wrapper.emitted()).toHaveProperty('click') // 期待对象里是否有特定属性
  })
  // 2. 测试 disabled
  test('disabled button', () => {
    const wrapper = mount(Button, {
      props: {
        disabled: true
      },
      slots: {
        default: 'disabled button'
      }
    })
    // 判断 button 上是否有 disabled 属性（方法一）
    expect(wrapper.attributes('disabled')).toBeDefined() // wrapper.attributes() 获取 DOM 节点上的属性，toBeDefined() - 被定义/存在的
    // 判断 button 上是否有 disabled 属性（方法二：拿到原生的 DOM 节点）
    expect(wrapper.find('button').element.disabled).toBeDefined()
    // 测试点击是否不会触发事件
    wrapper.get('button').trigger('click') // trigger() 触发事件 
    expect(wrapper.emitted()).not.toHaveProperty('click') // 期待对象里是否有特定属性
  })
  // 3. 测试 icon 属性（第三方库）（通过 stubs）
  test('icon button', () => {
    const wrapper = mount(Button, {
      props: {
        icon: 'arrow-up'
      },
      slots: {
        default: 'icon button'
      },
      global: {
        // 模拟 FontAwesomeIcon 组件
        stubs: ['FontAwesomeIcon']
      }
    })
    // 3.1 判断组件 FontAwesomeIcon 是否存在
    // console.log(wrapper.html())
    const iconElement = wrapper.findComponent(FontAwesomeIcon)
    expect(iconElement.exists()).toBe(true) // .exists() 判断组件是否存在
    // 3.2 判断 icon 属性是否正确
    expect(iconElement.attributes('icon')).toBe('arrow-up')
  })
  // 4. 测试 loading 属性
  test('loading button', () => {
    const wrapper = mount(Button, {
      props: {
        loading: true
      },
      slots: {
        default: 'loading button'
      },
      global: {
        // 4.1 将 stubs 提升一个层级，模拟我们二次分装的组件 Icon
        stubs: ['Icon']
      }
    })
    console.log(wrapper.html())
    // 4.2 此时在模拟中 FontAwesomeIcon 组件就找不到了
    // const iconElement = wrapper.findComponent(FontAwesomeIcon)
    // expect(iconElement.exists()).toBe(true)
    // 4.3 判断组件 FontAwesomeIcon 是否存在
    const iconElement = wrapper.findComponent(Icon)
    expect(iconElement.exists()).toBe(true)
    // 4.4 判断 icon 属性是否正确（默认值为spinner，并且是 disabled 的）
    expect(iconElement.attributes('icon')).toBe('spinner')
    expect(wrapper.attributes('disabled')).toBeDefined()
  })
})