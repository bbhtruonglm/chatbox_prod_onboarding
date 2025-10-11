<template>
  <div class="bg-white rounded-lg h-full flex flex-col">
    <!-- Header -->
    <div>
      <div
        class="py-2 px-3 border-b flex-shrink-0 text-sm font-semibold flex items-center justify-between"
      >
        <div class="flex items-center gap-1">
          <SparklesIcon class="size-5" />
          {{ $t('Huấn luyện AI') }}
        </div>
      </div>
    </div>

    <!-- Nội dung -->
    <div class="p-3 flex flex-col w-full gap-1">
      <!-- Input / Textarea -->
      <div>
        <textarea
          v-if="is_expanded"
          ref="textareaRef"
          v-model="description"
          rows="6"
          class="w-full border rounded-md px-3 py-2 text-sm resize-none focus:outline-none"
          placeholder="Nhập nội dung để huấn luyện AI tư vấn khách hàng"
        ></textarea>

        <input
          v-else
          type="text"
          v-model="description"
          @focus="expandAndFocus"
          class="w-full border rounded-md px-3 py-2 text-sm focus:outline-none"
          placeholder="Nhập nội dung để huấn luyện AI tư vấn khách hàng"
        />
      </div>

      <div>
        <!-- Nút Lưu -->
        <div
          v-if="is_expanded"
          class="mt-2 flex justify-end gap-2"
        >
          <button
            class="px-3 py-1.5 text-sm bg-gray-200 rounded-lg hover:bg-gray-300"
            @click="cancel"
          >
            {{ $t('Hủy') }}
          </button>
          <button
            class="flex gap-1 items-center px-3 py-2 text-sm bg-slate-800 text-yellow-200 rounded-lg hover:bg-slate-700"
            @click="save"
          >
            {{ $t('Lưu lại') }}
            <img
              class="mx-auto"
              src="@/assets/icons/save.svg"
              width="16"
              height="16"
            />
          </button>
        </div>

        <div
          v-else
          class="text-xs text-slate-700"
        >
          {{
            $t(
              'Khi khách hàng tương tác vào bài viết này, AI sẽ dựa theo nội dung của bạn huấn luyện để AI tư vấn khách hàng hiệu quả.'
            )
          }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SparklesIcon } from '@heroicons/vue/24/solid'
import { ref, nextTick } from 'vue'

/** Trạng thái mở rộng */
const is_expanded = ref(false)
/** Mô tả */
const description = ref('')
/** ref tới textarea */
const textareaRef = ref<HTMLTextAreaElement>()

/** Khi input được focus */
const expandAndFocus = async () => {
  is_expanded.value = true
  await nextTick()
  textareaRef.value?.focus()
}

/** Hủy bỏ chỉnh sửa */
const cancel = () => {
  is_expanded.value = false
}

/** Gọi API lưu dữ liệu */
const save = async () => {
  try {
    await fakeApiSave(description.value)
    is_expanded.value = false
    console.log('Đã lưu:', description.value)
  } catch (err) {
    console.error('Lỗi khi lưu:', err)
  }
}

/** Hàm giả lập API */
const fakeApiSave = (data: string) => {
  return new Promise(resolve => setTimeout(() => resolve(data), 500))
}
</script>
