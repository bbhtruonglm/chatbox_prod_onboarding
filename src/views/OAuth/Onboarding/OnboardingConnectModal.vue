<template>
  <Modal
    ref="modal_ref"
    class_modal="h-[600px] w-[900px]"
    class_body="flex flex-col h-full overflow-hidden"
  >
    <template #header>
      {{ $t('v1.view.onboarding.connect') }} {{ current_platform }}
    </template>
    <template #body>
      <div class="flex-grow relative h-full bg-white rounded-md">
        <!-- Facebook -->
        <EmptyPage
          v-if="current_platform === 'Facebook'"
          :icon="FacebookIcon"
          :guild="
            $t('v1.view.main.dashboard.select_platform.facebook.guild', {
              partner: commonStore.partner?.name,
            })
          "
          :description="
            $t('v1.view.main.dashboard.select_platform.facebook.description')
          "
          class_guild="w-[482px]"
        >
          <template #button>
            <Facebook
              :option="genFBSelectPageOption()"
              @access_token="syncFacebookPage"
              class="h-12"
            />
          </template>
        </EmptyPage>

        <!-- Zalo -->
        <div
          v-if="current_platform === 'Zalo'"
          class="flex h-full w-full"
        >
          <div class="flex-1 flex items-center w-full p-2">
            <div class="flex-1 grid place-items-center">
              <div class="size-[260px] relative p-1">
                <div
                  class="custom-qr-border top-0 left-0 border-t-2 border-l-2 rounded-tl-lg"
                />
                <div
                  class="custom-qr-border top-0 right-0 border-t-2 border-r-2 rounded-tr-lg"
                />
                <div
                  class="custom-qr-border bottom-0 left-0 border-b-2 border-l-2 rounded-bl-lg"
                />
                <div
                  class="custom-qr-border bottom-0 right-0 border-b-2 border-r-2 rounded-br-lg"
                />
                <img
                  v-if="qr_code_url"
                  :src="qr_code_url"
                  class="size-full"
                />
                <div
                  v-if="qr_code_url"
                  class="size-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-0.5 rounded-lg bg-white"
                >
                  <ZaloIcon class="size-full" />
                </div>
                <div
                  v-if="is_loading_zalo"
                  class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                >
                  <Loading class="size-7" />
                </div>

                <div
                  v-if="qr_error"
                  class="flex flex-col items-center gap-2 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-2 rounded-lg font-medium"
                >
                  <span class="text-xs">
                    {{ $t('Mã QR hết hạn') }}
                  </span>
                  <button
                    @click="getZaloQrCode()"
                    class="text-sm bg-blue-600 text-white rounded-md px-5 py-2 w-max"
                  >
                    {{ $t('Lấy mã mới') }}
                  </button>
                </div>
              </div>
            </div>
            <div class="flex flex-col flex-1 items-center gap-2">
              <div class="flex flex-col items-center gap-1">
                <div class="flex items-center gap-5">
                  <img
                    class="size-10"
                    :src="commonStore.partner?.logo?.icon"
                  />
                  <ArrowPathIcon class="size-5 text-slate-500" />
                  <ZaloIcon class="size-10" />
                </div>
                <span class="font-semibold text-base leading-6">
                  {{
                    $t('Kết nối _ với Zalo cá nhân', {
                      name: commonStore.partner?.name,
                    })
                  }}
                </span>
              </div>
              <div class="text-slate-500 text-xs">
                <ul class="list-decimal pb-2 pl-4 border-b border-slate-200">
                  <li>
                    <div class="flex items-center gap-1">
                      {{ $t('Mở ứng dụng') }}
                      <b>Zalo</b>
                      <ZaloIcon class="size-3" />
                      {{ $t('trên điện thoại.') }}
                    </div>
                  </li>
                  <li>
                    <div class="flex items-center gap-1">
                      {{ $t('Trên mục') }}
                      <b>
                        {{ $t('Tìm kiếm') }}
                      </b>
                      <SearchIcon class="size-3" />
                      {{ $t(', ấn vào') }}
                      <b>
                        {{ $t('biểu tượng QR') }}
                      </b>
                      <QrCodeIcon class="size-3" />
                    </div>
                  </li>
                  <li>
                    <div class="flex items-center gap-1">
                      <span><b>Quét mã QR</b> để đăng nhập.</span>
                    </div>
                  </li>
                </ul>
                <div class="pt-2 flex gap-2.5">
                  <ExclamationCircleIcon class="size-3 flex-shrink-0" />
                  <span>
                    {{
                      $t(
                        'Sau khi đăng nhập Zalo trên _, vui lòng không quét mã QR đăng nhập Zalo trên phiên bản Website (https://chat.zalo.me) để làm ảnh hưởng đồng bộ tin nhắn về Bot Bán Hàng.',
                        { name: commonStore.partner?.name }
                      )
                    }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Instagram -->
        <EmptyPage
          v-if="current_platform === 'Instagram'"
          :icon="InstagramIcon"
          :guild="
            $t('Kết nối _ với Trang _', {
              partner: commonStore.partner?.name,
              platform: $t('Instagram'),
            })
          "
          :description="
            $t(
              'Kết nối với Instagram để chat nhiều Trang tự động với AI, tối ưu chi phí Marketing  với CAPI, tự động tích hợp các ứng dụng của Doanh nghiệp.'
            )
          "
          class_guild="w-[482px]"
        >
          <template #button>
            <button
              @click="handleInstagramLogin"
              class="py-2 px-4 rounded-md gap-2 flex items-center bg-slate-100 text-slate-900 text-sm font-semibold"
            >
              <InstagramIcon class="size-4" />
              <span>{{ $t('Kết nối với Instagram') }} </span>
            </button>
          </template>
        </EmptyPage>

        <!-- Website -->
        <div
          v-if="current_platform === 'Website'"
          class="w-full h-full grid grid-cols-2"
        >
          <div class="flex flex-col items-center justify-center gap-5 p-2">
            <div class="w-full flex flex-col gap-1 max-w-xs">
              <div class="text-sm font-medium">
                {{ $t('v1.view.main.dashboard.select_platform.website.name') }}
                <span class="text-red-600">*</span>
              </div>
              <input
                v-model="website_url"
                :placeholder="
                  $t('v1.view.main.dashboard.select_platform.website.input')
                "
                type="text"
                class="py-2 px-3 rounded-md border focus:outline-orange-500 w-full"
                @keyup.enter="createWebsite"
              />
            </div>
            <button
              @click="createWebsite"
              :class="{
                'contrast-50 cursor-not-allowed': !website_url,
              }"
              class="flex justify-between items-center py-2 px-4 gap-2 bg-slate-100 rounded-md hover:brightness-90 w-fit"
            >
              <WebIcon class="w-4 h-4" />
              <div class="text-slate-900 text-sm font-semibold">
                {{
                  $t('v1.view.main.dashboard.select_platform.website.btn_title')
                }}
              </div>
            </button>
          </div>
          <EmptyPage
            :icon="WebIcon"
            :guild="$t('v1.view.main.dashboard.select_platform.website.guild')"
            :description="
              $t('v1.view.main.dashboard.select_platform.website.description')
            "
          />
        </div>
      </div>
    </template>
  </Modal>
  <!-- Các modal phụ -->
  <InjectScript
    v-if="show_inject_script"
    ref="inject_script_ref"
    :page_id="created_page_id"
    @done="onWebsiteDone"
  />
  <AlertRechQuota ref="alert_reach_quota_page_ref" />
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCommonStore, useChatbotUserStore } from '@/stores'
import { container } from 'tsyringe'
import { Toast } from '@/utils/helper/Alert/Toast'
import { N4SerivceAppPage } from '@/utils/api/N4Service/Page'
import { getItem } from '@/service/helper/localStorage'
import { isDomain } from '@/service/helper/check'
import { WindowAction } from '@/utils/helper/Navigation'
import { N13ZaloPersonalAppPage } from '@/utils/api/N13ZaloPersonal/Page'

