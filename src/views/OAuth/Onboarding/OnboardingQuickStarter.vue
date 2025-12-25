<template>
  <div
    class="flex max-full mx-auto overflow-hidden gap-2.5 flex-grow h-full min-h-0"
  >
    <!-- Left panel -->
    <aside
      class="w-96 p-5 gap-10 bg-white flex flex-col justify-between flex-grow min-h-0 h-full rounded-xl"
    >
      <div class="flex flex-col gap-10">
        <div
          :style="{
            backgroundImage: `url(${commonStore.partner?.logo?.full})`,
          }"
          class="h-7 w-full bg-contain bg-no-repeat bg-left flex-shrink-0"
        />
        <div class="flex flex-col gap-3">
          <h1 class="text-5xl leading-tight font-semibold">
            {{ $t('v1.view.onboarding.quick_started') }}
          </h1>
          <p class="text-black text-sm font-medium">
            {{ $t('v1.view.onboarding.two_minutes') }}
          </p>
        </div>
      </div>
    </aside>

    <!-- Right panel -->
    <main
      class="flex w-full flex-grow min-h-0 h-full gap-3 px-3 py-5 rounded-xl bg-white flex-col justify-between"
    >
      <div class="flex flex-col flex-grow min-h-0 h-full gap-8">
        <!-- Step header -->
        <div class="flex flex-col justify-between gap-3">
          <div
            class="flex w-fit items-center bg-slate-300 text-gray-700 px-3 py-1 rounded-full text-sm"
          >
            {{ current_step + 1 }} {{ $t('v1.view.onboarding.step_of') }}
            {{ total_steps }}
          </div>
          <div>
            <h2 class="text-4xl font-bold flex gap-2.5 items-center">
              {{ STEP_TITLE }}
            </h2>
            <p class="font-medium">{{ STEP_DESCRIPTIONS }}</p>
            <div
              v-if="current_org_info"
              class="mt-2 text-sm text-slate-600 flex items-center gap-2"
            >
              <span>Tổ chức:</span>
              <div
                class="flex items-center gap-3 px-3 py-1.5 bg-gray-50 rounded-md border border-gray-200"
              >
                <img
                  v-if="current_org_info.org_info?.org_avatar"
                  :src="current_org_info.org_info.org_avatar"
                  class="size-8 rounded-full object-cover shadow-sm flex-shrink-0"
                />
                <div
                  v-else
                  class="size-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold uppercase flex-shrink-0"
                >
                  {{ current_org_info.org_info?.org_name?.charAt(0) || 'O' }}
                </div>
                <div class="flex flex-col">
                  <span class="font-bold text-black text-base leading-tight">{{
                    current_org_info.org_info.org_name
                  }}</span>
                  <span class="text-xs text-gray-500 font-mono leading-tight">{{
                    current_org_info.org_id || current_org_info._id
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex flex-col gap-5">
          <div
            v-if="current_step === 0"
            class="px-28 py-1"
          >
            <h3 class="text-slate-500 font-medium text-xs">
              {{ $t('v1.view.onboarding.select_platform_to_connect') }}
            </h3>
            <ul class="divide-y">
              <li
                v-for="(item, i) in PLAT_FORMS"
                :key="i"
                class="flex flex-col px-2 py-4 gap-3"
              >
                <div class="flex items-center justify-between gap-3">
                  <!-- Thông tin -->
                  <div class="flex items-center gap-3">
                    <ZaloIcon
                      v-if="item.name === 'Zalo'"
                      class="size-8"
                    />
                    <FacebookIcon
                      v-else-if="item.name === 'Facebook'"
                      class="size-8"
                    />
                    <InstagramIcon
                      v-else-if="item.name === 'Instagram'"
                      class="size-8"
                    />
                    <Whatsapp
                      v-else-if="item.name === 'Whatsapp'"
                      class="size-8"
                    />
                    <img
                      v-else
                      src="https://static.retion.ai/chatbox/partner/retion.logo.png"
                      class="size-8"
                    />
                    <div class="flex flex-col">
                      <span class="font-semibold text-sm">{{ item.name }}</span>
                      <span class="text-slate-500 text-xs">{{
                        item.desc
                      }}</span>
                    </div>
                  </div>

                  <!-- Nút trạng thái -->
                  <div>
                    <button
                      v-if="CONNECTED_PLATFORMS.includes(item?.name)"
                      class="text-blue-600 border py-2 border-transparent flex items-center gap-1 text-sm font-semibold"
                    >
                      {{ $t('v1.view.onboarding.connected') }}
                      <Link2Icon class="size-4" />
                    </button>
                    <button
                      v-else
                      @click="handleAddPlatforms(item?.name)"
                      class="px-6 py-2 bg-slate-200 border border-slate-300 font-semibold rounded-md hover:bg-slate-300 flex items-center gap-1 text-sm"
                    >
                      <span class="flex gap-1 items-center">
                        {{ $t('v1.view.onboarding.connect') }}
                        <ChevronRightIcon class="size-4" />
                      </span>
                    </button>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div v-else-if="current_step === 1">
            <div class="flex flex-col gap-5 max-w-xl">
              <!-- Link invite -->
              <div class="flex items-center gap-5">
                <div class="flex-1">
                  <label class="block text-sm font-medium mb-1">{{
                    $t('v1.view.onboarding.link_invite')
                  }}</label>
                  <input
                    type="text"
                    readonly
                    :value="INVITE_LINKS"
                    class="w-full border rounded-md px-3 py-2 bg-gray-100"
                  />
                </div>
                <button
                  v-if="!IS_COPIED"
                  @click="copyLink(INVITE_LINKS)"
                  class="mt-6 px-4 py-2 w-28 text-sm font-medium bg-gray-100 hover:bg-gray-200 rounded-md"
                >
                  {{ $t('v1.view.onboarding.copy_clipboard') }}
                </button>
                <button
                  v-else
                  class="mt-6 px-4 py-2 w-28 flex font-medium items-center gap-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md"
                >
                  {{ $t('v1.view.onboarding.copied') }}
                  <CheckIcon class="size-5" />
                </button>
              </div>

              <!-- Email addresses (Ẩn đi do chưa có API) -->
              <div v-if="false">
                <div
                  v-for="(email, index) in emails"
                  :key="index"
                  class="flex items-center gap-5"
                >
                  <div class="flex-1">
                    <label class="block text-sm font-medium mb-1">{{
                      $t('v1.view.onboarding.email_address')
                    }}</label>
                    <input
                      type="email"
                      v-model="emails[index]"
                      :placeholder="$t('v1.view.onboarding.enter_email')"
                      class="w-full border rounded-md px-3 py-2 relative"
                      :ref="
                        el => {
                          if (index === 0)
                            FIRST_EMAIL_INPUT = el as HTMLInputElement
                        }
                      "
                    />
                    <p
                      v-if="emailErrors[index]"
                      class="text-red-500 text-xs absolute"
                    >
                      {{ emailErrors[index] }}
                    </p>
                  </div>
                  <button
                    @click="sendInvite(email, index)"
                    class="mt-6 px-4 py-2 w-28 rounded-md text-sm font-medium"
                    :class="[
                      /** Check có email và không sai regex */
                      email[index] && !emailErrors[index]
                        ? 'bg-blue-600 hover:bg-blue-500 text-white'
                        : 'bg-gray-100 hover:bg-gray-200',
                    ]"
                  >
                    {{ $t('v1.view.onboarding.send_invite') }}
                  </button>
                </div>

                <!-- Add more email field -->
                <button
                  @click="addEmailField"
                  class="flex items-center gap-2 text-sm text-gray-700 hover:text-black"
                >
                  <PlusCircleIcon class="size-5" />
                  {{ $t('v1.view.onboarding.invite_email') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-between items-center w-full">
        <button
          class="px-10 py-3 gap-4 rounded-md bg-gray-200 font-medium text-black focus:outline-none disabled:opacity-50"
          :disabled="current_step === 0"
          @click="prevStep"
        >
          {{ $t('v1.view.onboarding.back') }}
        </button>

        <!-- Khi chưa đến step 5 -->
        <div class="flex items-center w-2/3 justify-end gap-4">
          <!-- Khi step 5 -->

          <button
            :class="[
              'px-10 py-3 rounded-md font-medium border focus:outline-none flex-shrink-0 bg-white text-orange-600 border-orange-300 hover:text-white hover:bg-orange-500',
            ]"
            @click="skipForNow"
          >
            {{ $t('v1.view.onboarding.skip_for_now') }}
          </button>

          <!-- Khi chưa đến step 5 -->

          <button
            :class="[
              'px-10 py-3 rounded-md font-medium border focus:outline-none',
              IS_VALID_BTN_NEXT
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-blue-100 text-blue-600 border-blue-300',
            ]"
            @click="nextStep"
            :disabled="!IS_VALID_BTN_NEXT"
          >
            {{ $t('v1.view.onboarding.next') }}
          </button>
        </div>
      </div>
    </main>
  </div>
  <ConnectPage
    ref="connect_page_ref"
    @done="onConnectDone"
  />
  <AlertRechQuota ref="alert_reach_quota_page_ref" />
</template>

<script setup lang="ts">
import { useCommonStore } from '@/stores'
import { useI18n } from 'vue-i18n'

import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  toRefs,
  watch,
} from 'vue'

