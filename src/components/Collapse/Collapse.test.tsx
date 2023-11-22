import { describe, expect, test, vi } from "vitest";
import { mount } from '@vue/test-utils'
import Collapse from "./Collapse.vue";
import CollapseItem from "./CollapseItem.vue";
import { h } from 'vue'

// 方法一：渲染函数 h
// describe('Collapse vue', () => {
//   test('basic collapse', () => {
//     const wrapper = mount(Collapse, {
//       props: {
//         modelValue: ['a']
//       },
//       slots: {
//         // default: '<CollapseItem name="a" title="Title A">this is content bbb</CollapseItem>'
//         default: h(CollapseItem, { name: 'a', title: 'Title A' }, 'content aaa')
//       },
//       global: {
//         // CollapseItem 中有第三方组件，我们记得要把它模拟掉
//         stubs: ['Icon']
//       }
//     })
//     console.log(wrapper.html())
//   })
// })

// 方法二：JSX
describe('Collapse vue', () => {
  test('basic collapse', async () => {
    const onChange = vi.fn() // vitest 函数模块，vi.fn() 创建一个回调函数的模拟
    const wrapper = mount(() => 
      // JSX 绑定方法，通过 onXxxx 来传入
      <Collapse modelValue={['a']} onChange={onChange}>
        <CollapseItem name="a" title="title a">
          content a
        </CollapseItem>
        <CollapseItem name="b" title="title b">
          content b
        </CollapseItem>
        <CollapseItem name="c" title="title c" disabled>
          content c
        </CollapseItem>
      </Collapse>
    , {
      global: {
        // CollapseItem 中有第三方组件，我们记得要把它模拟掉
        stubs: ['Icon']
      },
      attachTo: document.body // css 小 bug
    })
    // console.log(wrapper.html())
    
    // 1. 测试是否渲染出对应结构，组件是否有对应的属性，对应文本
    const headers = wrapper.findAll('.hj-collapse-item__header') // findAll() 返回一个数组
    const contents = wrapper.findAll('.hj-collapse-item__wrapper')
    
    // 长度
    expect(headers.length).toBe(3)
    expect(contents.length).toBe(3)

    // 文本
    const firstHeader = headers[0]
    const secondHeader = headers[1]
    expect(firstHeader.text()).toBe('title a')

    // 内容
    const firstContent = contents[0]
    const secondContent = contents[1]
    const disabledContent = contents[2]
    expect(firstContent.isVisible()).toBe(true) // .isVisible() 判断 v-show 是否为 true
    expect(secondContent.isVisible()).toBe(false)
    expect(firstContent.text()).toBe('content a')

    // 行为
    await firstHeader.trigger('click') // 这里要加 异步，等待 DOM 节点的更新，再进行判断
    expect(firstContent.isVisible()).toBeFalsy()
    expect(firstContent.text()).toBe('content a')
    expect(onChange).toHaveBeenCalledWith([]) // （测试事件方法二）toHaveBeenCalledWith() 使用什么样的参数被调用
    await secondHeader.trigger('click')
    expect(secondContent.isVisible()).toBeTruthy()
    expect(onChange).toHaveBeenLastCalledWith(['b']) // （测试事件方法二）toHaveBeenLastCalledWith() 最后一次被什么样的参数调用

    // disabled（特殊的行为）
    const disabledHeader = headers[2]
    expect(disabledHeader.classes()).toContain('is-disabled')
    await disabledHeader.trigger('click')
    expect(disabledContent.isVisible()).toBeFalsy()
  })
})