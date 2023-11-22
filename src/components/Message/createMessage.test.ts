import { describe, test, expect, vi } from 'vitest'
import { nextTick } from 'vue'
import { createMessage, closeAll } from './method'

// 以下方法源自 element-plus 源码
// in order to test transitions, we need to use
// await rAF() after firing transition events.
// 为了测试 Transition，我们需要使用 await rAF() 来等待 transition 事件执行完毕
export const rAF = async () => {
  return new Promise((res) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(async () => {
        res(null)
        await nextTick()
      })
    })
  })
}

function getTopValue(element: Element) {
  const styles = window.getComputedStyle(element)
  const topValue = styles.getPropertyValue('top') // 返回的是字符串（19px）
  return Number.parseFloat(topValue)
}

describe('createMessage', () => {
  test('调用方法应该创建对应的 Message 组件', async () => {
    const instance = createMessage({ message: 'hello Message', duration: 0 })
    // 测试 createMessage 创建的节点已经被插入 DOM 节点上了
    await rAF()     // 等到动画执行完毕，并且 DOM 更新以后
    console.log('HMTL', document.body.innerHTML)
    expect(document.querySelector('.hj-message')).toBeTruthy()
    // 测试销毁
    instance.destroy()
    await rAF()
    console.log('HMTL2', document.body.innerHTML)
    expect(document.querySelector('.hj-message')).toBeFalsy()
  })
  test('多次调用方法应该创建多个实例', async () => {
    createMessage({ message: 'hello Message1', duration: 0 })
    createMessage({ message: 'hello Message2', duration: 0 })
    await rAF()
    const elements = document.querySelectorAll('.hj-message')
    expect(elements.length).toBe(2)
    // 提出改进：这里没有用变量去接收 createMessage 的返回，那能不能在 method 中提供一个函数，让用户更方便地可以一次性销毁所有 Message 实例呢？
    closeAll()
    await rAF()
    expect(document.querySelector('.hj-message')).toBeFalsy()
  })
  test('创建多个实例应该设置正确的 offset', async () => {
    createMessage({ message: 'hello Message1', duration: 0, offset: 100 })
    createMessage({ message: 'hello Message2', duration: 0, offset: 50 })
    await rAF()
    const elements = document.querySelectorAll('.hj-message')
    expect(elements.length).toBe(2)
    
    const firstElementTop = getTopValue(elements[0])
    const secondElementTop = getTopValue(elements[1])
    // https://github.com/jsdom/jsdom/issues/1590
    // 在 JS-dom 中，对应的 height 返回为 0
    expect(firstElementTop).toBe(100)
    expect(secondElementTop).toBe(150)
  })
})