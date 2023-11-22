<script setup lang="ts">
import { ref, onMounted, h } from 'vue';
import Button from './components/Button/Button.vue';
import Collapse from './components/Collapse/Collapse.vue';
import CollapseItem from './components/Collapse/CollapseItem.vue';
import Icon from './components/Icon/Icon.vue'
import type { ButtonInstance } from './components/Button/types';
import Tooltip from './components/Tooltip/Tooltip.vue'
import type { TooltipInstance } from './components/Tooltip/types';
import type { Options } from '@popperjs/core'
// import Dropdown from './components/Dropdown/Dropdown.vue'
import Dropdown from './components/Dropdown/Dropdown' // .tsx
import type { MenuOption } from './components/Dropdown/types'
import type { DropdownInstance } from './components/Dropdown/types'
import Message from './components/Message/Message.vue'
import { createMessage } from './components/Message/method'

const buttonRef = ref<ButtonInstance | null>(null)
// 3.3 测试 v-model
const openedValue = ref(['a'])
const size = ref<any>('3x')
onMounted(() => {
  // console.log('buttonRef', buttonRef.value) // 3.1 当我们要获取buttonRef.value身上的属性ref时，我们需要给ref()传入一个泛型类型，描述一下这个 实例 到底是怎么样的
  if(buttonRef.value) {
    console.log('buttonRef', buttonRef.value.ref)
  }

  // 3.4（Collapse）一个小问题：当我们动态的修改 modelValue 这个 props 值时，本地的值没有得到更新
  setTimeout(() => {
    openedValue.value = ['a', 'b']
    // 3.1（Icon）同样一个小问题，当我们动态修改 props 时，本地的值没有得到更新
    size.value = '2x'

    // trigger.value = 'click'
    // instance.destroy()
  }, 2000)

  // （Message）
  const instance = createMessage({ message: 'hello Message', duration: 0, showClose: true, type: 'info' })
  createMessage({ message: 'hello Message2', duration: 0, showClose: true, type: 'success' }) 
  createMessage({ message: 'hello Message3', duration: 0, showClose: true, type: 'error' })
  createMessage({ message: 'hello Message3', duration: 0, showClose: true, type: 'warning' })
})

const buttonMethod = () => {
  alert('组件同时支持原生button事件（Vue 支持 Attributes 透传）')
}

// （Tooltip）
const trigger = ref<any>('hover')
// // 暴露实例
// const tooltipRef = ref<TooltipInstance | null>(null) // 两者是等价的
const tooltipRef = ref<DropdownInstance | null>(null)   // 两者是等价的
const open = () => {
  tooltipRef.value?.show()
}
const close = () => {
  tooltipRef.value?.hide()
}
// // 5. 支持 Popper 参数
// const options: Partial<Options> = { placement: 'right-end', strategy: 'fixed' }

// （Dropdown）
const options: MenuOption[] = [
  { key: 1, label: h('b', 'this is bold') },
  { key: 2, label: 'item2', disabled: true },
  { key: 3, label: 'item3', divided: true },
  { key: 4, label: 'item4' },
]
const createM = (e: any) => {
  console.log('select', e)
  if (e.key === 1) {
    createMessage({ message: 'hello Message2', duration: 0, showClose: true, type: 'success' }) 
  }
}
</script>

<template>
  <!-- <Message message="hello message" :duration="0" show-close></Message> -->

  <header>
    <!-- <Tooltip placement="right" :trigger="trigger" manual ref="tooltipRef" :popper-options="options"> -->
    <!-- <Tooltip placement="right" :trigger="trigger" manual ref="tooltipRef" :open-delay="100" :close-delay="300">
      <img alt="Vue logo" src="./assets/logo.svg" width="125" height="125" />
      <template #content>
          hello tooltip
      </template>
    </Tooltip> -->
    <Dropdown
      placement="bottom" trigger="click" :menu-options="options"
      @visible-change="e => console.log('visible change', e)"
      @select="createM"
      manual
      ref="tooltipRef"
    >
      <img alt="Vue logo" src="./assets/logo.svg" width="125" height="125" />
    </Dropdown>

  </header>

  <!-- <font-awesome-icon icon="fa-solid fa-user-secret" /> -->
  <!-- 进行二次封装后，我们的 Icon 组件应该是与原 FontAwesome 提供的组件是一样的了 -->
  <Icon icon="fa-solid fa-user-secret" />
  <Icon icon="arrow-up" size="2x" spin />
  <Icon icon="arrow-up" size="2x" spin type="primary"/>
  <Icon icon="arrow-up" :size="size" spin type="primary" color="#0e7a0d"/>

  <main>
    <Button ref="buttonRef" @click="buttonMethod">Test Button</Button>
    <Button plain @click="close">Plain Button</Button>
    <Button round @click="open">Round Button</Button>
    <Button circle>Circle Button </Button>
    <Button disabled>Disabled Button</Button>
    <br><br>
    <Button type="primary">primary</Button>
    <Button type="success">success</Button>
    <Button type="info">info</Button>
    <Button type="warning">warning</Button>
    <Button type="danger">danger</Button>
    <br><br>
    <Button type="primary" plain>primary</Button>
    <Button type="success" plain>success</Button>
    <Button type="info" plain>info</Button>
    <Button type="warning" plain>warning</Button>
    <Button type="danger" plain>danger</Button>
    <br><br>
    <Button size="large">large</Button>
    <Button size="small">small</Button>
    <br><br>
    <Button type="primary" disabled>primary</Button>
    <Button type="success" disabled>success</Button>
    <Button type="info" disabled>info</Button>
    <Button type="warning" disabled>warning</Button>
    <Button type="danger" disabled>danger</Button>
    <br><br>
    <Button type="primary" plain disabled>primary</Button>
    <Button type="success" plain disabled>success</Button>
    <Button type="info" plain disabled>info</Button>
    <Button type="warning" plain disabled>warning</Button>
    <Button type="danger" plain disabled>danger</Button>
    <br><br>
    <Button loading>loading</Button>
    <Button icon="arrow-up">Icon</Button>
    <br><br>

    <Collapse v-model="openedValue" accordion>
      <CollapseItem name="a">
        <template #title>
          <!-- <h1>Title A</h1> -->
          Title A
        </template>
        <h1>headline title</h1>
        <div>this is content aaa</div>
      </CollapseItem>
      <CollapseItem name="b" title="Title B">
        <div>this is content bbb</div>
      </CollapseItem>
      <CollapseItem name="c" title="Title C" disabled>
        <div>this is content ccc</div>
      </CollapseItem>
    </Collapse>
    {{ openedValue }}
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
  img {
    border: 1px solid #64b687;
  }
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