import Modal from '@/components/Modal.vue'
import EmptyPage from '@/views/Dashboard/ConnectPage/EmptyPage.vue'
import Facebook from '@/components/OAuth/Facebook.vue'
import InjectScript from '@/views/Dashboard/ConnectPage/Website/InjectScript.vue'
import AlertRechQuota from '@/components/AlertModal/AlertRechQuota.vue'
import Loading from '@/components/Loading.vue'

import FacebookIcon from '@/components/Icons/Facebook.vue'
import ZaloIcon from '@/components/Icons/Zalo.vue'
import InstagramIcon from '@/components/Icons/Instagram.vue'
import WebIcon from '@/components/Icons/Web.vue'
import SearchIcon from '@/components/Icons/Search.vue'
import QrCodeIcon from '@/components/Icons/QrCode.vue'
import { ArrowPathIcon, ExclamationCircleIcon } from '@heroicons/vue/24/solid'

const { t: $t } = useI18n()
const commonStore = useCommonStore()
const chatbotUserStore = useChatbotUserStore()
const $toast = container.resolve(Toast)

const modal_ref = ref<InstanceType<typeof Modal>>()
const current_platform = ref<string>('')

const $emit = defineEmits<{
  (e: 'done', platform: string): void
}>()

/** --------------- COMMON ---------------- */
function toggleModal(platform: string) {
  // Clear old session if Zalo
  if (current_platform.value === 'Zalo') {
    clearZaloSession()
  }

  current_platform.value = platform

  // Open modal first
  modal_ref.value?.toggleModal()

  // Init Zalo if selected
  if (platform === 'Zalo') {
    getZaloQrCode()
  }
}

