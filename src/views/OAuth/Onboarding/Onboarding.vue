<template>
  <!-- <div class="h-screen bg-gradient-primary py-10 px-6 font-sans"> -->
  <div class="h-screen bg-gradient-primary py-10 px-6 font-sans">
    <div
      v-if="flow_step === 1"
      class="flex mx-auto overflow-hidden gap-2.5 flex-grow h-full min-h-0"
    >
      <!-- Left panel -->
      <aside
        class="w-96 p-5 gap-10 bg-white flex flex-col justify-between flex-grow min-h-0 h-full rounded-xl"
      >
        <div class="flex flex-col gap-10">
          <div class="flex flex-col gap-10">
            <div
              :style="{
                backgroundImage: `url(${commonStore.partner?.logo?.full})`,
              }"
              class="h-7 w-full bg-contain bg-no-repeat bg-left flex-shrink-0"
            />
          </div>
          <div class="flex flex-col gap-3">
            <h1 class="text-5xl leading-tight font-semibold">
              {{ $t('v1.view.onboarding.personal_experience') }}
            </h1>
            <p class="text-black text-sm font-medium">
              {{ $t('v1.view.onboarding.two_minutes') }}
            </p>
          </div>
        </div>
      </aside>

      <main
        class="flex w-full flex-grow min-h-0 h-full gap-3 px-3 py-5 rounded-xl bg-white flex-col justify-between"
      >
        <div class="flex flex-col flex-grow min-h-0 h-full gap-8 border-b">
          <!-- Step header -->
          <div class="flex flex-col justify-between gap-3">
            <div
              class="flex w-fit items-center bg-slate-300 text-gray-700 px-3 py-1 rounded-full text-sm"
            >
              {{ current_step + 1 }} {{ $t('v1.view.onboarding.step_of') }}
              {{ total_steps }}
            </div>
            <div>
              <h2 class="text-4xl font-bold">{{ STEP_TITLE }}</h2>
              <p class="font-medium">{{ STEP_DESCRIPTIONS }}</p>
            </div>
          </div>

          <Transition
            name="fade-slide"
            mode="out-in"
            @after-enter="focusCompanyInput"
          >
            <div
              :key="current_step"
              class="flex flex-col gap-5 flex-grow min-h-0 overflow-hidden overflow-y-auto py-2"
            >
              <!-- Step 1: Industry -->
              <div v-if="current_step === 0">
                <div class="grid grid-cols-3 gap-5 px-4">
                  <button
                    v-for="option in OPTION_INDUSTRY"
                    :key="option"
                    :class="[
                      'border rounded-md py-3 px-5 text-center text-sm font-semibold transition-all',
                      SELECTED_INDUSTRY === option
                        ? 'bg-blue-700 border-blue-700 text-white'
                        : 'border-slate-500 bg-white hover:bg-blue-100',
                    ]"
                    @click="handleIndustry(option)"
                  >
                    {{ option }}
                  </button>
                </div>
              </div>

              <!-- Step 2: Role -->
              <div v-if="current_step === 1">
                <div class="grid grid-cols-3 gap-5 px-4">
                  <button
                    v-for="option in OPTION_ROLE"
                    :key="option"
                    :class="[
                      'border rounded-md py-3 px-5 text-center text-sm font-semibold transition-all',
                      SELECTED_ROLE === option
                        ? 'bg-blue-700 border-blue-700 text-white'
                        : 'border-slate-500 bg-white hover:bg-blue-100',
                    ]"
                    @click="handleRole(option)"
                  >
                    {{ option }}
                  </button>
                </div>
              </div>

              <!-- Step 3: Company name -->
              <div
                v-if="current_step === 2"
                class="flex flex-col gap-1 max-w-lg"
              >
                <label class="block text-gray-700 font-medium text-sm">
                  {{ $t('v1.view.onboarding.company_name')
                  }}<span class="text-red-500">*</span>
                </label>
                <input
                  ref="company_name_input_ref"
                  v-model="COMPANY_DETAILS.name"
                  type="text"
                  :placeholder="$t('v1.view.onboarding.enter_company_name')"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none"
                />
              </div>

              <!-- Step 4: Preferences -->
              <div v-if="current_step === 3">
                <div class="grid grid-cols-3 gap-5 px-4">
                  <button
                    v-for="option in OPTION_PREFERENCES"
                    :key="option"
                    :class="[
                      'border rounded-md py-3 px-5 text-center font-semibold text-sm transition-all',
                      SELECTED_PREFERENCES === option
                        ? 'bg-blue-700 border-blue-700 text-white'
                        : 'border-slate-500 bg-white hover:bg-blue-100',
                    ]"
                    @click="handlePreference(option)"
                  >
                    {{ option }}
                  </button>
                </div>
              </div>

              <!-- Step 5: Company details -->
              <div
                v-if="current_step === 4"
                class="flex flex-col max-w-lg gap-4"
              >
                <div class="flex flex-col gap-1">
                  <label class="block text-gray-700 font-semibold text-sm">{{
                    $t('v1.view.onboarding.website_company')
                  }}</label>
                  <div
                    class="flex border rounded-md overflow-hidden items-center border-gray-200"
                  >
                    <div class="pl-3 pr-1 py-2.5 bg-slate-100">www.</div>
                    <input
                      ref="company_website_input_ref"
                      v-model="COMPANY_DETAILS.website"
                      type="text"
                      :placeholder="$t('v1.view.onboarding.enter_website')"
                      class="w-full rounded-r-md px-4 pl-1 py-2 font-semibold outline-none"
                      :class="
                        !IS_WEBSITE_VALID && COMPANY_DETAILS.website
                          ? 'border-red-500'
                          : ''
                      "
                    />
                    <!-- hiển thị lỗi -->
                  </div>
                  <p
                    v-if="COMPANY_DETAILS.website && !IS_WEBSITE_VALID"
                    class="text-red-500 text-xs"
                  >
                    {{ $t('v1.view.onboarding.validate_website') }}
                  </p>
                </div>
                <div class="flex flex-col gap-1">
                  <label class="block text-gray-700 font-semibold text-sm">{{
                    $t('v1.view.onboarding.facebook_page')
                  }}</label>
                  <div
                    class="flex border rounded-md overflow-hidden items-center border-gray-200"
                  >
                    <div class="pl-3 pr-1 py-2.5 bg-slate-100">
                      facebook.com/
                    </div>
                    <input
                      v-model="COMPANY_DETAILS.facebook"
                      type="text"
                      :placeholder="$t('v1.view.onboarding.enter_facebook')"
                      class="w-full rounded-r-md px-4 pl-1 py-2 font-semibold outline-none"
                    />
                  </div>
                </div>
                <div class="flex flex-col gap-1">
                  <label class="block text-gray-700 font-semibold text-sm">{{
                    $t('v1.view.onboarding.instagram_page')
                  }}</label>
                  <div
                    class="flex border rounded-md overflow-hidden items-center border-gray-200"
                  >
                    <div class="pl-3 pr-1 py-2.5 bg-slate-100">
                      instagram.com/
                    </div>
                    <input
                      v-model="COMPANY_DETAILS.instagram"
                      type="text"
                      :placeholder="$t('v1.view.onboarding.enter_instagram')"
                      class="w-full rounded-r-md px-4 pl-1 py-2 font-semibold outline-none"
                    />
                  </div>
                </div>
                <div class="flex flex-col gap-1">
                  <label class="block text-gray-700 font-semibold text-sm">{{
                    $t('v1.view.onboarding.tiktok_page')
                  }}</label>
                  <div
                    class="flex border rounded-md overflow-hidden items-center border-gray-200"
                  >
                    <div class="pl-3 pr-1 py-2.5 bg-slate-100">tiktok.com/</div>
                    <input
                      v-model="COMPANY_DETAILS.tiktok"
                      type="text"
                      :placeholder="$t('v1.view.onboarding.enter_tiktok')"
                      class="w-full rounded-r-md px-4 pl-1 py-2 font-semibold outline-none"
                    />
                  </div>
                </div>
                <div class="flex flex-col gap-1">
                  <label class="block text-gray-700 font-semibold text-sm">{{
                    $t('v1.view.onboarding.zalo')
                  }}</label>
                  <div
                    class="flex border rounded-md overflow-hidden items-center border-gray-200"
                  >
                    <div class="pl-3 pr-1 py-2.5 bg-slate-100">zalo.me/</div>
                    <input
                      v-model="COMPANY_DETAILS.zalo"
                      type="text"
                      :placeholder="$t('v1.view.onboarding.enter_zalo')"
                      class="w-full rounded-r-md px-4 pl-1 py-2 font-semibold outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>

        <!-- Navigation -->
        <div class="flex justify-between items-center w-full">
          <button
            class="px-10 py-3 gap-4 rounded-md font-medium text-black focus:outline-none disabled:opacity-50"
            :class="[
              current_step === 0
                ? 'hover:bg-gray-200 bg-gray-200 cursor-not-allowed'
                : 'bg-gray-200 ',
            ]"
            :disabled="current_step === 0"
            @click="prevStep"
          >
            {{ $t('v1.view.onboarding.back') }}
          </button>

          <div class="flex items-center w-2/3 justify-end gap-4">
            <template v-if="current_step === total_steps - 1">
              <p class="text-xs text-left">
                {{ $t('v1.view.onboarding.step_5_description') }}
                <a
                  class="underline text-black"
                  href="https://retion.ai"
                  target="_blank"
                >
                  {{ $t('v1.view.onboarding.step_5_description_2') }}
                </a>
              </p>
              <button
                :disabled="!IS_STEP_VALID"
                :class="[
                  'px-10 py-3 rounded-md font-medium focus:outline-none flex-shrink-0',
                  IS_STEP_VALID
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-100 text-blue-600',
                ]"
                @click="submitForm"
              >
                {{ $t('v1.view.onboarding.create_account') }}
              </button>
            </template>

            <!-- chỉ hiện nút next ở step có input -->
            <template v-else>
              <button
                v-if="HAS_INPUT_STEP"
                :disabled="!IS_STEP_VALID"
                :class="[
                  'px-10 py-3 rounded-md font-medium focus:outline-none',
                  IS_STEP_VALID
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-100 text-blue-600',
                ]"
                @click="nextStep"
              >
                {{ $t('v1.view.onboarding.next') }}
              </button>
            </template>
          </div>
        </div>
      </main>
    </div>
    <!-- <OnboardingForm
      v-if="flow_step === 1"
      v-model:industry="SELECTED_INDUSTRY"
      v-model:role="SELECTED_ROLE"
      v-model:companyName="COMPANY_DETAILS.name"
      v-model:preferences="SELECTED_PREFERENCES"
      v-model:COMPANY_DETAILS="COMPANY_DETAILS"
      :current-step="current_step"
      :total-steps="total_steps"
      :is-step-valid="IS_STEP_VALID"
      @next-step="nextStep"
      @prev-step="prevStep"
      @submit="submitForm"
    /> -->
    <!-- flow 2: loading tạo tài khoản -->
    <OnboardingLoading
      v-else-if="flow_step === 2"
      @complete="completeLoading"
    />

    <!-- flow 3: verify account -->
    <OnboardingVerify
      v-else-if="flow_step === 3"
      v-model:phone="phone"
      :current_step="current_step"
      :total_steps="total_steps"
      :STEP_TITLE="$t('v1.view.onboarding.verify_account')"
      :STEP_DESCRIPTIONS="$t('v1.view.onboarding.verify_account_description')"
      @resend="resendVerification"
      @back="backToLogin"
      @verify="verifyPhone"
    />

    <UpgradeModalV2
      v-else-if="flow_step === 4"
      @submit="submitPackage"
      :selected_preference="SELECTED_PREFERENCES"
    />
    <!-- flow 3: verify account -->
    <OnboardingQuickStarter
      v-else-if="flow_step === 5"
      v-model:phone="phone"
      :current_step="current_step_quick_start"
      :total_steps="2"
      @resend="resendVerification"
      @back="onPrevQuickStart"
      @next="onNextQuickStart"
      @skip_for_now="skipForNow"
    />
    <OnboardingCreatingAccount
      v-else-if="flow_step === 6"
      @complete="completeCreatingAccount"
    />

    <OnboardingVerifyEmail
      v-else-if="flow_step === 7"
      :email="email"
      @verify="verifyEmail"
      @resend="resendEmailVerification"
      @back="backToOnboarding"
    />

    <Modal ref="relogin_modal_ref">
      <template #header>
        {{ $t('Cập nhật quyền truy cập') }}
      </template>
      <template #body>
        <div class="p-5 flex flex-col items-center gap-4 bg-white rounded-b-md">
          <p>
            {{
              $t(
                'Phiên đăng nhập Facebook đã hết hạn. Vui lòng kết nối lại để tiếp tục.'
              )
            }}
          </p>
          <Facebook @access_token="onReLoginSuccess" />
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { useCommonStore } from '@/stores'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { container } from 'tsyringe'
import {
  RegistrationDataService,
  type IRegistrationDataService,
} from '@/utils/helper/RegistrationData'
import {
  N4SerivcePublicOauthBasic,
  N4SerivcePublicOauthFacebok,
} from '@/utils/api/N4Service/Oauth'
import { Toast } from '@/utils/helper/Alert/Toast'
import type { IAlert } from '@/utils/helper/Alert/type'
import { setItem, getItem } from '@/service/helper/localStorage'
import { BillingAppOrganization } from '@/utils/api/Billing'
import { N4SerivceAppUser } from '@/utils/api/N4Service/User'
import { purchase_package, read_wallet } from '@/service/api/chatbox/billing'
import { useOrgStore } from '@/stores'

