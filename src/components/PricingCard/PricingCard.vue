<template>
  <div
    class="flex flex-row p-5 gap-2.5 cursor-pointer relative"
    :class="[
      selected
        ? 'bg-cyan-50 border-cyan-700 border-2 shadow-md'
        : 'bg-white border-gray-300 border-2',
      (is_popular && active_tab === 0 && title === 'Pro') ||
      (is_popular && active_tab === 1 && title === 'Enterprise')
        ? 'rounded-b-2xl'
        : 'rounded-2xl',
    ]"
    @click="onSelect"
  >
    <div
      v-if="is_sale_off"
      class="absolute flex justify-center items-center top-1 text-sm font-medium right-1 z-10 gap-1 py-0.5 px-2 rounded-md bg-blue-50 text-blue-600"
    >
      <GiftIcon class="size-4" />
      <h4>{{ is_sale_off }}</h4>
    </div>
    <div class="flex flex-col gap-3 cursor-pointer transition-all duration-200">
      <div
        v-if="
          (is_popular && active_tab === 0 && title === 'Pro') ||
          (is_popular && active_tab === 1 && title === 'Enterprise')
        "
        class="absolute flex justify-center items-center text-sm font-semibold text-white -top-8 left-0 z-10 h-9 rounded-t-lg bg-cyan-700"
        style="width: calc(100% + 4px); left: -2px"
      >
        {{ $t('v1.view.onboarding.popular') }}
      </div>
      <div class="pb-2 flex flex-col min-h-[320px] min-w-0 w-full">
        <!-- Title + price -->
        <div class="flex items-center gap-2 h-172">
          <div
            class="flex size-6 rounded-full justify-center items-center flex-shrink-0"
            :class="[selected ? 'bg-green-600' : 'bg-gray-400']"
          >
            <div
              class="flex bg-white rounded-full justify-center items-center"
              :class="[selected ? 'bg-green-600' : 'bg-gray-400']"
            >
              <CheckCircleIcon
                class="size-5 text-green-600"
                :class="[!selected ? 'text-white' : '']"
              />
            </div>
          </div>
          <h2 class="text-4xl font-bold">{{ title }}</h2>
        </div>

        <div
          v-if="title !== 'Enterprise'"
          class="py-3 flex gap-3"
          :class="LOCALE === 'vn' ? 'flex-col' : 'flex-row'"
        >
          <span
            class="font-bold"
            :class="[LOCALE === 'vn' ? 'text-4xl' : 'text-6xl']"
          >
            {{ price }}
          </span>
          <div>
            <span class="text-2xl font-semibold line-through text-slate-500">
              {{ original_price }}
            </span>
            <div
              v-if="code"
              class="p-1 py-0.5 bg-green-100 rounded-md text-xs text-green-700 w-fit"
            >
              {{ $t('v1.view.onboarding.code') }}
              <span class="font-semibold">
                {{ code }}
              </span>
              {{ discount }} {{ discount_percent }}
            </div>
          </div>
        </div>
        <div
          v-else
          class="py-[3px] text-black"
        >
          <img
            src="@/assets/icons/Enterprise.svg"
            alt="Logo"
            class="size-20"
          />
        </div>
        <div
          v-if="note"
          class="text-xs text-green-600 font-bold mt-1"
        >
          {{ note }}
        </div>

        <p class="text-sm text-gray-800 font-medium">
          {{ subtitle }}
        </p>
      </div>
      <div class="flex items-center justify-center gap-2 w-full">
        <!-- CTA button -->
        <button
          @click="ctaOnClick && ctaOnClick()"
          class="px-4 py-2 text-sm uppercase font-semibold rounded-md border flex items-center justify-center gap-2 w-fit"
          :class="[
            selected
              ? 'bg-green-600 border-green-600 hover:bg-green-500 text-white'
              : 'bg-slate-100 hover:bg-slate-200 text-black',
          ]"
        >
          <EnvelopeIcon
            v-if="title === 'Enterprise'"
            class="size-5"
          />
          {{ ctaText }}
          <CheckBadgeIcon
            v-if="title === 'Free'"
            class="size-5"
          />
        </button>
      </div>

      <hr class="" />

      <p class="text-sm text-gray-800 font-medium py-5 min-h-[110px]">
        {{ description }}
      </p>
      <!-- Sections -->
      <div
        v-for="section in sections"
        :key="section.heading"
        class="flex flex-col gap-3"
      >
        <h3 class="font-bold uppercase text-sm">{{ section.heading }}</h3>
        <ul class="space-y-2">
          <li
            v-for="item in section.items"
            :key="item.text"
            class="flex items-start gap-2 text-sm"
            :class="
              item.enabled ? 'text-gray-800' : 'text-slate-500 line-through'
            "
          >
            <div
              v-if="item.enabled"
              class="flex size-5 bg-green-600 rounded-full justify-center items-center"
            >
              <div
                class="flex size-6.5 bg-white rounded-full justify-center items-center"
              >
                <CheckCircleIcon class="w-4 h-4 text-green-600 shrink-0" />
              </div>
            </div>

            <div
              v-else
              class="flex size-5 bg-gray-400 rounded-full justify-center items-center"
            >
              <div
                class="flex size-5.5 bg-white rounded-full justify-center items-center"
              >
                <CheckCircleIcon class="w-4 h-4 text-gray-400 shrink-0" />
              </div>
            </div>
            <span>{{ item.text }}</span>
          </li>
        </ul>
      </div>

      <!-- AI features -->
      <div
        v-if="aiFeatures.length"
        class="flex flex-col gap-3"
      >
        <h3 class="font-bold uppercase text-sm">AI-Powered</h3>
        <ul class="space-y-2">
          <li
            v-for="item in aiFeatures"
            :key="item.text"
            class="flex items-start gap-2 text-sm"
            :class="
              item.enabled ? 'text-gray-800' : 'text-gray-400 line-through'
            "
          >
            <div
              v-if="item.enabled"
              class="flex size-5 bg-slate-800 rounded-full justify-center items-center"
            >
              <div
                class="flex size-6.5 bg-white rounded-full justify-center items-center"
              >
                <CheckCircleIcon class="w-4 h-4 text-slate-800 shrink-0" />
              </div>
            </div>

            <div
              v-else
              class="flex size-5 bg-gray-400 rounded-full justify-center items-center"
            >
              <div
                class="flex size-6.5 bg-white rounded-full justify-center items-center"
              >
                <CheckCircleIcon class="w-4 h-4 text-gray-400 shrink-0" />
              </div>
            </div>
            <span>{{ item.text }}</span>
          </li>
        </ul>
      </div>
    </div>

    <div
      v-show="active_tab == 1 && title === 'Enterprise'"
      class="h-full w-full bg-white/60 rounded-xl p-5 space-y-6 border min-w-0"
    >
      <!-- Title -->
      <div>
        <h2 class="text-xl font-semibold">
          {{ $t('v1.view.onboarding.enterprise_form.title') }}
        </h2>
        <p class="text-sm font-medium">
          {{ $t('v1.view.onboarding.enterprise_form.subtitle') }}
        </p>
      </div>

      <!-- What you can expect -->
      <div class="flex flex-col gap-3 text-sm">
        <h3 class="font-semibold">
          {{ $t('v1.view.onboarding.enterprise_form.expect.title') }}
        </h3>
        <ul class="text-gray-700 space-y-3">
          <li class="flex items-center gap-2">
            <span><BookOpenIcon class="size-5" /></span>
            {{ $t('v1.view.onboarding.enterprise_form.expect.item_1') }}
          </li>
          <li class="flex items-center gap-2">
            <span><UserCircleIcon class="size-5" /></span>
            {{ $t('v1.view.onboarding.enterprise_form.expect.item_2') }}
          </li>
          <li class="flex items-center gap-2">
            <span><CurrencyDollarIcon class="size-5" /></span>
            {{ $t('v1.view.onboarding.enterprise_form.expect.item_3') }}
          </li>
          <li class="flex items-center gap-2">
            <span><LockClosedIcon class="size-5" /></span>
            {{ $t('v1.view.onboarding.enterprise_form.expect.item_4') }}
          </li>
        </ul>
      </div>

      <!-- Logos -->
      <div class="w-full flex flex-col justify-center items-center py-3 gap-3">
        <p
          class="text-gray-600 text-sm upppercase"
          v-html="
            $t('v1.view.onboarding.enterprise_form.trusted_by', {
              count: '10,000',
            })
          "
        ></p>
        <div class="w-full max-w-full relative overflow-hidden group py-2">
          <!-- Gradient Mask -->
          <div
            class="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10"
          ></div>
          <div
            class="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10"
          ></div>

          <!-- Marquee Container -->
          <div
            class="flex animate-marquee gap-8 grayscale opacity-60 hover:opacity-100 transition-opacity whitespace-nowrap items-center"
          >
            <!-- Set 1 -->
            <img
              src="@/assets/imgs/partner-vn/VNPAY.svg"
              class="h-7 w-auto object-contain flex-shrink-0"
            />
            <img
              src="@/assets/imgs/partner-vn/Grab.svg"
              class="h-7 w-auto object-contain flex-shrink-0"
            />
            <img
              src="@/assets/imgs/partner-vn/Viettel.svg"
              class="h-7 w-auto object-contain flex-shrink-0"
            />
            <img
              src="@/assets/imgs/partner-vn/Coca.svg"
              class="h-7 w-auto object-contain flex-shrink-0"
            />
            <img
              src="@/assets/imgs/partner-vn/Coccoc.svg"
              class="h-7 w-auto object-contain flex-shrink-0"
            />
            <img
              src="@/assets/imgs/partner-vn/PepsiCo.svg"
              class="h-7 w-auto object-contain flex-shrink-0"
            />
            <img
              src="@/assets/imgs/partner-vn/VinID.svg"
              class="h-7 w-auto object-contain flex-shrink-0"
            />
            <img
              src="@/assets/imgs/partner-vn/Meta.svg"
              class="h-7 w-auto object-contain flex-shrink-0"
            />

            <!-- Set 2 (Duplicate) -->
            <img
              src="@/assets/imgs/partner-vn/VNPAY.svg"
              class="h-7 w-auto object-contain flex-shrink-0"
            />
            <img
              src="@/assets/imgs/partner-vn/Grab.svg"
              class="h-7 w-auto object-contain flex-shrink-0"
            />
            <img
              src="@/assets/imgs/partner-vn/Viettel.svg"
              class="h-7 w-auto object-contain flex-shrink-0"
            />
            <img
              src="@/assets/imgs/partner-vn/Coca.svg"
              class="h-7 w-auto object-contain flex-shrink-0"
            />
            <img
              src="@/assets/imgs/partner-vn/Coccoc.svg"
              class="h-7 w-auto object-contain flex-shrink-0"
            />
            <img
              src="@/assets/imgs/partner-vn/PepsiCo.svg"
              class="h-7 w-auto object-contain flex-shrink-0"
            />
            <img
              src="@/assets/imgs/partner-vn/VinID.svg"
              class="h-7 w-auto object-contain flex-shrink-0"
            />
            <img
              src="@/assets/imgs/partner-vn/Meta.svg"
              class="h-7 w-auto object-contain flex-shrink-0"
            />
          </div>
        </div>
      </div>
      <hr class="" />
      <!-- Form -->
      <div class="">
        <h3 class="font-semibold text-xl">
          {{ $t('v1.view.onboarding.enterprise_form.form.title') }}
        </h3>
        <p
          class="text-gray-600 text-sm"
          v-html="
            $t('v1.view.onboarding.enterprise_form.form.desc', {
              email: `<a href='mailto:mike@botbanhang.vn' class='text-black font-semibold'>mike@botbanhang.vn</a>`,
            })
          "
        ></p>

        <form
          class="mt-4 space-y-4"
          @submit.prevent="submitForm"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium"
                >{{ $t('v1.view.onboarding.enterprise_form.form.first_name') }}
                <span class="text-red-500">*</span></label
              >
              <input
                v-model="FORM_DATA.firstName"
                type="text"
                class="p-2 border block w-full rounded-md border-gray-300 shadow-sm"
                :placeholder="
                  $t(
                    'v1.view.onboarding.enterprise_form.form.placeholder.first_name'
                  )
                "
              />
            </div>
            <div>
              <label class="block text-sm font-medium"
                >{{ $t('v1.view.onboarding.enterprise_form.form.last_name') }}
                <span class="text-red-500">*</span></label
              >
              <input
                v-model="FORM_DATA.lastName"
                type="text"
                class="p-2 border block w-full rounded-md border-gray-300 shadow-sm"
                :placeholder="
                  $t(
                    'v1.view.onboarding.enterprise_form.form.placeholder.last_name'
                  )
                "
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium"
                >{{ $t('v1.view.onboarding.enterprise_form.form.phone') }}
                <span class="text-red-500">*</span></label
              >
              <input
                v-model="FORM_DATA.phone"
                type="text"
                class="p-2 border block w-full rounded-md border-gray-300 shadow-sm"
                :placeholder="
                  $t(
                    'v1.view.onboarding.enterprise_form.form.placeholder.phone'
                  )
                "
              />
            </div>
            <div>
              <label class="block text-sm font-medium"
                >{{
                  $t('v1.view.onboarding.enterprise_form.form.company_size')
                }}
                <span class="text-red-500">*</span></label
              >
              <select
                v-model="FORM_DATA.companySize"
                class="p-2 border block w-full rounded-md border-gray-300 shadow-sm"
              >
                <option>1-10</option>
                <option>11-20</option>
                <option>20-50</option>
                <option>50+</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium"
              >{{ $t('v1.view.onboarding.enterprise_form.form.help_you') }}
              <span class="text-red-500">*</span></label
            >
            <textarea
              v-model="FORM_DATA.description"
              rows="6"
              class="p-2 border block w-full rounded-md border-gray-300 shadow-sm"
              :placeholder="
                $t('v1.view.onboarding.enterprise_form.form.placeholder.help')
              "
            ></textarea>
          </div>
          <div class="flex w-full justify-end">
            <button
              type="submit"
              class="bg-cyan-700 text-white px-6 py-2 rounded-md hover:bg-cyan-800"
            >
              {{ $t('v1.view.onboarding.enterprise_form.form.submit') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toast, toastError } from '@/service/helper/alert'
import { RegistrationDataService } from '@/utils/helper/RegistrationData'
import {
  BookOpenIcon,
  CheckBadgeIcon,
  CurrencyDollarIcon,
  EnvelopeIcon,
  GiftIcon,
  LockClosedIcon,
  UserCircleIcon,
} from '@heroicons/vue/24/outline'
import { CheckCircleIcon } from '@heroicons/vue/24/solid'
import Cookies from 'js-cookie'
import { container } from 'tsyringe'
import { ref, onMounted } from 'vue'

/** Service quản lý dữ liệu đăng ký */
const REGISTRATION_SERVICE = container.resolve(RegistrationDataService)
const emit = defineEmits<{
  (e: 'submit'): void
}>()

// --- Types ---
type SectionItem = { text: string; enabled: boolean }
type Section = { heading: string; items: SectionItem[] }
type AIFeature = { text: string; enabled: boolean }
/** Khai báo props */
const props = withDefaults(
  defineProps<{
    /** Tên gói */
    title?: string
    /** Giá gói */
    price?: string
    /** Tiêu đề phụ gói */
    subtitle?: string
    /** Mô tả gói */
    description?: string
    /** Title nút bấm */
    ctaText?: string
    /** Hàm CTA click */
    ctaOnClick?: (() => void) | undefined
    /** Trạng thái thẻ sale off */
    is_sale_off?: string
    /** Thẻ gói phổ biến */
    is_popular?: boolean
    /** Trạng thái highlight */
    highlight?: boolean
    /** Khai báo section */
    sections?: Section[]
    /** AI feature */
    aiFeatures?: AIFeature[]
    /** thao tác chọn gói */
    selected?: boolean
    /** Hàm xử lý chọn gói */
    onSelect?: (() => void) | undefined
    /** Active tab gói */
    active_tab?: number
    /** Giá gốc */
    original_price?: string
    /** Mã giảm giá */
    code?: string
    /** Tỉ lệ giảm giá */
    discount_percent?: string
    /** Mô tả giảm giá */
    discount?: string
    /** Ghi chú thêm */
    note?: string
  }>(),
  {
    title: '',
    price: '',
    subtitle: '',
    description: '',
    ctaText: 'Get started',
    ctaOnClick: undefined,
    is_popular: false,
    highlight: false,
    sections: () => [],
    aiFeatures: () => [],
    selected: false,
    onSelect: undefined,
    active_tab: undefined,
    original_price: '',
    code: '',
    discount_percent: '',
    discount: '',
    note: '',
  }
)

/** Lấy locale từ cookies */
const LOCALE = Cookies.get('locale') || 'vn'

/** Form data */
const FORM_DATA = ref({
  firstName: '',
  lastName: '',
  phone: '',
  companySize: '1-10',
  description: '',
})

/**
 * Load saved data on mount
 */
onMounted(() => {
  const SAVED_DATA = REGISTRATION_SERVICE.getRegistrationData()
  if (SAVED_DATA?.enterprise_notes) {
    try {
      const PARSED_NOTES = JSON.parse(SAVED_DATA.enterprise_notes)
      FORM_DATA.value = { ...FORM_DATA.value, ...PARSED_NOTES }
    } catch (e) {
      console.error('Failed to parse saved enterprise notes', e)
    }
  }
})

/** Submit form */
const submitForm = () => {
  if (
    !FORM_DATA.value.firstName ||
    !FORM_DATA.value.lastName ||
    !FORM_DATA.value.phone ||
    !FORM_DATA.value.description
  ) {
    toastError('Please fill in all required fields')
    return
  }

  /** Save to local storage */
  REGISTRATION_SERVICE.updateOnboardingData({
    package_info: {
      enterprise_notes: JSON.stringify(FORM_DATA.value),
      package_selected: 'Enterprise',
    },
  })

  // Emit submit event to parent
  // Assuming parent handles flow navigation
  // We need to inject the parent emit from UpgradeModalV2 but this is a component.
  // We should prob emit an event that UpgradeModalV2 listens to.
  // Actually, wait, UpgradeModalV2 listens to @submit on the component instance?
  // Checking UpgradeModalV2... it doesn't listen to anything specific from PricingCard other than what we might add.
  // UpgradeModalV2 has @submit="submitPackage" on itself from Onboarding.vue, but inside it calls submitPackage locally.
  // We need to trigger the parent's generic submit flow.

  // Let's emit a custom 'confirm-enterprise' event or similar if needed,
  // OR we just assume the button inside PricingCard triggers the flow.
  // User request: "lưu lại form này vào phải nhập thì mới cho confirm. Tiếp tục flow"

  // Let's emit a 'submit-enterprise' event.
  toast('success', 'Lưu thông tin thành công')
  // emit('submit') // Không tự động chuyển màn hình
}
</script>

<style scoped>
.absolute {
  transition: all 0.5s ease;
}

@keyframes marquee {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}
.animate-marquee {
  width: max-content;
  animation: marquee 30s linear infinite;
}
.animate-marquee:hover {
  animation-play-state: paused;
}
</style>