import { copyToClipboard } from '@/service/helper/copyWithAlert'

import FacebookIcon from '@/components/Icons/Facebook.vue'
import InstagramIcon from '@/components/Icons/Instagram.vue'
import Whatsapp from '@/components/Icons/Whatsapp.vue'
import ZaloIcon from '@/components/Icons/Zalo.vue'
import { PlusCircleIcon } from '@heroicons/vue/24/outline'
import { ChevronRightIcon } from '@heroicons/vue/16/solid'
import { CheckIcon } from '@heroicons/vue/24/solid'
import { Link2Icon } from 'lucide-vue-next'
import { N4SerivceAppPage } from '@/utils/api/N4Service/Page'
import { ToastSingleton } from '@/utils/helper/Alert/Toast'
import { useChatbotUserStore, useOrgStore, useConnectPageStore } from '@/stores'
import { useRoute, useRouter } from 'vue-router'
import ConnectPage from '@/views/Dashboard/ConnectPage.vue'
import { BillingAppOrganization } from '@/utils/api/Billing'
import { getItem, setItem } from '@/service/helper/localStorage'
import AlertRechQuota from '@/components/AlertModal/AlertRechQuota.vue'

/** Hàm dịch */
const { t: $t } = useI18n()
/** Khai báo common store */
const commonStore = useCommonStore()
const chatbotUserStore = useChatbotUserStore()
const orgStore = useOrgStore()
const connectPageStore = useConnectPageStore()
const $toast = ToastSingleton.getInst()
const $route = useRoute()
const $router = useRouter()