import Modal from '@/components/Modal.vue'
import Facebook from '@/components/OAuth/Facebook.vue'
import OnboardingLoading from './OnboardingLoading.vue'
import OnboardingVerify from './OnboardingVerify.vue'
import OnboardingVerifyEmail from './OnboardingVerifyEmail.vue'
import UpgradeModalV2 from '@/views/OAuth/Onboarding/UpgradeModalV2.vue'
import OnboardingCreatingAccount from './OnboardingCreatingAccount.vue'
import OnboardingQuickStarter from './OnboardingQuickStarter.vue'

/** Hàm dịch ngôn ngữ */
const { t: $t } = useI18n()
/** Common store */
const commonStore = useCommonStore()
const orgStore = useOrgStore()
/** Service quản lý dữ liệu đăng ký */
const REGISTRATION_SERVICE: IRegistrationDataService = container.resolve(
  RegistrationDataService
)
/** Service thông báo */
const SERVICE_TOAST: IAlert = container.resolve(Toast)

/** API OAuth Basic */
const API_OAUTH_BASIC = new N4SerivcePublicOauthBasic()
/** API OAuth Facebook */
const API_OAUTH_FB = new N4SerivcePublicOauthFacebok()

/** 1: 5 bước cơ bản, 2: loading, 3: verify phone, 4: upgrade, 5: quick start, 6: creating, 7: verify email */
const flow_step = ref<1 | 2 | 3 | 4 | 5 | 6 | 7>(1)

