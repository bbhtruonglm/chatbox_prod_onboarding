<template>
  <Modal
    ref="album_ref"
    class_modal="h-[85dvh]"
    class_body="flex gap-2"
  >
    <template #header>
      {{ $t('v1.view.main.dashboard.chat.album.title') }}
    </template>
    <template #body>
      <div
        class="w-[65dvw] bg-white rounded-lg p-2 flex flex-col relative gap-2"
      >
        <div class="absolute top-8 left-[50%] translate-x-[-50%]">
          <Loading v-if="is_loading" />
        </div>
        <div class="flex justify-between">
          <div class="flex flex-shrink-0 p-1 rounded-md bg-gray-100 w-fit">
            <button
              @click="selectCategory('NEW')"
              :class="{ 'bg-white': selected_category === 'NEW' }"
              class="font-medium text-xs py-1 px-4 rounded"
            >
              {{ $t('v1.view.main.dashboard.chat.album.category.new') }}
            </button>
            <button
              @click="selectCategory('FOLDER')"
              :class="{ 'bg-white': selected_category === 'FOLDER' }"
              class="font-medium text-xs py-1 px-4 rounded"
            >
              {{ $t('v1.view.main.dashboard.chat.album.category.folder') }}
            </button>
          </div>
          <div class="flex gap-2 items-center text-sm">
            {{
              $t(
                'v1.view.main.dashboard.chat.album.select_album_from_other_page'
              )
            }}

            <button
              v-tooltip="$t('Lấy danh sách album từ trang khác')"
              @click="modal_change_album_ref?.toggleModal"
            >
              <ChangeIcon
                v-if="
                  page_id === conversationStore.select_conversation?.fb_page_id
                "
                class="size-4 text-black m-0.5"
              />
              <PageAvatar
                v-else
                :page_info="
                  orgStore.list_os?.find(item => item.page_id === page_id)
                    ?.page_info
                "
                class="size-5"
              />
            </button>
          </div>
        </div>
        <div class="flex flex-shrink-0">
          <div
            class="w-full flex justify-between"
            v-if="selected_category === 'NEW' || selected_folder_id"
          >
            <div class="flex items-center">
              <button
                v-if="selected_folder_id"
                class="flex gap-2 items-center text-sm font-medium"
                @click="selectCategory('FOLDER')"
              >
                <ArrowLeftIcon class="size-4" />
                {{ selected_folder?.title }}
              </button>
            </div>
            <div class="flex gap-2 items-center">
              <button
                class="bg-red-100 p-2 rounded-md"
                v-tooltip="$t('v1.common.delete')"
                @click="confirmDeleteFile()"
                :class="{
                  invisible: !countSelectFile(),
                }"
              >
                <TrashIcon class="w-5 h-5 text-red-500 cursor-pointer" />
              </button>

              <button
                @click="selectAllFile(false)"
                class="custom-btn bg-slate-300 !text-black font-medium"
                :class="{
                  invisible: !countSelectFile(),
                }"
              >
                {{ $t('v1.common.deselect') }}
              </button>

              <label
                v-if="file_list?.length"
                class="font-medium flex items-center cursor-pointer gap-1 bg-blue-100 py-1.5 px-3 rounded-md text-blue-700"
              >
                <Checkbox
                  v-model="is_select_all"
                  :checkbox_class="'checked:!bg-blue-700 !border-blue-700'"
                />
                <span>{{
                  $t('v1.view.main.dashboard.chat.album.select_all')
                }}</span>
              </label>
              <button
                @click="uploadFileFromDevice"
                class="custom-btn bg-blue-700"
              >
                <ArrowUpIcon class="w-4 h-4" />
                {{ $t('v1.common.upload') }}
              </button>
            </div>
          </div>
          <div
            class="w-full flex justify-end"
            v-else
          >
            <button
              @click="createFolder"
              class="custom-btn bg-blue-700"
            >
              <PlusCircleIcon class="w-4 h-4" />
              {{ $t('v1.view.main.dashboard.chat.album.create_folder') }}
            </button>
          </div>
        </div>
        <div
          @scroll="loadMore"
          class="flex-grow overflow-y-auto grid content-start gap-3"
          :class="{
            'grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7':
              selected_category === 'FOLDER',
            'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6':
              selected_category === 'NEW',
          }"
        >
          <div
            v-for="folder of folder_list"
            @click="selectFolder(folder)"
            :class="{ 'border-blue-700': folder._id === selected_folder?._id }"
            class="w-full overflow-hidden relative cursor-pointer border-[3px] rounded-xl flex flex-col group items-center"
          >
            <div
              @click.stop="$event => openFolderMenu($event, folder)"
              class="absolute top-1 right-1 px-0.5 bg-slate-200 border border-slate-500 rounded-md hidden group-hover:block"
            >
              <DotIcon class="w-4 h-4 text-slate-500" />
            </div>
            <FolderIcon class="w-12 h-12 text-slate-700" />
            <div
              class="truncate w-full text-center text-xs font-medium h-6 flex-shrink-0 px-2"
            >
              <input
                :id="`edit-folder-title-${folder._id}`"
                v-if="folder.is_edit"
                @click.stop
                @keyup.enter="updateFolderInfo(folder)"
                @blur="updateFolderInfo(folder)"
                v-model="folder.title"
                type="text"
                class="border w-full rounded text-center px-2 bg-slate-50 py-0.5"
              />
              <template v-else>
                {{ folder.title }}
              </template>
            </div>
          </div>
          <div
            v-for="file of file_list"
            @click="selectFile(file)"
            :class="{ 'border-blue-700': file.is_select }"
            class="relative h-44 cursor-pointer border-[3px] rounded-xl overflow-hidden flex flex-col group"
          >
            <div
              @click.stop="deleteFile(file)"
              class="absolute top-1 left-1 p-1 rounded bg-red-100 border border-red-500 hidden group-hover:block"
            >
              <BinIcon class="w-4 h-4 text-red-500" />
            </div>
            <div
              class="absolute top-1 right-1 p-1 rounded bg-blue-100 border border-blue-500 hidden group-hover:block"
              @click.stop="copyLink(file)"
            >
              <LinkIcon class="w-4 h-4 text-blue-700" />
            </div>
            <div
              v-if="file.is_select"
              class="absolute top-1 right-1 p-0.5 bg-blue-100 border border-blue-700 rounded-full"
            >
              <CheckCircleIcon class="w-6 h-6 text-blue-700" />
            </div>
            <div class="flex-grow min-h-0 flex justify-center items-center">
              <img
                v-if="file.mimetype?.includes('image')"
                :src="file.url"
                class="w-full h-full object-contain bg-slate-100"
              />
              <img
                v-else-if="file.mimetype?.includes('video')"
                src="@/assets/icons/play.svg"
                class="w-1/2 h-1/2"
              />
              <img
                v-else-if="file.mimetype?.includes('audio')"
                src="@/assets/icons/audio.svg"
                class="w-1/2 h-1/2"
              />
              <img
                v-else
                src="@/assets/icons/file.svg"
                class="w-1/2 h-1/2"
              />
            </div>
            <div
              :class="{ 'text-blue-700': file.is_select }"
              class="truncate text-center text-xs font-medium h-6 flex-shrink-0 p-1 border-t"
            >
              {{ file.original_name }}
            </div>
          </div>
        </div>
        <p
          v-if="countSelectFile()"
          class="m-auto text-sm text-blue-700 font-medium"
        >
          {{ $t('Đã chọn') }} {{ countSelectFile() }} / {{ size(file_list) }}
          {{ $t('v1.view.main.dashboard.chat.album.file') }}
        </p>
      </div>
    </template>
    <template v-slot:footer>
      <div class="flex justify-between">
        <button
          @click="album_ref?.toggleModal()"
          class="custom-btn bg-slate-700"
        >
          {{ $t('Đóng') }}
        </button>
        <button
          @click="pickFile"
          :class="countSelectFile() ? 'bg-blue-700' : 'bg-slate-500'"
          class="custom-btn"
        >
          {{ $t('v1.view.main.dashboard.chat.album.select') }}
          <span v-if="countSelectFile()"> ({{ countSelectFile() }}) </span>
        </button>
      </div>
    </template>
  </Modal>
  <Dropdown
    ref="folder_menu_ref"
    width="142px"
    height="auto"
    :is_fit="false"
    position="BOTTOM"
    class_content="flex flex-col gap-1 border rounded-md p-1 gap-1"
  >
    <button
      @click="editFolderName"
      class="py-1.5 px-2 flex items-center gap-3 rounded-md text-sm font-medium"
    >
      <div class="bg-slate-100 rounded-full p-2">
        <EditIcon class="w-5 h-5" />
      </div>
      {{ $t('v1.view.main.dashboard.chat.album.edit_name') }}
    </button>
    <button
      @click="deleteFolder"
      class="py-1.5 px-2 flex items-center gap-3 rounded-md text-sm font-medium"
    >
      <div class="bg-red-100 rounded-full p-2">
        <BinBoldIcon class="w-5 h-5 text-red-500" />
      </div>
      {{ $t('v1.common.delete') }}
    </button>
  </Dropdown>
  <ModalChangeAlbumSource
    ref="modal_change_album_ref"
    v-model:page_id="page_id"
    v-on:update:page_id="onChangePageId"
  />
