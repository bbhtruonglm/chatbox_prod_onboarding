<template>
  <div class="flex md:hidden p-1 rounded-md border w-fit bg-gray-200 h-9">
    <div
      v-for="tab in tabs"
      :key="tab.path"
      class="text-center font-medium w-fit px-3 py-1 text-sm rounded cursor-pointer transition-colors duration-150 select-none"
      :class="[
        currentTab === tab.path
          ? 'bg-white shadow-sm text-color-text'
          : 'text-color-text-placeholder hover:bg-gray-100',
      ]"
      @click="handleClick(tab.path)"
    >
      {{ tab.title }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
/** Khai báo tabs item */
interface TabItem {
  /** Tiêu đề tab */
  title: string
  /** path của tab */
  path: string
}
/** Khai báo props */
const props = defineProps<{
  /** List các tab */
  tabs: TabItem[]
  /** Tab hiện tại */
  currentTab: string
}>()
/** Hàm emit update tab, reset skip, page (chưa dùng) */
const emit = defineEmits<{
  (e: 'update:tab', value: string): void
  (e: 'resetSkip'): void
  (e: 'resetPage', page: number): void
}>()

/** Khi click tab
 * @param path
 */
const handleClick = (path: string) => {
  /** Nếu click tab khác tab hiện tại */
  if (props.currentTab !== path) {
    emit('update:tab', path)
    emit('resetSkip')
    emit('resetPage', 0)
  }
}
</script>

<style scoped></style>