/** Định nghĩa props */
const props = defineProps<{
  /** Số phone */
  phone: string
  /** Bước hiện tại */
  current_step: number
  /** Tổng số bước */
  total_steps: number
}>()

/** Hàm emit */
const $emit = defineEmits<{
  (e: 'update:phone', value: string): void
  (e: 'skip_for_now'): void
  (e: 'back'): void
  (e: 'next'): void
}>()
/** Khai báo các nền tảng */
const PLAT_FORMS = [
  {
    name: 'Facebook',
    desc: 'Kết nối Trang Facebook',
    icon: '/icons/facebook.png',
    connected: false,
  },
  {
    name: 'Instagram',
    desc: 'Kết nối Trang Instagram',
    icon: '/icons/instagram.png',
    connected: false,
  },
  {
    name: 'Whatsapp',
    desc: 'Kết nối Whatsapp Business và Cá nhân.',
    icon: '/icons/whatsapp.png',
    connected: false,
  },
  {
    name: 'Zalo',
    desc: 'Kết nối Zalo OA và Zalo cá nhân.',
    icon: '/icons/zalo.png',
    connected: false,
  },
  {
    name: 'Website',
    desc: 'Kết nối Website',
    icon: '/icons/website.png',
    connected: false,
  },
]
/** Danh sachs platform đã kết nối */
const CONNECTED_PLATFORMS = ref<String[]>([])

/** ref cho input đầu tiên */
const FIRST_EMAIL_INPUT = ref<HTMLInputElement | null>(null)

/** ref modal connect page */
const connect_page_ref = ref<InstanceType<typeof ConnectPage>>()

/** ref của modal thông báo hết quota */
const alert_reach_quota_page_ref = ref<InstanceType<typeof AlertRechQuota>>()

/** Số page hiện tại */
const PAGE_COUNT = ref(0)
/** Số page tối đa */
const QUOTA_PAGE = ref(0) // 0 means default/loading, ideally should be higher or handled as loading

/** Thông tin organization */
const current_org_info = ref<any>(null)

console.log('current_org_info.value', current_org_info.value)