</template>
<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import { eachOfLimit, waterfall } from 'async'
import {
  read_file_album,
  upload_file_album,
  delete_file_album,
  read_folder_album,
  update_folder_album,
  delete_folder_album,
  create_folder_album,
} from '@/service/api/chatbox/n6-static'
import { useConversationStore, useOrgStore } from '@/stores'
import { confirm, toast, toastError } from '@/service/helper/alert'
import { useI18n } from 'vue-i18n'
import { remove, size } from 'lodash'

import Modal from '@/components/Modal.vue'
import Loading from '@/components/Loading.vue'
import Checkbox from '@/components/Checkbox.vue'
import Dropdown from '@/components/Dropdown.vue'

import ArrowUpIcon from '@/components/Icons/ArrowUp.vue'
import PlusCircleIcon from '@/components/Icons/PlusCircle.vue'
import BinIcon from '@/components/Icons/Bin.vue'
import BinBoldIcon from '@/components/Icons/BinBold.vue'
import CheckCircleIcon from '@/components/Icons/CheckCircel.vue'
import FolderIcon from '@/components/Icons/Folder.vue'
import DotIcon from '@/components/Icons/Dot.vue'
import EditIcon from '@/components/Icons/Edit.vue'

import PageAvatar from '@/components/Avatar/PageAvatar.vue'
import ChangeIcon from '@/components/Icons/ChangeIcon.vue'

