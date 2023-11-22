<template>
  <div
    class="hj-dropdown"
  >
  <Tooltip
    :trigger="trigger"
    :placement="placement"
    :popper-options="popperOptions"
    :open-delay="openDelay"
    :close-delay="closeDelay"
    @visible-change="visibleChange"
    ref="tooltipRef"
  >
    <slot />
    <template #content>
      <ul class="hj-dropdown__menu">
        <template v-for="item in menuOptions" :key="item.key">
          <li
            v-if="item.divided"
            role="separator"
            class="divided-placeholder"
          />
          <li
            class="hj-dropdown__item" 
            :class="{'is-disabled': item.disabled, 'is-divided': item.divided }"
            :id="`dropdown-item-${item.key}`"
            @click="itemClick(item)"
          >
            <!-- {{ item.label }} -->
            <RenderVnode :vNode="item.label"/>
          </li>
        </template>
      </ul>
    </template>
  </Tooltip>
  </div>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import type { DropdownProps, DropdownEmits, DropdownInstance, MenuOption } from './types';
import Tooltip from '../Tooltip/Tooltip.vue'
import type { TooltipInstance } from '../Tooltip/types';
import RenderVnode from '../../Common/RenderVnode'
defineOptions({
  name: 'HjDropdown'
})

const props = withDefaults(defineProps<DropdownProps>(), { hideAfterClick: true })
const emits = defineEmits<DropdownEmits>()
const visibleChange = (e: boolean) => {
  emits('visible-change', e) 
}
const itemClick = (e: MenuOption) => {
  if (e.disabled) {
    return
  }
  emits('select', e)
  // 点击选项后关闭菜单（点击 disabled 的不会被关闭）
  if(props.hideAfterClick) {
    tooltipRef.value?.hide()
  }
}
const tooltipRef = ref<TooltipInstance | null>(null)
defineExpose<DropdownInstance>({
  show: () => tooltipRef.value?.show(),
  hide: () => tooltipRef.value?.hide()
})
</script>