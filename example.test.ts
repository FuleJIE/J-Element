import { expect, test, describe, vi, Mocked } from 'vitest'
import { testFn, testRequest } from './utils'
import axios from 'axios'

const mockedAxios = axios as Mocked<typeof axios> // 使用类型断言 + Mocked，获得第三方库的类型，以便获取 mockedAxios 上的模拟方法

// 1. 断言
// test('test common matcher', () => {
//   const name = 'hujie'
//   expect(name).toBe('hujie')
//   expect(2 + 2).toBe(4)
//   expect(2 + 2).not.toBe(5)
// })

// test('test to be true or false', () => {
//   expect(1).toBeTruthy()
//   expect(0).toBeFalsy()
// })

// test('test number', () => {
//   expect(4).toBeGreaterThan(3)
//   expect(2).toBeLessThan(3)
// })

// test('test object', () => {
//   // toBe 是严格相等（===）包括引用
//   // expect({ name: 'hujie' }).toBe({ name: 'hujie' })
//   // toEqual 只判断值相等（toStrictEqual 也可以）
//   expect({ name: 'hujie' }).toEqual({ name: 'hujie' })
// })

// 2. callback test & mock
// describe - 把测试用例分组
describe('functions', () => {
  test('create a mock function', () => {
    const callback = vi.fn() // vitest 函数模块，vi.fn() 创建一个函数的模拟
    testFn(12, callback)
    expect(callback).toHaveBeenCalled() // 期待 callback 被调用了
    expect(callback).toHaveBeenCalledWith(12) // 期待被12调用了
  })
  test('spy on method', () => {
    // 监控对象身上的方法是否被调用
    const obj = {
      getName: () => 1
    }
    const spy = vi.spyOn(obj, 'getName') // vi.spyOn() 在对象的方法或 getter/setter 上创建一个模拟
    obj.getName()
    expect(spy).toHaveBeenCalled()
    obj.getName()
    expect(spy).toHaveBeenCalledTimes(2) // 期待 spy 被调用 2 次
  })
  test('mock third party module', async () => {
    // 模拟 axios get 请求的返回，然后期待返回的数据能够正常的出现
    vi.mock('axios') // 模拟 axios，vi.mock() 用另一个模块替换提供的 path 中的所有导入模块（vi.mock() 会被提升，可以在任何地方调用）
    // mockedAxios.get.mockImplementation(() => Promise.resolve({ data: 123 })) // 可以手动写 get 的实现
    mockedAxios.get.mockResolvedValue({ data: 123 }) // 简写，与上一行相等
    const result = await testRequest()
    expect(result).toBe(123)
  })
})