import type { ComponentRef } from '@/service/interface/vue'
import type { FileInfo, FolderInfo } from '@/service/interface/app/album'
import type { CbError } from '@/service/interface/function'
import { ArrowLeftIcon, LinkIcon, TrashIcon } from '@heroicons/vue/24/outline'

import { getItem, setItem } from '@/service/helper/localStorage'
import ModalChangeAlbumSource from './ModalChangeAlbumSource.vue'

/**các giá tị của danh mục */
type CategoryType = 'NEW' | 'FOLDER'

const $emit = defineEmits(['pick_file'])

const $t = useI18n().t
/** thoong tin conversation trong store */
const conversationStore = useConversationStore()
/** Thoong tin org trong store*/
const orgStore = useOrgStore()

/**cache câu trả lời, hạnc chế gọi API liên tục mỗi lần click */
const CACHE_LIST_ALBUM = new Map<string, any[]>()

/**số bản ghi một thời điểm */
const LIMIT = 40

/**ref của menu thiết lập folder */
const folder_menu_ref = ref<InstanceType<typeof Dropdown>>()
/**đánh dấu có kích hoạt loading hay không */
const is_loading = ref(false)
/**ref của quản lý album */
const album_ref = ref<ComponentRef>()
/**chọn danh mục nào */
const selected_category = ref<CategoryType>('NEW')
/**id của thư mục đang chọn nếu có */
const selected_folder_id = ref<string>()
/**danh sách tập tin */
const file_list = ref<FileInfo[]>([])
/**danh sách thư mục */
const folder_list = ref<FolderInfo[]>([])
/**đánh dấu đã đọc hết dữ liệu */
const is_done = ref(false)
/**số bản ghi bỏ qua */
const skip = ref(0)
/**thư mục được chọn để cài đặt */
const selected_folder = ref<FolderInfo>()

