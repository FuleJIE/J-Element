import { describe, test, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import Tooltip from "./Tooltip.vue";

const onVisibleChange = vi.fn()
vi.mock('@popperjs/core') // 把第三方库模拟掉
describe('Tooltip.vue', () => {
  beforeEach(() => {
    vi.useFakeTimers() // 模拟定时器
  })
  test('basic tooltip', async () => {
    const wrapper = mount(() => 
      <div>
        <div id="outside"></div>
        <Tooltip content="hello tooltip" trigger="click" onVisible-change={onVisibleChange}>
          <button id="trigger">Trigger</button>
        </Tooltip>
      </div>
    ,{
      attachTo: document.body
    })
    // 静态测试
    const triggerArea = wrapper.find('#trigger')
    expect(triggerArea.exists()).toBeTruthy()
    expect(wrapper.find('.hj-tooltip__popper').exists()).toBeFalsy()
    console.log(wrapper.html())
    // 测试行为
    triggerArea.trigger('click') // 这里有个延迟操作，所以如果不加入定时器模拟的话，是会报错的
    await vi.runAllTimers() // 将所有的定时器运行完毕
    expect(wrapper.find('.hj-tooltip__popper').exists()).toBeTruthy()
    expect(wrapper.get('.hj-tooltip__popper').text()).toBe('hello tooltip')
    expect(onVisibleChange).toHaveBeenCalledWith(true) // 测试事件
    console.log(wrapper.html())

    // triggerArea.trigger('click')
    wrapper.get('#outside').trigger('click')  // 测试点击外侧
    await vi.runAllTimers()
    expect(wrapper.find('.hj-tooltip__popper').exists()).toBeFalsy()
    expect(onVisibleChange).toHaveBeenLastCalledWith(false)

  })
})