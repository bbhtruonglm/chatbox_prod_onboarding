<template>
  <Modal
    ref="modal_change_quick_answer_ref"
    class_modal="w-[450px] h-fit max-h-[70dvh]"
    class_body="!overflow-hidden bg-white p-3 flex flex-col rounded-md gap-2"
  >
    <template #header>
      {{ $t('Chọn trang lấy album') }}
    </template>
    <template #body>
      <input
        v-model="search"
        type="text"
        :placeholder="$t('Tìm kiếm')"
        class="w-full outline-none border py-2 px-3 rounded-md h-full"
      />
      <ul class="flex flex-col h-full gap-2 overflow-auto">
        <li
          v-for="item in orgStore.list_os"
          class="py-2 px-2 rounded-md hover:bg-slate-100 cursor-pointer flex gap-2 items-center"
          v-show="showPage(item?.page_info)"
          @click="selectPage(item?.page_id || '')"
        >
          <PageAvatar
            :page_info="item?.page_info"
            class="w-8 h-8 flex-shrink-0"
          />
          <div class="w-full">
            <p class="flex justify-between items-center w-full">
              {{ item?.page_info?.name }}
              <CheckCircleIcon
                v-if="page_id === item?.page_id"
                class="size-5 text-blue-500"
              />
            </p>
            <p class="text-slate-400 text-xs">
              {{ item?.page_id }}
            </p>
          </div>
        </li>
      </ul>
      <button
        v-if="page_id !== conversationStore.select_conversation?.fb_page_id"
        class="py-2 px-3 rounded-md bg-blue-100 text-blue-700 font-medium w-full border border-blue-700"
        @click="selectDefaultPage()"
      >
        {{ $t('Khôi phục trang mặc định') }}
      </button>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { nonAccentVn } from '@/service/helper/format'
import { useConversationStore, useOrgStore } from '@/stores'
import { isEmpty } from 'lodash'
import { computed, ref } from 'vue'

import PageAvatar from '@/components/Avatar/PageAvatar.vue'
import Modal from '@/components/Modal.vue'

import { CheckCircleIcon } from '@heroicons/vue/24/solid'

import type { IPage } from '@/service/interface/app/page'

/** store */
const orgStore = useOrgStore()
const conversationStore = useConversationStore()

/** id trang */
const page_id = defineModel('page_id', {
  type: String,
  default: '',
})
/** modal thay đổi danh sách các câu trả lời nhanh */
const modal_change_quick_answer_ref = ref<InstanceType<typeof Modal> | null>(
  null
)
/** từ khóa tìm kiếm trang */
const search = ref('')

/** có hiển thị trang không */
function showPage(page_info: IPage = {}) {
  /** nếu không có dữ liệu thì không hiển thị */
  if (isEmpty(page_info)) return false

  /** tên trang không đấu và không có khoảng trắng */
  const PAGE_NAME = nonAccentVn(page_info?.name || '')?.replace(/ /g, '')
  /** từ khóa tìm kiếm không đấu và khoảng trắng */
  const KEY_WORD = nonAccentVn(search.value)?.replace(/ /g, '')
  /** id page */
  const PAGE_ID = nonAccentVn(page_info?.fb_page_id || '')?.replace(/ /g, '')
  /** trả về page chứ keyword */
  return PAGE_NAME.includes(KEY_WORD) || PAGE_ID.includes(KEY_WORD)
}

/** Chọn page để lấy các câu trả lời nhanh */
function selectPage(id: string) {
  /** lưu id page */
  page_id.value = id
  /** Bật tắt modal */
  modal_change_quick_answer_ref.value?.toggleModal()
}

/** Chọn trang mặc định */
function selectDefaultPage() {
  /** Lưu id page */
  page_id.value = conversationStore.select_conversation?.fb_page_id || ''
  /** Bật tắt modal */
  modal_change_quick_answer_ref.value?.toggleModal()
}

defineExpose({
  toggleModal() {
    modal_change_quick_answer_ref.value?.toggleModal()
  },
})
</script>