/** email để verify */
const email = ref('')
/** Số điện thoại */
const phone = ref('')

/** Khởi tạo: Load dữ liệu registration */
onMounted(() => {
  /** Lấy dữ liệu đăng ký */
  const REGISTRATION_DATA = REGISTRATION_SERVICE.getRegistrationData()

  /** Nếu không có dữ liệu thì redirect về trang đăng ký */
  if (!REGISTRATION_DATA) {
    SERVICE_TOAST.error($t('Không tìm thấy dữ liệu đăng ký'))
    /** Redirect về trang đăng ký */
    window.location.href = '/oauth/register-new'
    return
  }

  /** Lấy email từ registration data */
  if (REGISTRATION_DATA.email) {
    email.value = REGISTRATION_DATA.email
  }

  /** Log thông tin để debug */
  console.log('Dữ liệu đăng ký:', REGISTRATION_DATA)
})

/** Hàm verify phone */
const verifyPhone = () => {
  console.log('verify phone')
  flow_step.value = 4
}
/** Hàm next trong quick start */
const onNextQuickStart = () => {
  /** NẾu đang ở step 1, thì chuyền step */
  if (current_step_quick_start.value < 1) {
    current_step_quick_start.value++
    return
  }
  /** Nếu step 2 -> chuyển sang màn onboarding */
  if (current_step_quick_start.value === 1) {
    /** Chuyển sang step cuối */
    flow_step.value = 6
  }
}
/** Hàm back trong quick start */
const onPrevQuickStart = () => {
  if (current_step_quick_start.value > 0) current_step_quick_start.value--
}
/** Hàm skip bước quick start*/
const skipForNow = () => {
  /** NẾu đang ở step 1, thì chuyền step */
  if (current_step_quick_start.value < 1) {
    current_step_quick_start.value++
    return
  }
  /** Nếu step 2 -> chuyển sang màn onboarding */
  if (current_step_quick_start.value === 1) {
    /** Chuyển sang step cuối */
    flow_step.value = 6
  }
}