/**id trang đang được chọn */
const page_id = ref<string>('')

/** modal thay đổi danh sách câu trả lời nhanh */
const modal_change_album_ref = ref<InstanceType<
  typeof ModalChangeAlbumSource
> | null>(null)

/**đánh dấu có đang chọn tất cả file không */
const is_select_all = computed({
  get() {
    // kiểm tra xem có phải đang chọn toàn bộ file không
    return (
      !!size(file_list.value) && size(file_list.value) === countSelectFile()
    )
  },
  set(val) {
    // gắn cờ cho các file
    file_list.value?.forEach(file => (file.is_select = val))
  },
})

/** hàm xử lý thay đổi id page */
function onChangePageId(id: string) {
  /** Nếu k có id thì bỏ quá */
  if (!id || !conversationStore.select_conversation?.fb_page_id) return

  /** cập nhật id page */
  page_id.value = id
  /** Map data id từ local storage */
  const PAGE_ID_MAP = getItem('album_page_id') || {}
  /** Lưu vào local, */
  setItem('album_page_id', {
    ...PAGE_ID_MAP,
    [conversationStore.select_conversation.fb_page_id]: id,
  })
  /** set lại skip = 0 */
  skip.value = 0
  /** check tab hiện tại */
  if (selected_category.value === 'NEW') {
    /** lấy dữ liệu album */
    getFile(true)
  } else {
    getFolder(true)
  }
}

