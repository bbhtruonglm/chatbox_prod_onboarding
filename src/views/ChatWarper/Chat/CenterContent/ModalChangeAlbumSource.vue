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
      <!-- Ô tìm kiếm -->
      <input
        v-model="search"
        type="text"
        :placeholder="$t('Tìm kiếm')"
        class="w-full outline-none border py-2 px-3 rounded-md h-full"
      />

      <!-- 🔹 Nút chọn tất cả -->
      <button
        class="py-2 px-3 rounded-md bg-green-100 text-green-700 font-medium w-full border border-green-700"
        @click="selectAllPages"
      >
        {{ $t('Chọn tất cả các trang') }}
      </button>

      <!-- Danh sách các trang -->
      <ul class="flex flex-col h-full gap-2 overflow-auto">
        <li
          v-for="item in orgStore.list_os"
          :key="item?.page_id"
          class="py-2 px-2 rounded-md hover:bg-slate-100 cursor-pointer flex gap-2 items-center"
          v-show="showPage(item?.page_info)"
          @click="togglePage(item?.page_id || '')"
        >
          <PageAvatar
            :page_info="item?.page_info"
            class="w-8 h-8 flex-shrink-0"
          />
          <div class="w-full flex justify-between items-center">
            <div>
              <p class="font-medium">
                {{ item?.page_info?.name }}
              </p>
              <p class="text-slate-400 text-xs">
                {{ item?.page_id }}
              </p>
            </div>

            <!-- ✅ Hiển thị icon nếu đã chọn -->
            <CheckCircleIcon
              v-if="page_ids.includes(item?.page_id)"
              class="size-5 text-blue-500"
            />
          </div>
        </li>
      </ul>

      <!-- Nút khôi phục trang mặc định -->
      <button
        v-if="!is_default_selection"
        class="py-2 px-3 rounded-md bg-blue-100 text-blue-700 font-medium w-full border border-blue-700"
        @click="selectDefaultPage"
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
import { computed, ref, type PropType } from 'vue'

import PageAvatar from '@/components/Avatar/PageAvatar.vue'
import Modal from '@/components/Modal.vue'
import { CheckCircleIcon } from '@heroicons/vue/24/solid'
import type { IPage } from '@/service/interface/app/page'

/** store */
const orgStore = useOrgStore()
const conversationStore = useConversationStore()

/** Mảng id các trang */
const page_ids = defineModel('page_ids', {
  type: Array as PropType<string[]>,
  default: () => [],
})

/** modal */
const modal_change_quick_answer_ref = ref<InstanceType<typeof Modal> | null>(
  null
)

/** từ khóa tìm kiếm */
const search = ref('')

/** kiểm tra khôi phục mặc định chưa */
const is_default_selection = computed(() => {
  /** Id mặc định */
  const DEFAULT_ID = conversationStore.select_conversation?.fb_page_id || ''
  /** Tiem kiếm page id  */
  return page_ids.value.length === 1 && page_ids.value.includes(DEFAULT_ID)
})

/** hiển thị page nếu khớp từ khóa */
function showPage(page_info: IPage = {}) {
  /** kiếm tra page info có dữ liệu không */
  if (isEmpty(page_info)) return false
  /** Tên page */
  const PAGE_NAME = nonAccentVn(page_info?.name || '').replace(/ /g, '')
  /** keyword */
  const KEY_WORD = nonAccentVn(search.value).replace(/ /g, '')
  /** Lấy thông tin page ID */
  const PAGE_ID = nonAccentVn(page_info?.fb_page_id || '').replace(/ /g, '')
  /** Tìm kiếm page ID trong list */
  return PAGE_NAME.includes(KEY_WORD) || PAGE_ID.includes(KEY_WORD)
}

/** Chọn / bỏ chọn 1 page
 * @param id đã chọn
 */
function togglePage(id: string) {
  /** Nếu k có id thì return */
  if (!id) return
  /** TÌm id trong page */
  const IDX = page_ids.value.indexOf(id)
  /** Nếu k tồn taịi index thì xóa khỏi list */
  if (IDX !== -1) {
    /** xóa khoi list */
    page_ids.value.splice(IDX, 1)
  } else {
    /** Push vào list */
    page_ids.value.push(id)
  }
}

/** Chọn tất cả page */
function selectAllPages() {
  /** lấy list os trong store */
  if (orgStore.list_os) {
    /** Gán danh sách page id = list trong org store */
    page_ids.value = orgStore.list_os.map(item => item.page_id) || undefined
    /** ref bật tắt modal */
    modal_change_quick_answer_ref.value?.toggleModal()
  }
}

/** Khôi phục trang mặc định */
function selectDefaultPage() {
  /** ID mặc định */
  const DEFAULT_ID = conversationStore.select_conversation?.fb_page_id || ''
  /** Gán  */
  page_ids.value = [DEFAULT_ID]
  /** ref bật tắt modal */
  modal_change_quick_answer_ref.value?.toggleModal()
}

/** Expose toggle modal */
defineExpose({
  toggleModal() {
    modal_change_quick_answer_ref.value?.toggleModal()
  },
})
</script>