/** Platform hiện tại đang kết nối */
const current_connecting_platform = ref('')

/** Hàm thêm platform */
const handleAddPlatforms = (platform: string) => {
  /** Check quota */
  if (PAGE_COUNT.value >= QUOTA_PAGE.value) {
    alert_reach_quota_page_ref.value?.toggleModal()
    return
  }

  /** Lưu platform đang kết nối */
  current_connecting_platform.value = platform

  let key = ''
  switch (platform) {
    case 'Facebook':
      key = 'FB_MESS'
      break
    case 'Instagram':
      key = 'FB_INSTAGRAM'
      break
    case 'Zalo':
      key = 'ZALO_PERSONAL'
      break
    case 'Website':
      key = 'WEBSITE'
      break
  }

  /** Mở modal connect page */
  if (key && connect_page_ref.value) {
    connect_page_ref.value.toggleModal(key, true)
  }
}

/** Callback khi connect done từ modal */
const onConnectDone = () => {
  const platform = current_connecting_platform.value
  if (platform && !CONNECTED_PLATFORMS.value.includes(platform)) {
    CONNECTED_PLATFORMS.value.push(platform)
    /** Tăng số lượng page */
    PAGE_COUNT.value++
  }
}
/** Hàm xử lý callback sau khi oauth zalo */
const afterOauthZalo = async () => {
  try {
    /** Lấy query */
    let { code, oa_id, state } = $route.query
    if (!code || !oa_id || !state) return

    commonStore.is_loading_full_screen = true

    /** Xoá query để không bị chạy 2 lần */
    $router.replace({ path: $route.path, query: {} })

    /** Gọi api để khởi tạo trang */
    await new N4SerivceAppPage().syncZaloOaPage({
      oa_id: String(oa_id),
      code: String(code),
      code_verifier: String(state),
      staff_name: chatbotUserStore.chatbot_user?.full_name,
    })

    CONNECTED_PLATFORMS.value.push('Zalo')
    $toast.success($t('Kết nối Zalo OA thành công'))
  } catch (e: any) {
    $toast.error(e)
  } finally {
    commonStore.is_loading_full_screen = false
  }
}

/** On mounted check callback */
onMounted(async () => {
  /** Xử lý callback Zalo trước */
  await afterOauthZalo()

  /** Lấy thông tin tổ chức để check quota */
  try {
    /** Lấy danh sách các tổ chức từ API */
    const ALL_ORGS = await new BillingAppOrganization().readOrg()

    console.log('ALL_ORGS', ALL_ORGS)
    console.log('chatbotUserStore.chatbot_user', chatbotUserStore.chatbot_user)
    /** Lấy user id */
    const USER_ID = chatbotUserStore.chatbot_user?._id || getItem('user_id')

    /** Filter chỉ lấy Org mà user là Owner */
    const OWNER_ORGS = USER_ID
      ? ALL_ORGS.filter((o: any) => o.org_owner_id === USER_ID)
      : ALL_ORGS

    /** Cập nhật danh sách tổ chức vào store */
    orgStore.list_org = ALL_ORGS as any
    /** Logic xử lý chọn tổ chức */
    let selected_id = getItem('selected_org_id')
    let selected_org = null

    /** Tìm tổ chức theo ID đã lưu */
    if (selected_id) {
      selected_org = OWNER_ORGS.find(
        (o: any) => (o.org_id || o._id) === selected_id
      )
    }

    console.log('--- DEBUG SELECT ORG ---')
    console.log('OWNER_ORGS:', OWNER_ORGS)
    console.log('Local selected_id:', selected_id)
    console.log('Found valid owner org:', selected_org)

    /** Nếu không tìm thấy (hoặc chưa có), mặc định lấy tổ chức đầu tiên */
    if (!selected_org && OWNER_ORGS.length > 0) {
      console.log('Fallback to first owner org')
      selected_org = OWNER_ORGS[0]
      selected_id = selected_org.org_id || (selected_org as any)._id
      /** Lưu vào storage */
      setItem('selected_org_id', selected_id)
    }

    /** Cập nhật store nếu có org hợp lệ */
    if (selected_org && selected_id) {
      orgStore.selected_org_id = selected_id
      orgStore.selected_org_info = selected_org
      current_org_info.value = selected_org
      PAGE_COUNT.value = selected_org.org_package?.org_current_page || 0
      QUOTA_PAGE.value = selected_org.org_package?.org_quota_page || 0
    }
  } catch (e) {
    console.error(e)
  }
})
/** Trạng thái  */
const IS_VALID_BTN_NEXT = computed(() => {
  /** Đang ở step 1 */
  if (props.current_step === 0) {
    return CONNECTED_PLATFORMS.value.length > 0
  }
  /** Đang ở step 2 */
  if (props.current_step === 1) {
    /** Nếu trạng thái copy thì active btn */
    if (IS_COPIED.value) {
      return true
    }
    /** Check có email valid */
    const HAS_VALID_EMAIL = emails.value.some(email => {
      /** dùng regex validate email */
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    })
    /** Nếu có ít nhất 1 email đúng thì return true */
    if (HAS_VALID_EMAIL) {
      return true
    }
  }

  return false
})
/** giúp current_step reactive */
const { current_step } = toRefs(props)
/** Theo dõi thay đổi current step */
watch(current_step, async new_val => {
  /** Nếu step --= 1 */
  if (new_val === 1) {
    /** Chờ nextTick */
    await nextTick()
    /**focus vào ô input đầu tiên */
    FIRST_EMAIL_INPUT.value?.focus()
  }
})

