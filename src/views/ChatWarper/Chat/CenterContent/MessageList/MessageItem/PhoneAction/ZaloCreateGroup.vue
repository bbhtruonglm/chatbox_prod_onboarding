<template>
  <Modal
    ref="modal_widget__group_ref"
    class_modal="w-[432px]"
    :class_body="`flex gap-2 ${
      view === 'SEARCH' || !view ? 'h-96' : 'h-[80dvh]'
    }`"
  >
    <template #header>
      {{ $t('v1.common.create_zalo_group') }}
    </template>
    <template #body>
      <div class="bg-white h-full w-full rounded-md p-2 flex flex-col gap-4">
        <label>{{ $t('v1.common.create_new_group') }}</label>
        <div class="flex gap-2 items-center w-full">
          <input
            class="border h-8 w-full rounded px-2 py-0.5 text-sm"
            :placeholder="$t('v1.common.your_group_name')"
          />
          <button
            class="flex-shrink-0 bg-blue-700 text-white px-2 py-1 rounded-md text-sm"
          >
            {{ $t('v1.common.create_group') }}
          </button>
        </div>
        <div class="relative">
          <MagnifyingGlassIcon
            class="absolute top-1/2 left-3 -translate-y-1/2 w-4 h-4 text-slate-500"
          />
          <input
            v-model="search_conversation"
            ref="ref_search_conversation"
            class="w-full bg-slate-100 placeholder-slate-500 py-1.5 pl-9 pr-8 text-sm rounded-md"
            type="text"
            :placeholder="$t('v1.common.search_member')"
          />
          <XMarkIcon
            @click="search_conversation = undefined"
            v-if="search_conversation"
            class="absolute top-1/2 right-2 -translate-y-1/2 size-5 text-red-500 cursor-pointer"
          />
        </div>
        <div class="">
          <div class="flex w-full gap-2 items-center justify-between text-xs">
            <span
              class="p-0.5 px-2 bg-blue-50 text-blue-700 font-semibold rounded-md"
              >{{ $t('v1.common.member_selected') }}</span
            >
            <span
              class="p-0.5 px-2 bg-blue-50 text-blue-700 font-semibold rounded-md"
              >{{ member.length }}</span
            >
          </div>
        </div>
      </div>
    </template>
  </Modal>
</template>
<script setup lang="ts">
import { useOrgStore } from '@/stores'
import { N4SerivceAppZaloPersonal } from '@/utils/api/N4Service/ZaloPersonal'
import { container } from 'tsyringe'
import { onMounted, onUnmounted, ref } from 'vue'

import Modal from '@/components/Modal.vue'

import type { MessageInfo } from '@/service/interface/app/message'
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import { N4SerivceAppConversation } from '@/utils/api/N4Service/Conversation'
import { keys } from 'lodash'

/** link gốc của chatbot */
const DOMAIN_CHATBOT = getDomain()

const $props = withDefaults(
  defineProps<{
    /**dữ liệu tin nhắn */
    message?: MessageInfo
  }>(),
  {}
)

const orgStore = useOrgStore()

/**giá trị của ô tìm kiếm hội thoại */
const search_conversation = ref<string>()

/**ref của modal kết nối nền tảng */
const modal_widget__group_ref = ref<InstanceType<typeof Modal>>()

const member = ref<any>([])

/** màn hiển thị */
const view = ref<'SEARCH' | 'CHAT' | 'FRIEND_REQUEST' | ''>('')

/** ref tới iframe */
const iframe_ref = ref<HTMLIFrameElement>()

class Main {
  constructor(
    private readonly API = container.resolve(N4SerivceAppConversation)
  ) {}

  /** lấy id của khách */
  // async getClientId(page_id?: string) {
  //   // nếu không có trang nào thì thôi
  //   if (!page_id || !$props.message) return

  //   // lấy id của khách với có số điện thoại trong tin nhắn và đã nhắn cho page
  //   const RES = await this.API.getClientId(page_id, $props.message?._id)

  //   return RES
  // }

  /**ẩn hiện modal của component */
  toggleModal() {
    modal_widget__group_ref.value?.toggleModal()
    console.log('hehehhehhe')
  }

  /** Lấy danh sách hội thoại */
  async getConversation(page_id: string) {
    if (!page_id) return

    /**danh sách id page */
    const PAGE_IDS = keys(pageStore.selected_page_id_list)

    try {
      const RES = await this.API.readConversations(
        PAGE_IDS,
        orgStore.selected_org_id,
        {
          ...conversationStore.option_filter_page_data,
          ...OVERWRITE_FILTER,
        },
        40,
        SORT
      )

      console.log('Danh sách hội thoại:', RES)
      return RES
    } catch (error) {
      console.error('Lỗi getConversation:', error)
    }
  }

  /** Đếm tổng số cuộc hội thoại */
  async countConversation(page_id: string) {
    if (!page_id) return

    try {
      const RES = await this.API.countConversations(page_id)

      console.log('Số lượng hội thoại:', RES?.count)
      return RES
    } catch (error) {
      console.error('Lỗi countConversation:', error)
    }
  }

  /** hàm xử lý khi nhân được sự kiện từ iframe zalo personal core */
  // async handleEvent(event: MessageEvent) {
  //   // nếu không phải từ zalo personal core thi thôi
  //   if (event.data?.from !== 'ZALO_PERSONAL_CORE') return

  //   // nếu là lấy id client_id
  //   if (event.data?.type === 'get.client_id') {
  //     this.hanldeGetClientId(event.data.data.page_id)
  //   }

  //   // nếu là chuyển màn
  //   if (event.data?.type === 'view.change') {
  //     // lưu lại view
  //     view.value = event.data.data.view
  //   }
  // }

  /** Xử lý khi nhận được mesage với type get.client_id  */
  // async hanldeGetClientId(page_id: string) {
  //   // id của trang cần lấy id khách hàng
  //   const CLIENT_ID = await $main.getClientId(page_id)

  //   // gửi id khách hàng vào iframe zalo personal core
  //   iframe_ref.value?.contentWindow?.postMessage(
  //     {
  //       type: 'get.client_id',
  //       from: 'ZALO_PERSONAL_CONTAINER',
  //       data: {
  //         client_id: CLIENT_ID,
  //       },
  //     },
  //     '*'
  //   )
  // }
}

const $main = new Main()

/** hàm xử lý sự kiện khi nhân được từ iframe zalo personal core */
// const handleMessage = $main.handleEvent.bind($main)

/** link gốc của chatbot  */
function getDomain() {
  // nếu là prod thì link gốc là https://retion.ai/chat
  if (window.location.origin === 'https://retion.ai')
    return 'https://retion.ai/chat'
  return window.location.origin
}

// onMounted(() => {
//   window.addEventListener('message', handleMessage)
// })

// onUnmounted(() => {
//   window.removeEventListener('message', handleMessage)
// })

// cung cấp hàm toggle modal cho component cha
defineExpose({ toggleModal: $main.toggleModal.bind($main) })
</script>
