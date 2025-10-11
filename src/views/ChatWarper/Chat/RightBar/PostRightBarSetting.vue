<template>
  <div class="bg-white rounded-lg h-full flex flex-col">
    <div
      class="py-2 px-3 border-b flex-shrink-0 text-sm font-semibold flex items-center justify-between"
    >
      <div class="flex items-center gap-1">
        <CogIcon class="size-5" />
        {{ $t('Thiết lập') }}
      </div>
    </div>
    <div class="p-3 gap-2 flex flex-col">
      <div class="flex gap-2 items-center">
        <Toggle
          :modelValue="is_auto_hide_comment"
          @click="toggleHideComment()"
          :disabled="true"
          :class_toggle="'peer-checked:bg-black'"
        />
        {{ $t('Tự động ẩn toàn bộ Bình luận.') }}
      </div>
      <div class="flex gap-2">
        <Toggle
          :modelValue="is_auto_comment"
          @click="toggleAutoComment()"
          :disabled="true"
          :class_toggle="'peer-checked:bg-black'"
        />
        {{ $t('Tự động Bình luận, Nhắn tin ngẫu nhiên hoặc theo cú pháp.') }}
      </div>
      <div class="w-full flex justify-between text-xs pl-12">
        <div class="w-full text-sm font-medium text-blue-700 pl-1">
          3
          {{ $t('câu trả lời tự động') }}
        </div>
        <div class="w-fit flex-shrink-0 p-0.5 px-2 rounded-lg bg-slate-200">
          {{ $t('Cài đặt') }}
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import Toggle from '@/components/Toggle.vue'
import { CogIcon } from '@heroicons/vue/24/solid'
import { usePageStore } from '@/stores'
import { ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'

const $route = useRoute()

/** Tự động ẩn bình luận */
const is_auto_hide_comment = ref(false)
/** Tự động bình luận */
const is_auto_comment = ref(false)

/** Lấy thông tin page từ store */
const pageStore = usePageStore()
const page_id = ref($route.query.page_id as string)

/** Thông tin trang (object phức tạp, reactive trong store) */
const page_info = pageStore.active_page_list?.[page_id.value]?.page

console.log(page_info, 'page info')

/**
 * Theo dõi page_info để đồng bộ giá trị
 * watchEffect sẽ tự chạy mỗi khi page_info hoặc thuộc tính bên trong thay đổi
 */
watchEffect(() => {
  if (page_info) {
    is_auto_hide_comment.value = !!page_info.is_auto_hide_comment
    // is_auto_comment.value = !!page_info.is_auto_comment
  }
})

/** Chuyển đổi trạng thái ẩn bình luận */
const toggleHideComment = () => {
  is_auto_hide_comment.value = !is_auto_hide_comment.value
}

/** Bật tắt trạng thái tự động bình luận */
const toggleAutoComment = () => {
  is_auto_comment.value = !is_auto_comment.value
}
</script>