defineExpose({ toggleModal })

/** --------------- FACEBOOK ---------------- */
function genFBSelectPageOption() {
  let login_option = {
    scope: [
      'public_profile',
      'pages_show_list',
      'pages_messaging',
      'email',
      'pages_read_user_content',
      'pages_read_engagement',
      'read_insights',
      'instagram_manage_comments',
      'instagram_manage_insights',
      'pages_manage_metadata',
      'pages_manage_posts',
      'pages_manage_engagement',
      'ads_management',
      'business_management',
    ].join(),
    enable_profile_selector: true,
    auth_type: 'rerequest',
  }
  return JSON.stringify(login_option)
}

async function syncFacebookPage(access_token: string) {
  try {
    commonStore.is_loading_full_screen = true
    await new N4SerivceAppPage().syncFacebookPage(access_token)
    $toast.success($t('Kết nối Facebook thành công'))
    $emit('done', 'Facebook')
    modal_ref.value?.toggleModal()
  } catch (e: any) {
    $toast.error(e)
  } finally {
    commonStore.is_loading_full_screen = false
  }
}

/** --------------- ZALO PERSONAL ---------------- */
/**dữ liệu hình ảnh qr để quét */
const qr_code_url = ref<string>()
/**kết nối socket */
const connection = ref<WebSocket>()
/**lỗi khi quét mã qr */
const qr_error = ref<boolean>(false)
/**loading zalo */
const is_loading_zalo = ref(false)

/**dữ liệu socket */
interface ISocketData {
  event:
    | 'SECOND_QR_CODE'
    | 'EXPIRE_QR_CODE'
    | 'SUCCESS_SCAN_QR_CODE'
    | 'DONE_CONNECT_PAGE'
  qr_code_url: string
}

function clearZaloSession() {
  is_loading_zalo.value = false
  qr_code_url.value = undefined
  qr_error.value = false
  connection.value?.close()
}