/**đổi chế độ sửa tên thư mục */
function editFolderName() {
  // nếu chưa chọn thư mục thì thôi
  if (!selected_folder.value) return

  // bật chế độ sửa
  selected_folder.value.is_edit = true

  // tắt menu
  folder_menu_ref.value?.toggleDropdown()

  // focus vào input
  nextTick(() =>
    document
      .getElementById(`edit-folder-title-${selected_folder.value?._id}`)
      ?.focus()
  )
}
/** Mở menu */
function openFolderMenu($event: MouseEvent, folder: FolderInfo) {
  // chọn thư mục
  selected_folder.value = folder

  // mở menu
  folder_menu_ref.value?.toggleDropdown($event)
}
/**đếm số file được chọn */
function countSelectFile() {
  return size(file_list.value?.filter(file => file.is_select))
}
/**click chọn file để gửi */
function selectFile(file: FileInfo) {
  file.is_select = !file.is_select
}
/**chọn thư mục */
function selectFolder(folder: FolderInfo) {
  selected_folder_id.value = folder._id

  selected_folder.value = folder

  resetFileData()

  getFile()
}
/**đọc danh sách thư mục */
function getFolder(is_change_page = false) {
  is_loading.value = true

  waterfall(
    [
      // * đọc thư mục từ server
      (cb: CbError) =>
        read_folder_album(
          {
            // page_id: conversationStore.select_conversation
            //   ?.fb_page_id as string,
            page_id: page_id.value,
            limit: LIMIT,
            skip: skip.value,
          },
          (e, r) => {
            if (e) return cb(e)
            if (!r?.length || r?.length < LIMIT) is_done.value = true

            if (r) {
              if (is_change_page) {
                folder_list.value = r
              } else {
                folder_list.value?.push(...r)
              }
            }
            cb()
          }
        ),
      // * next
      (cb: CbError) => {
        skip.value += LIMIT

        cb()
      },
    ],
    e => {
      is_loading.value = false

      if (e) return toastError(e)
    }
  )
}
/**chọn danh mục */
function selectCategory(type: CategoryType) {
  /** chọn danh mục */
  selected_category.value = type

  /** xoá thư mục đã chọn */
  selected_folder_id.value = undefined
  /** clar file dữ liệu */
  resetFileData()
  /** type File thì lấy file */
  if (type === 'NEW') getFile()
  /** Type folder thì lấy data folder */
  if (type === 'FOLDER') getFolder()
}
/**lấy thêm dữ liệu file khi scroll xuống */
function loadMore($event: Event) {
  /** nếu đang chạy hoặc đã hết dữ liệu thì thôi */
  if (is_loading.value || is_done.value) return
  /** Lấyd data div */
  const DIV = $event.target as HTMLElement
  /** Khai báo các event stroll của div */
  const SCROLL_TOP = DIV?.scrollTop
  const DIV_HEIGHT = DIV?.offsetHeight
  const SCROLL_HEIGHT = DIV?.scrollHeight

  /** kiểm tra xem đã scroll xuống cuối cùng chưa */
  if (SCROLL_TOP + DIV_HEIGHT < SCROLL_HEIGHT - 100) return

  /** nếu ở danh mục hiện toàn bộ file */
  if (selected_category.value === 'NEW') getFile()
  /** nếu ở danh sách thư mục */ else if (!selected_folder_id) getFolder()
  /** nếu là danh sách các file của một thư mục */ else getFile()
}
/**xoá tập tin */
function deleteFile(select_file: FileInfo) {
  /** nếu đang chạy thì thôi */
  if (is_loading.value) return

  /** gắn cờ đang chạy */
  is_loading.value = true

  /** xoá file */
  delete_file_album(
    {
      // page_id: conversationStore.select_conversation?.fb_page_id!,
      page_id: page_id.value,
      file_id: select_file._id,
    },
    (e, r) => {
      is_loading.value = false

      /** xoá khỏi danh sách tập tin */
      remove(file_list.value, file => file._id === select_file?._id)
    }
  )
}
/** xóa các tập tin đã chọn */
async function deleteSelectFile() {
  try {
    /** nếu đang chạy thì thôi */
    if (is_loading.value) return

    /** gắn cờ đang chạy */
    is_loading.value = true

    /** danh sách tập tin */
    const FILE_LIST = file_list.value

    /** lặp xóa từng tập tin đã chọn */
    for (let i = FILE_LIST?.length; i >= 0; i--) {
      /** dữ liệu của tập tin */
      const FILE = FILE_LIST[i]

      /** nếu đang được chọn thì xóa */
      if (FILE?.is_select) {
        await new Promise((resolve, reject) => {
          /** call api xóa tập tin */
          delete_file_album(
            {
              // page_id: conversationStore.select_conversation?.fb_page_id!,
              page_id: page_id.value,
              file_id: FILE._id,
            },
            (e, r) => {
              /** nếu thành công */
              if (r.code === 200) {
                resolve(r)
                /** xóa khoa khoi danh sach */
                file_list.value?.splice(i, 1)
              }
            }
          )
        })
      }
    }
  } catch (e) {
    console.log(e)
  } finally {
    /** tắt cờ đang chạy */
    is_loading.value = false
  }
}

/** xác nhận xóa các tập tin */
function confirmDeleteFile() {
  confirm(
    'question',
    $t('v1.view.main.dashboard.chat.album.confirm_delete_file'),
    '',
    is_cancel => {
      // nếu hủy thì thôi
      if (is_cancel) return
      // xóa các tập tin đã chọn
      deleteSelectFile()
    }
  )
}