/** Hàm submit package (Chọn gói cho tổ chức) */
const submitPackage = async () => {
  console.log('submitPackage')

  try {
    /** Gọi API lấy danh sách tổ chức */
    const BILLING_ORG = new BillingAppOrganization()
    const ORGS = await BILLING_ORG.readOrg()

    /** Lấy user_id từ local */
    const USER_ID = getItem('user_id')

    /** Tìm tổ chức của user */
    const FOUND_ORG = ORGS.find((org: any) => org.org_owner_id === USER_ID)

    /** Nếu tìm thấy, lưu selected_org */
    if (FOUND_ORG) {
      setItem('selected_org_id', (FOUND_ORG as any).org_id)
    }
  } catch (error) {
    console.error('Lỗi khi lấy thông tin tổ chức', error)
  }

  /** Chuyển sang step 5 quick step */
  flow_step.value = 5
}

/** verify actions */
const resendVerification = () => {
  console.log('Gửi lại email verify')
}
/** Hàm trợ lại trang login */
const backToLogin = () => {
  console.log('Quay lại trang login')
}
/** Hàm hoàn thành loading */
const completeLoading = () => {
  /** Lấy dữ liệu đăng ký */
  const REGISTRATION_DATA = REGISTRATION_SERVICE.getRegistrationData()

  /** Nếu đăng ký bằng email thì chuyển sang màn verify email */
  if (REGISTRATION_DATA?.registration_type === 'email') {
    flow_step.value = 7
  } else {
    /** Ngược lại chuyển sang màn verify phone (Facebook) */
    flow_step.value = 3
  }
}
/** Hàm hoàn thành loading */
const completeCreatingAccount = async () => {
  /** Chạy các hàm bổ sung */
  await runAdditionalSetup()

  /** Xóa dữ liệu đăng ký */
  REGISTRATION_SERVICE.clearRegistrationData()
  /** Chuyển sang màn dashboard hoặc trang chủ */
  window.location.href = '/'
}