/** Hàm next sang step */
const nextStep = () => {
  $emit('next')
}
/** Hàm skip tất cả */
const skipForNow = () => {
  $emit('skip_for_now')
}
/** Hàm back lại */
const prevStep = () => {
  $emit('back')
}

/** Trạng thái gửi verify code */
const is_sending_verify_code = ref(false)

/** countdown */
const time_remaining = ref(30)
/** Tạo count down interval */
let countdown_interval: number | undefined

/** Phone value với v-model */
const phone_value = ref(props.phone)

/** Đồng bộ phone prop với phone_value */
watch(phone_value, newValue => {
  $emit('update:phone', newValue)
})

/** Đồng bộ props.phone với phone_value khi props thay đổi */
watch(
  () => props.phone,
  newValue => {
    phone_value.value = newValue
  }
)
/** timeout verify sau 5s */
let verify_timeout: number | undefined

/** clear interval */
onBeforeUnmount(() => {
  clearInterval(countdown_interval)
  if (verify_timeout) clearTimeout(verify_timeout)
})

/** INVITE LINK */
const INVITE_LINKS = import.meta.env.VITE_REGISTER_URL

/** Trạng thái copied */
const IS_COPIED = ref<Boolean>(false)
/** Email */
const emails = ref(['', '']) // mặc định 2 ô như ảnh
/** mảng lỗi cho từng email */
const emailErrors = ref<string[]>(['', ''])

/** Hàm copy link */
const copyLink = (value: string) => {
  /** Lưu giá trị clip board */
  copyToClipboard(value)
  /** Bật trạng thái copied */
  IS_COPIED.value = true
}
/** Gửi lời mới */
const sendInvite = (email: string, index: number) => {
  /** Check validate email */
  if (!isValidEmail(email)) {
    emailErrors.value[index] = 'Email không hợp lệ'
    return
  }
  /** Xóa error */
  emailErrors.value[index] = ''
  console.log('Send invite to', email)
}

/**  validate email*/
const isValidEmail = (email: string) => {
  /** Regex email. */
  const REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  /** Trả về trạng thái regex */
  return REGEX.test(email)
}

/** THêm email */
const addEmailField = () => {
  /** add field trống vào email */
  emails.value.push('')
  /** Errors field */
  emailErrors.value.push('')
}

/** ✅ realtime validate: watch mảng emails */
watch(
  emails,
  newVal => {
    newVal.forEach((email, idx) => {
      if (email === '') {
        emailErrors.value[idx] = ''
      } else if (!isValidEmail(email)) {
        emailErrors.value[idx] = 'Email không hợp lệ'
      } else {
        emailErrors.value[idx] = ''
      }
    })
  },
  { deep: true }
)

/** Title + description theo step */
const STEP_TITLE = computed(() => {
  return [
    $t('v1.view.onboarding.connect_social'),
    $t('v1.view.onboarding.invite_staff'),
  ][props.current_step]
})
/** description các màn */
const STEP_DESCRIPTIONS = computed(() => {
  return [
    $t('v1.view.onboarding.connect_social_description'),
    $t('v1.view.onboarding.invite_staff_desctiption'),
  ][props.current_step]
})
</script>

<style scoped></style>