/**tạo mới thư mục */
function createFolder() {
  /** bật cờ đang chạy */
  is_loading.value = true

  /** tạo thư mục */
  create_folder_album(
    {
      // page_id: conversationStore.select_conversation?.fb_page_id as string,
      page_id: page_id.value,
      title: $t('v1.view.main.dashboard.chat.album.folder_new_name'),
    },
    (e, r) => {
      /** tắt cờ đang chạy */
      is_loading.value = false

      /** reset dữ liệu */
      folder_list.value = []
      skip.value = 0
      is_done.value = false

      /** lấy lại danh sách thư mục */
      getFolder()
    }
  )
}
/**xoá thư mục */
function deleteFolder() {
  /** nếu chưa chọn thư mục thì thôi */
  if (!selected_folder.value) return

  /** gắn cờ đang chạy */
  is_loading.value = true

  /** xoá thư mục */
  delete_folder_album(
    {
      // page_id: conversationStore.select_conversation?.fb_page_id!,
      page_id: page_id.value,
      folder_id: selected_folder.value?._id,
    },
    (e, r) => {
      /** tắt gắn cờ */
      is_loading.value = false

      /** xoá thư mục khỏi danh sách */
      remove(
        folder_list.value,
        folder => folder._id === selected_folder.value?._id
      )

      /** tắt menu */
      folder_menu_ref.value?.toggleDropdown()
    }
  )
}
/**cập nhật thông tin folder */
function updateFolderInfo(folder: FolderInfo) {
  /** nếu chưa chọn thư mục thì thôi */
  if (!folder) return

  /** gắn cờ đang chạy */
  is_loading.value = true

  /** cập nhật thông tin thư mục */
  update_folder_album(
    {
      // page_id: conversationStore.select_conversation?.fb_page_id as string,
      page_id: page_id.value,
      folder_id: folder?._id,
      title: folder?.title,
    },
    (e, r) => {
      // tắt gắn cờ
      is_loading.value = false

      // tắt chế độ sửa
      folder.is_edit = false
    }
  )
}
/**lấy các tập tin đưa vào danh sách gửi */
function pickFile() {
  // đóng modal
  album_ref.value.toggleModal()

  // lấy dữ liệu của file được chọn
  $emit(
    'pick_file',
    file_list.value?.filter(file => file.is_select)
  )

  // huỷ bỏ file được chọn
  selectAllFile(false)
}
/**chọn/huỷ chọn toàn bộ tập tin */
function selectAllFile(value: boolean) {
  file_list.value?.forEach(file => (file.is_select = value))
}
/**làm sạch dữ liệu file */
function resetFileData() {
  is_done.value = false
  skip.value = 0
  file_list.value = []
  folder_list.value = []
}
/**mở album */
function toggleAlbum() {
  album_ref.value?.toggleModal()

  // chuyển danh mục về all
  selected_category.value = 'NEW'

  // xoá thư mục đã chọn
  selected_folder_id.value = undefined

  resetFileData()

  getFile()
}
/**thêm dữ liệu vào danh sách tập tin hiện tại */
// function addDataToFileList(data?: FileInfo[]) {
//   if (!data?.length) return

//   file_list.value?.push(
//     ...data?.map(file => {
//       // thêm gắn cờ
//       file.is_select = is_select_all.value

//       return file
//     })
//   )
// }
/** Thêm dữ liệu vào đầu danh sách tập tin hiện tại */
/**
 * Thêm dữ liệu vào danh sách tập tin hiện tại
 * @param data - Danh sách FileInfo cần thêm
 * @param source - 'fetch' | 'upload' - nguồn dữ liệu
 */
function addDataToFileList(
  data?: FileInfo[],
  source: 'fetch' | 'upload' = 'fetch'
) {
  if (!Array.isArray(data) || data.length === 0) return
  /** Tạo new file từ data đầu vào */
  const NEW_FILES = data.map(file => ({
    ...file,
    is_select: is_select_all.value,
  }))
  /** Check type action  */
  if (source === 'fetch') {
    /** fetch từ server → thêm cuối danh sách */
    file_list.value = [...file_list.value, ...NEW_FILES]
  } else {
    /** upload mới → thêm đầu danh sách */
    file_list.value = [...NEW_FILES, ...file_list.value]
  }
}