/** Hàm xác thực email */
const verifyEmail = async (otp: string) => {
  try {
    /** Gọi API xác thực email */
    await API_OAUTH_BASIC.verifyEmail(email.value, otp)

    /** Tự động đăng nhập sau khi verify */
    const REGISTRATION_DATA = REGISTRATION_SERVICE.getRegistrationData()
    /** Nếu đăng ký bằng email và có mật khẩu */
    if (REGISTRATION_DATA?.password) {
      /** Gọi API đăng nhập */
      const LOGIN_RES = await API_OAUTH_BASIC.login(
        email.value,
        REGISTRATION_DATA.password
      )
      /** Nếu đăng nhập thành công */
      if (LOGIN_RES.access_token)
        setItem('access_token', LOGIN_RES.access_token)
      if (LOGIN_RES.user_id) setItem('user_id', LOGIN_RES.user_id)
    }
    /** Thông báo xác thực thành công */
    SERVICE_TOAST.success($t('Xác thực email thành công'))

    /** Xác thực thành công, chuyển sang màn verify phone */
    flow_step.value = 3
  } catch (error: any) {
    console.error('Lỗi khi xác thực email:', error)
    /** Thông báo lỗi */
    SERVICE_TOAST.error(error.message || $t('Mã xác thực không đúng'))
  }
}

/** Hàm gửi lại mã xác thực email */
const resendEmailVerification = async () => {
  try {
    /** Gọi API gửi lại mã */
    await API_OAUTH_BASIC.resendVerifyEmail(email.value)
    SERVICE_TOAST.success($t('Đã gửi lại mã xác thực'))
  } catch (error: any) {
    console.error('Lỗi khi gửi lại mã:', error)
    SERVICE_TOAST.error(error.message || $t('Không thể gửi lại mã'))
  }
}

/** Hàm quay lại onboarding */
const backToOnboarding = () => {
  /** Quay lại flow_step 1 */
  flow_step.value = 1
}
/**Bước hiện tại */
const current_step = ref(0)
/** Tổng số bước */
const total_steps = 5

/** step hiện tại mà bắt đầu nhanh */
const current_step_quick_start = ref(0)

/** ref tới input */
const company_name_input_ref = ref<HTMLInputElement | null>(null)

/** company website ref */
const company_website_input_ref = ref<HTMLInputElement | null>(null)

/** callback khi transition hoàn tất */
const focusCompanyInput = () => {
  /** Nếu có giá trị ref */
  if (company_name_input_ref.value) {
    /** Mới focus */
    company_name_input_ref.value.focus()
    console.log('Focused input', company_name_input_ref.value)
  }
  /** Nếu có giá trị ref chọn website công ty */
  if (company_website_input_ref.value) {
    /** tự độgn focus */
    company_website_input_ref.value.focus()
  }
}

/** regex cơ bản validate domain hoặc url */
const WEBSITE_REGEX = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/

/** computed check hợp lệ */
// const IS_WEBSITE_VALID = computed(() => {
//   /** rỗng thì false */
//   if (!COMPANY_DETAILS.value.website) return false
//   return WEBSITE_REGEX.test(COMPANY_DETAILS.value.website)
// })

