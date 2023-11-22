// 被测试的对象
import axios from "axios"

export function testFn(number: number, callback: Function) {
  if(number > 10) {
    callback(number)
  }
}

export async function testRequest() {
  const { data } = await axios.get('fake.url')
  return data
}