function listenZaloSocket(org_id: string) {
  connection.value = new WebSocket($env.host.n13_zalo_personal_socket)
  let ping_interval_id: number

  connection.value.onopen = () => {
    connection.value?.send(
      JSON.stringify({
        user_id: chatbotUserStore.chatbot_user?.user_id,
        org_id: org_id,
        event: 'JOIN',
      })
    )
    ping_interval_id = setInterval(() => connection.value?.send('ping'), 30_000)
  }

  connection.value.onclose = () => {
    clearInterval(ping_interval_id)
  }

  connection.value.onmessage = async ({ data }) => {
    if (!data) return
    let socket_data: ISocketData = undefined!
    try {
      socket_data = JSON.parse(data)
    } catch (e) {}

    switch (socket_data?.event) {
      case 'SUCCESS_SCAN_QR_CODE':
        is_loading_zalo.value = true
        break
      case 'DONE_CONNECT_PAGE':
        clearZaloSession()
        $toast.success($t('Kết nối Zalo cá nhân thành công'))
        $emit('done', 'Zalo')
        modal_ref.value?.toggleModal()
        break
      case 'EXPIRE_QR_CODE':
        qr_error.value = true
        is_loading_zalo.value = false
        break
      case 'SECOND_QR_CODE':
        qr_code_url.value = socket_data.qr_code_url
        break
    }
  }
}

async function getZaloQrCode() {
  try {
    is_loading_zalo.value = true
    const selected_org_id = getItem('selected_org_id')
    if (!selected_org_id) throw new Error('Không tìm thấy ID tổ chức')

    listenZaloSocket(selected_org_id)
    qr_code_url.value = await new N13ZaloPersonalAppPage().syncZaloPersonalPage(
      selected_org_id
    )
    qr_error.value = false
  } catch (e: any) {
    $toast.error(e)
  } finally {
    is_loading_zalo.value = false
  }
}

/** --------------- INSTAGRAM ---------------- */
async function handleInstagramLogin() {
  try {
    const APP_ID = $env.instagram.app_id
    const REDIRECT_URI = $env.instagram.redirect_uri
    const SCOPE = encodeURIComponent($env.instagram.scope.join(','))
    container
      .resolve(WindowAction)
      .redirect(
        `https://www.instagram.com/oauth/authorize?enable_fb_login=0&force_authentication=1&client_id=${APP_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${SCOPE}`
      )
  } catch (e: any) {
    $toast.error(e)
  }
}

/** --------------- WEBSITE ---------------- */
const website_url = ref('')
const created_page_id = ref<string>()
const inject_script_ref = ref<InstanceType<typeof InjectScript>>()
const alert_reach_quota_page_ref = ref<InstanceType<typeof AlertRechQuota>>()
const show_inject_script = ref(false)

async function createWebsite() {
  if (!website_url.value) return
  if (!isDomain(website_url.value)) {
    $toast.error(
      $t('v1.view.main.dashboard.select_platform.website.wrong_name')
    )
    return
  }
  try {
    commonStore.is_loading_full_screen = true
    const selected_org_id = getItem('selected_org_id')
    if (!selected_org_id) throw new Error('Không tìm thấy ID tổ chức')

    const PAGE = await new N4SerivceAppPage().createWebsite({
      name: website_url.value,
      org_id: selected_org_id,
    })
    created_page_id.value = PAGE?.fb_page_id
    show_inject_script.value = true
    await nextTick()
    inject_script_ref.value?.toggleModal()
  } catch (e: any) {
    /** Lỗi quá giới hạn */
    if (e?.message === 'REACH_QUOTA.PAGE') {
      alert_reach_quota_page_ref.value?.toggleModal()
      return
    }
    $toast.error(e)
  } finally {
    commonStore.is_loading_full_screen = false
  }
}

function onWebsiteDone() {
  $emit('done', 'Website')
  website_url.value = ''
  created_page_id.value = undefined
  show_inject_script.value = false
  modal_ref.value?.toggleModal()
}
</script>
<style scoped lang="scss">
.custom-qr-border {
  @apply absolute size-12 border-blue-500;
}
</style>