// Computed kiểm tra website hợp lệ
const IS_WEBSITE_VALID = computed(() => {
  /** Kiểm tra giá trị website */
  const WEBSITE = COMPANY_DETAILS.value.website.trim()
  /** không nhập thì coi như valid */
  if (!WEBSITE) return true
  /** Trả về website đã check regex */
  return WEBSITE_REGEX.test(WEBSITE)
})

/** Tổng số bước  */
const total_steps_verify = 3

/** Lựa chọn ngành nghề */
const SELECTED_INDUSTRY = ref<string | null>(null)
/** Role đang được chọn */
const SELECTED_ROLE = ref<string | null>(null)
/** Hàm quy mô đang được chọn */
const SELECTED_PREFERENCES = ref<string | null>(null)

/** computed step có input */
const HAS_INPUT_STEP = computed(() => {
  return current_step.value === 2 || current_step.value === 4
})

/** validation step hiện tại */
const IS_STEP_VALID = computed(() => {
  /** Step 3: check tên công ty */
  if (current_step.value === 2) {
    /** Trả về tên đã trim */
    return COMPANY_DETAILS.value.name.trim() !== ''
  }

  /** Step 4: website phải đúng định dạng nếu có */
  if (current_step.value === 4) {
    /** lấy các giá trị từ platform */
    const { website, facebook, instagram, tiktok, zalo } = COMPANY_DETAILS.value
    /** Cần ghép đủ thông tin bảo gom domain của từng nền tảng */
    /** website hợp lệ và có nhập */
    const WEBSITE_VALID_AND_FILLED =
      website.trim() !== '' && IS_WEBSITE_VALID.value

    /**  hoặc website trống nhưng có ít nhất 1 field khác*/
    const OTHER_FILLED =
      facebook.trim() !== '' ||
      instagram.trim() !== '' ||
      tiktok.trim() !== '' ||
      zalo.trim() !== ''
    /** Trả về các điều kiện check valid */
    return WEBSITE_VALID_AND_FILLED || OTHER_FILLED
  }

  return true
})

/** methods chuyển step Flow1 */
const nextStep = () => {
  /** Tăng giá trị step */
  if (current_step.value < total_steps - 1) current_step.value++
}
/** Methods Lùi step Flow1 */
const prevStep = () => {
  /** Giảm giá trị step */
  if (current_step.value > 0) current_step.value--
}

/** auto next khi click chọn option */
const handleIndustry = (option: string) => {
  /** Lưu giá trị ngành */
  SELECTED_INDUSTRY.value = option
  nextStep()
}
/** Auto next khi click chọn Role */
const handleRole = (option: string) => {
  /** Chọn role của admin */
  SELECTED_ROLE.value = option
  nextStep()
}
/** Auto next khi click chọn Quy mô công ty */
const handlePreference = (option: string) => {
  /** Chọn quy mô công ty */
  SELECTED_PREFERENCES.value = option
  nextStep()
}

