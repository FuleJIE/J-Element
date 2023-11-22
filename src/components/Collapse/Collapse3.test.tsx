import { describe, expect, test, vi, beforeAll } from "vitest";
import { mount } from '@vue/test-utils'
import type { VueWrapper, DOMWrapper } from '@vue/test-utils'
import Collapse from "./Collapse.vue";
import CollapseItem from "./CollapseItem.vue";
import { h } from 'vue'

// 最终版：整理测试用例（看起来更清晰）
const onChange = vi.fn()
// 定义全局变量，供所有用例使用
let wrapper: VueWrapper
let headers: DOMWrapper<Element>[], contents: DOMWrapper<Element>[]
let firstContent: DOMWrapper<Element>, secondContent: DOMWrapper<Element>, disabledContent: DOMWrapper<Element>,
  firstHeader: DOMWrapper<Element>, secondHeader: DOMWrapper<Element>, disabledHeader: DOMWrapper<Element>

describe('Collapse vue', () => {
  // 通过钩子函数 beforeAll，声明公共组件实例，将其分配给全部用例使用
  beforeAll(() => {
    wrapper = mount(() => 
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
        stubs: ['Icon']
      },
      attachTo: document.body
    })
    // 赋初值
    headers = wrapper.findAll('.hj-collapse-item__header')
    contents = wrapper.findAll('.hj-collapse-item__wrapper')
    firstHeader = headers[0]
    secondHeader = headers[1]
    disabledHeader = headers[2]
    firstContent = contents[0]
    secondContent = contents[1]
    disabledContent = contents[2]
  })
  test('测试基础结构以及对应文本', () => {
    // 长度
    expect(headers.length).toBe(3)
    expect(contents.length).toBe(3)
    // 文本
    expect(firstHeader.text()).toBe('title a')

    // 内容
    expect(firstContent.isVisible()).toBe(true)
    expect(secondContent.isVisible()).toBe(false)
    expect(firstContent.text()).toBe('content a')
  })
  test('点击标题展开/关闭内容', async () => {
    // 行为
    await firstHeader.trigger('click')
    expect(firstContent.isVisible()).toBeFalsy()
    await secondHeader.trigger('click')
    expect(secondContent.isVisible()).toBeTruthy()
  })
  test('发送正确的事件', () => {
    expect(onChange).toHaveBeenCalledTimes(2)
    expect(onChange).toHaveBeenCalledWith([])
    expect(onChange).toHaveBeenLastCalledWith(['b'])
  })
  // 可以使用 test 上的修饰词，来修改应用效果 如：test.skip , test.only
  test.skip('disabled 的内容应该没有反应', async () => {
    // disabled（特殊的行为）
    expect(disabledHeader.classes()).toContain('is-disabled')
    await disabledHeader.trigger('click')
    expect(disabledContent.isVisible()).toBeFalsy()
    onChange.mockClear() // （重置）清空 onChange 上的状态（调用次数、数据）
    expect(onChange).not.toHaveBeenCalled() // 之前 onChange 对应的 mock 会传递下去（在之前调用了，现在判断没有调用过 -- 自然是不能通过的）
  })  

  test('测试手风琴模式', async () => {
    // 重新添加节点（开启手风琴模式）
    const wrapper2 = mount(() => 
      <Collapse modelValue={['a']} onChange={onChange} accordion>
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
    , 
    {
      global: {
        stubs: ['Icon']
      },
      attachTo: document.body
    })
    const SFQHeaders = wrapper2.findAll('.hj-collapse-item__header')
    const SFQContents = wrapper2.findAll('.hj-collapse-item__wrapper')
    const SFQHeader0 = SFQHeaders[0]
    const SFQHeader1 = SFQHeaders[1]
    const SFQContent0 = SFQContents[0]
    const SFQContent1 = SFQContents[1]

    // 行为
    await SFQHeader1.trigger('click')
    expect(onChange).toHaveBeenCalledWith(['b'])
    expect(SFQContent0.isVisible()).toBeFalsy()
    expect(SFQContent1.isVisible()).toBeTruthy()
    expect(SFQHeader0.classes()).not.toContain('is-active')
    expect(SFQHeader1.classes()).toContain('is-active')
  })
})