/**lấy danh sách tập tin */
function getFile(is_change_page = false) {
  /** lấy page_id từ local */
  const PAGE_ID_MAP = getItem('album_page_id') || {}
  /** Lấy giá trị của page_id */
  page_id.value =
    PAGE_ID_MAP?.[conversationStore.select_conversation?.fb_page_id || ''] ||
    conversationStore.select_conversation?.fb_page_id

  /** nếu không có id trang thì thôi */
  if (!page_id.value) return

  /** nếu đã cache dữ liệu rồi thì thôi không gọi api nữa */
  if (CACHE_LIST_ALBUM.has(page_id.value)) {
    /** lấy dữ liệu trong cache */
    file_list.value = CACHE_LIST_ALBUM.get(page_id.value) || []

    return
  }
  is_loading.value = true
  waterfall(
    [
      /** đọc file từ server */
      (cb: CbError) =>
        read_file_album(
          {
            // page_id: conversationStore.select_conversation
            //   ?.fb_page_id as string,
            page_id: page_id.value,
            folder_id: selected_folder_id.value,
            limit: LIMIT,
            skip: skip.value,
          },
          (e, r) => {
            if (e) return cb(e)
            if (!r?.length || r?.length < LIMIT) is_done.value = true
            if (is_change_page) {
              file_list.value = (r as FileInfo[])?.map(file => {
                /** thêm gắn cờ */
                file.is_select = is_select_all.value

                return file
              })

              /** cache lại dữ liệu */
              CACHE_LIST_ALBUM.set(page_id.value, file_list.value)
            } else {
              addDataToFileList(r)
            }
            cb()
          }
        ),
      // * next
      (cb: CbError) => {
        skip.value += LIMIT

        cb()
      },
    ],
    e => {
      is_loading.value = false

      if (e) return toastError(e)
    }
  )
}
/**
 * chọn file từ thiết bị để thêm vào album
 * @deprecated dùng qua UploadFile ở utils
 */
function uploadFileFromDevice() {
  /**input upload file */
  const INPUT = document.createElement('input')

  /** thêm các thuộc tính cần thiết */
  INPUT.type = 'file'
  INPUT.multiple = true
  INPUT.style.display = 'none'

  /** hàm xử lý sau khi upload thành công */
  INPUT.onchange = () => {
    is_loading.value = true

    /** xử upload file */
    eachOfLimit(
      INPUT.files,
      1,
      (file: File, i, next) => {
        /**dữ liệu upload */
        const FORM = new FormData()
        FORM.append('file', file)

        /** upload lên server */
        upload_file_album(
          {
            // page_id: conversationStore.select_conversation
            //   ?.fb_page_id as string,
            page_id: page_id.value,
            folder_id: selected_folder_id.value,
          },
          FORM,
          (e, r) => {
            if (r) addDataToFileList([r], 'upload')

            next()
          }
        )
      },
      e => {
        is_loading.value = false

        toast('success', $t('v1.common.success'))
      }
    )

    /** xoá input sau khi xong việc */
    if (INPUT && INPUT.parentNode) INPUT.parentNode.removeChild(INPUT)
  }

  /** thêm input vào html */
  document.body.appendChild(INPUT)

  /** click vào input */
  INPUT.click()
}

/** hàm copy link của file vào clipboard */
function copyLink(file: FileInfo) {
  navigator.clipboard.writeText(file.url)
  toast('success', $t('v1.common.success'))
}

defineExpose({ toggleAlbum })
</script>
<style scoped lang="scss">
.custom-btn {
  @apply py-2 px-5 flex items-center gap-1 rounded-lg text-white text-sm hover:brightness-90;
}
</style>