/** Hàm submit form tạo tài khoản */
const submitForm = async () => {
  /** Nếu k valid thì return luôn */
  if (!IS_STEP_VALID) return

  try {
    /** Lưu dữ liệu onboarding vào storage */
    REGISTRATION_SERVICE.updateOnboardingData({
      industry: SELECTED_INDUSTRY.value ?? undefined,
      role: SELECTED_ROLE.value ?? undefined,
      company_name: COMPANY_DETAILS.value.name,
      preferences: SELECTED_PREFERENCES.value ?? undefined,
      company_details: {
        website: COMPANY_DETAILS.value.website,
        facebook: COMPANY_DETAILS.value.facebook,
        instagram: COMPANY_DETAILS.value.instagram,
        tiktok: COMPANY_DETAILS.value.tiktok,
        zalo: COMPANY_DETAILS.value.zalo,
      },
    })

    /** Lấy dữ liệu đăng ký đã lưu */
    const REGISTRATION_DATA = REGISTRATION_SERVICE.getRegistrationData()

    /** Kiểm tra có dữ liệu không */
    if (!REGISTRATION_DATA) {
      console.error('Không có dữ liệu đăng ký')
      return
    }

    /** Xử lý theo loại đăng ký */
    if (REGISTRATION_DATA.registration_type === 'email') {
      /** Đăng ký với email */
      await API_OAUTH_BASIC.register(
        REGISTRATION_DATA.email!,
        REGISTRATION_DATA.password!,
        `${REGISTRATION_DATA.first_name} ${REGISTRATION_DATA.last_name}`,
        REGISTRATION_DATA.first_name!,
        REGISTRATION_DATA.last_name!
      )

      /** Chuyển sang màn loading trước */
      flow_step.value = 2
    } else if (REGISTRATION_DATA.registration_type === 'facebook') {
      /** Đăng ký với Facebook */
      /** Lấy token từ local hoặc từ dữ liệu đăng ký */
      const TOKEN =
        facebook_access_token.value || REGISTRATION_DATA.access_token!
      /** Gọi API đăng nhập */
      const LOGIN_RES = await API_OAUTH_FB.login(TOKEN)

      /** Lưu lại access token */
      if (LOGIN_RES.access_token) {
        setItem('access_token', LOGIN_RES.access_token)
      }
      /** Lưu lại user id */
      if (LOGIN_RES.user_id) {
        setItem('user_id', LOGIN_RES.user_id)
      }

      /** Cập nhật thông tin onboarding qua API */
      // await API_OAUTH_BASIC.updateOnboardingInfo({
      //   industry: REGISTRATION_DATA.industry,
      //   role: REGISTRATION_DATA.role,
      //   company_name: REGISTRATION_DATA.company_name,
      //   preferences: REGISTRATION_DATA.preferences,
      //   website: REGISTRATION_DATA.company_details?.website,
      //   facebook: REGISTRATION_DATA.company_details?.facebook,
      //   instagram: REGISTRATION_DATA.company_details?.instagram,
      //   tiktok: REGISTRATION_DATA.company_details?.tiktok,
      //   zalo: REGISTRATION_DATA.company_details?.zalo,
      // })

      /** Chuyển sang màn xác thực SĐT */
      flow_step.value = 3
    }
  } catch (error: any) {
    console.error('Lỗi khi tạo tài khoản:', error)

    /** Check nếu đăng ký với Facebook -> show modal */
    const REGISTRATION_DATA = REGISTRATION_SERVICE.getRegistrationData()
    /** Nếu đăng ký với Facebook */
    if (REGISTRATION_DATA?.registration_type === 'facebook') {
      /** Show modal */
      relogin_modal_ref.value?.toggleModal()
      return
    }
    /** Nếu đăng ký với email */
    SERVICE_TOAST.error(error.message || $t('Có lỗi xảy ra khi tạo tài khoản'))
  }
}

/** --------------- RE-LOGIN FACEBOOK ---------------- */
const relogin_modal_ref = ref<InstanceType<typeof Modal>>()
/** Token từ Facebook */
const facebook_access_token = ref('')

/** Hàm khi re-login thành công */
async function onReLoginSuccess(token: string) {
  /** Lưu token */
  facebook_access_token.value = token
  /** Close modal */
  relogin_modal_ref.value?.toggleModal()
  /** Submit form */
  await submitForm()
}

/** Hàm chạy các setup bổ sung */
const runAdditionalSetup = async () => {
  console.log('Running additional setup functions...')
  try {
    /** Lấy thông tin cần thiết */
    const USER_ID = getItem('user_id')
    const ORG_ID = getItem('selected_org_id')
    const ORG_PHONE = phone.value

    /** Lấy dữ liệu onboarding từ service */
    const REGISTRATION_DATA = REGISTRATION_SERVICE.getRegistrationData()

    /** Helper format link */
    const formatLink = (prefix: string, value?: string) => {
      if (!value || value.trim() === '') return undefined
      /** Nếu đã có http thì giữ nguyên */
      if (value.startsWith('http')) return value
      /** Nối prefix */
      return `https://${prefix}${value}`
    }

    /** Gọi API cập nhật thông tin user */
    if (USER_ID && ORG_ID && REGISTRATION_DATA) {
      /** Tạo service */
      const SERVICE_USER = new N4SerivceAppUser()
      // Cập nhật thông tin user
      await SERVICE_USER.updateChatbotUserInfo({
        custom_id: USER_ID,
        org_id: ORG_ID,
        org_phone: ORG_PHONE,
        /** Map các trường onboarding */
        industry: REGISTRATION_DATA.industry,
        role: REGISTRATION_DATA.role,
        company_name: REGISTRATION_DATA.company_name,
        preferences: REGISTRATION_DATA.preferences,
        /** Map company details */
        website: formatLink('', REGISTRATION_DATA.company_details?.website), // Input UI đã có www. nhưng value chỉ là phần nhập
        facebook_link: formatLink(
          'facebook.com/',
          REGISTRATION_DATA.company_details?.facebook
        ),
        instagram_link: formatLink(
          'instagram.com/',
          REGISTRATION_DATA.company_details?.instagram
        ),
        tiktok_link: formatLink(
          'tiktok.com/',
          REGISTRATION_DATA.company_details?.tiktok
        ),
        zalo_link: formatLink(
          'zalo.me/',
          REGISTRATION_DATA.company_details?.zalo
        ),
      })
      console.log('Cập nhật thông tin chatbot user thành công')

      /** Kích hoạt gói dùng thử nếu có */
      if (
        REGISTRATION_DATA.package_selected &&
        REGISTRATION_DATA.package_selected !== 'Enterprise'
      ) {
        try {
          console.log(
            'Đang kích hoạt gói dùng thử:',
            REGISTRATION_DATA.package_selected
          )
          /* Lấy thông tin ví */
          const WALLET = await read_wallet(ORG_ID)
          // Kiểm tra ví
          if (WALLET?.wallet_id) {
            /** Gọi API đăng ký gói */
            await purchase_package(
              ORG_ID,
              WALLET.wallet_id,
              REGISTRATION_DATA.package_selected as any,
              1
            )
            console.log('Kích hoạt gói thành công')
          } else {
            console.warn('Không tìm thấy ví để kích hoạt gói')
          }
        } catch (error) {
          console.error('Lỗi khi kích hoạt gói:', error)
          /** Không throw lỗi để flow tiếp tục */
        }
        // Kích hoạt gói dùng thử thành công
      } else if (REGISTRATION_DATA.package_selected === 'Enterprise') {
        console.log(
          'Gói Enterprise đã được lưu, nhân viên tư vấn sẽ liên hệ sau.'
        )
      }
    }
  } catch (error) {
    console.error('Lỗi khi chạy setup bổ sung:', error)
  }
}

/** Step 1 */
const OPTION_INDUSTRY = [
  $t('v1.view.onboarding.industry_1'),
  $t('v1.view.onboarding.industry_2'),
  $t('v1.view.onboarding.industry_3'),
  $t('v1.view.onboarding.industry_4'),
  $t('v1.view.onboarding.industry_5'),
  $t('v1.view.onboarding.industry_6'),
  $t('v1.view.onboarding.industry_7'),
  $t('v1.view.onboarding.industry_8'),
  $t('v1.view.onboarding.industry_9'),
]
/** Step 2 */
const OPTION_ROLE = [
  $t('v1.view.onboarding.role_1'),
  $t('v1.view.onboarding.role_2'),
  $t('v1.view.onboarding.role_3'),
  $t('v1.view.onboarding.role_4'),
  $t('v1.view.onboarding.role_5'),
  $t('v1.view.onboarding.role_6'),
  $t('v1.view.onboarding.role_7'),
  $t('v1.view.onboarding.role_8'),
]

/** Step 4 */
const OPTION_PREFERENCES = [
  $t('v1.view.onboarding.preference_1'),
  $t('v1.view.onboarding.preference_2'),
  $t('v1.view.onboarding.preference_3'),
  $t('v1.view.onboarding.preference_4'),
  $t('v1.view.onboarding.preference_5'),
  $t('v1.view.onboarding.preference_6'),
  $t('v1.view.onboarding.preference_7'),
  $t('v1.view.onboarding.preference_8'),
]

/** Step 5 */
const COMPANY_DETAILS = ref({
  name: '',
  website: '',
  facebook: '',
  instagram: '',
  tiktok: '',
  zalo: '',
})

/** Title + description theo step */
const STEP_TITLE = computed(() => {
  return [
    $t('v1.view.onboarding.step_industry'),
    $t('v1.view.onboarding.step_role'),
    $t('v1.view.onboarding.company_question'),
    $t('v1.view.onboarding.company_preferences'),
    $t('v1.view.onboarding.company_summary'),
  ][current_step.value]
})
/** description các màn */
const STEP_DESCRIPTIONS = computed(() => {
  return [
    $t('v1.view.onboarding.step_industry_description'),
    $t('v1.view.onboarding.step_role_description'),
    $t('v1.view.onboarding.company_question_description'),
    $t('v1.view.onboarding.company_preferences_description'),
    $t('v1.view.onboarding.company_summary_description'),
  ][current_step.value]
})
</script>

<style scoped>
html,
body,
/** Các khai báo css chung */
#app {
  height: 100%;
}
button:focus {
  outline: none;
  /* box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15); */
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.4s ease; /* tốc độ */
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(20px);
}
.fade-slide-enter-to {
  opacity: 1;
  transform: translateX(0);
}

.fade-slide-leave-from {
  opacity: 1;
  transform: translateX(0);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>
