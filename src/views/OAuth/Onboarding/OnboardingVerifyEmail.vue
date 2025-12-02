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
          <h1 class="text-5xl leading-tight font-semibold flex gap-3">
            <span class="py-2">
              <EnvelopeIcon class="h-16 w-12" />
            </span>
            {{ $t('Xác thực Email') }}
          </h1>
          <p class="text-black text-sm font-medium">
            {{ $t('Vui lòng kiểm tra email của bạn để lấy mã xác thực') }}
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
          <div>
            <h2 class="text-4xl font-bold flex gap-2.5 items-center">
              <span>
                <EnvelopeIcon class="size-8" />
              </span>
              {{ $t('Xác thực Email') }}
            </h2>
            <p class="font-medium">
              {{ $t('Nhập mã xác thực đã được gửi đến email') }}
              <strong>{{ email }}</strong>
            </p>
          </div>
        </div>

        <!-- Verification content -->
        <div class="flex flex-col gap-5">
          <!-- Email display -->
          <div class="flex flex-col gap-1 max-w-2xl text-left">
            <label class="block text-gray-700 font-medium text-sm">
              {{ $t('Email') }}
            </label>
            <div
              class="flex border rounded-md overflow-hidden items-center border-gray-200 bg-gray-50 px-3 py-2"
            >
              <span class="text-gray-700 font-medium">{{ email }}</span>
            </div>
          </div>

          <!-- OTP Input -->
          <div class="flex flex-col gap-3">
            <h4 class="text-sm font-semibold">
              {{ $t('Mã xác thực (6 chữ số)') }}
            </h4>

            <div class="flex flex-col gap-2">
              <div class="flex gap-2 items-center">
                <!-- 3 ô trái -->
                <div class="flex">
                  <input
                    v-for="(__, i) in 3"
                    :key="'left-' + i"
                    type="text"
                    maxlength="1"
                    v-model="OTP[i]"
                    @input="onInputOTP(i, $event)"
                    @keydown="onKeydownOTP(i, $event)"
                    @paste="onPasteOTP($event)"
                    class="size-12 text-center border text-lg font-semibold"
                    :ref="el => setInputRef(el as HTMLInputElement | null, i)"
                    :class="[
                      i === 0
                        ? 'rounded-l-md'
                        : i === 2
                        ? 'rounded-r-md'
                        : 'border-x-0',
                    ]"
                  />
                </div>
                <span class="text-gray-400">-</span>
                <!-- 3 ô phải -->
                <div class="flex">
                  <input
                    v-for="(__, i) in 3"
                    :key="'right-' + i"
                    type="text"
                    maxlength="1"
                    v-model="OTP[i + 3]"
                    @input="onInputOTP(i + 3, $event)"
                    @keydown="onKeydownOTP(i + 3, $event)"
                    @paste="onPasteOTP($event)"
                    class="size-12 text-center border text-lg font-semibold"
                    :ref="el => setInputRef(el as HTMLInputElement | null, i + 3)"
                    :class="[
                      i === 0
                        ? 'rounded-l-md'
                        : i === 2
                        ? 'rounded-r-md'
                        : 'border-x-0',
                    ]"
                  />
                </div>
              </div>

              <!-- Countdown / Resend -->
              <div class="flex items-center gap-2">
                <h4
                  v-if="time_remaining > 0"
                  class="text-sm text-gray-500"
                >
                  {{ $t('Mã xác thực có hiệu lực trong') }}
                  <span class="font-semibold text-blue-600"
                    >{{ time_remaining }}s</span
                  >
                </h4>
                <button
                  v-else
                  @click="handleResend"
                  class="text-sm text-blue-600 hover:text-blue-800 underline font-medium"
                >
                  {{ $t('Gửi lại mã xác thực') }}
                </button>
              </div>

              <!-- Verify status -->
              <div
                v-if="is_verifying"
                class="text-sm text-blue-600 font-medium"
              >
                {{ $t('Đang xác thực...') }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex justify-between items-center">
        <button
          @click="$emit('back')"
          class="px-6 py-3 rounded-md font-medium text-gray-700 bg-gray-200 hover:bg-gray-300"
        >
          {{ $t('Quay lại') }}
        </button>

        <button
          @click="handleVerifyManual"
          :disabled="!IS_OTP_COMPLETE || is_verifying"
          :class="[
            'px-8 py-3 rounded-md font-medium',
            IS_OTP_COMPLETE && !is_verifying
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-blue-100 text-blue-400 cursor-not-allowed',
          ]"
        >
          {{ $t('Xác thực') }}
        </button>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useCommonStore } from '@/stores'
import { EnvelopeIcon } from '@heroicons/vue/24/solid'
import { useI18n } from 'vue-i18n'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

/** Hàm dịch */
const { t: $t } = useI18n()
/** Khai báo common store */
const commonStore = useCommonStore()

/** Định nghĩa props */
const props = defineProps<{
  /** Email cần xác thực */
  email: string
}>()

/** Hàm emit */
const $emit = defineEmits<{
  /** Emit khi xác thực thành công */
  (e: 'verify', otp: string): void
  /** Emit khi gửi lại mã */
  (e: 'resend'): void
  /** Emit khi quay lại */
  (e: 'back'): void
}>()

/** Khai báo mảng refs để lưu trữ các input elements */
const inputs = ref<(HTMLInputElement | null)[]>([])

/** Khai báo OTP */
const OTP = ref<string[]>(Array(6).fill(''))

/** Trạng thái verifying */
const is_verifying = ref(false)

/** Countdown timer */
const time_remaining = ref(60)

/** Countdown interval */
let countdown_interval: number | undefined

/** Verify timeout */
let verify_timeout: number | undefined

/** Check OTP đã đủ 6 số chưa */
const IS_OTP_COMPLETE = computed(() => {
  /** Lấy OTP string */
  const OTP_STRING = OTP.value.join('')
  /** Trả về check length === 6 và không phải string rỗng */
  return OTP_STRING.length === 6 && OTP_STRING.trim() !== ''
})

/** Hàm để gán ref */
const setInputRef = (el: HTMLInputElement | null, index: number) => {
  /** Gán ref vào mảng */
  inputs.value[index] = el
}

/** Hàm xử lý input OTP */
const onInputOTP = (index: number, event: Event) => {
  /** Lấy value input */
  const INPUT = event.target as HTMLInputElement
  /** Chỉ cho phép số */
  INPUT.value = INPUT.value.replace(/\D/g, '')
  /** Cập nhật OTP */
  OTP.value[index] = INPUT.value
  /** Nếu đã nhập thì focus ô input kế tiếp */
  if (INPUT.value && index < 5) {
    inputs.value[index + 1]?.focus()
  }
}

/** Hàm xử lý keydown OTP */
const onKeydownOTP = (index: number, event: KeyboardEvent) => {
  /** Nếu ấn backspace và ô hiện tại rỗng thì focus về ô trước */
  if (event.key === 'Backspace' && !OTP.value[index] && index > 0) {
    inputs.value[index - 1]?.focus()
  }
}

/**
 * Hàm xử lý paste OTP
 * @param event - Clipboard event
 */
const onPasteOTP = (event: ClipboardEvent) => {
  /** Ngăn hành vi mặc định của paste */
  event.preventDefault()

  /** Lấy dữ liệu từ clipboard */
  const PASTE_DATA = event.clipboardData?.getData('text')

  /** Nếu không có dữ liệu thì return */
  if (!PASTE_DATA) return

  /** Chỉ lấy các chữ số từ paste data */
  const DIGITS = PASTE_DATA.replace(/\D/g, '')

  /** Nếu không có chữ số nào thì return */
  if (!DIGITS) return

  /** Lấy tối đa 6 chữ số đầu tiên */
  const OTP_DIGITS = DIGITS.slice(0, 6)

  /** Fill vào các ô OTP */
  for (let i = 0; i < OTP_DIGITS.length; i++) {
    /** Gán giá trị vào ô OTP */
    OTP.value[i] = OTP_DIGITS[i]
  }

  /** Focus vào ô cuối cùng đã fill hoặc ô cuối cùng nếu đủ 6 số */
  const LAST_FILLED_INDEX = Math.min(OTP_DIGITS.length - 1, 5)
  /** Focus vào ô tiếp theo nếu chưa đủ 6 số, hoặc ô cuối nếu đã đủ */
  const FOCUS_INDEX = OTP_DIGITS.length < 6 ? LAST_FILLED_INDEX + 1 : 5
  /** Focus vào ô */
  nextTick(() => {
    if (inputs.value[FOCUS_INDEX]) {
      inputs.value[FOCUS_INDEX].focus()
    }
  })
}

/** Hàm verify OTP tự động */
const verifyOTP = () => {
  /** Bật trạng thái verifying */
  is_verifying.value = true
  /** Giả lập delay verify */
  setTimeout(() => {
    /** Tắt trạng thái verifying */
    is_verifying.value = false
    /** Lấy OTP string */
    const OTP_STRING = OTP.value.join('')
    /** Emit event verify */
    $emit('verify', OTP_STRING)
  }, 1000)
}

/** Hàm verify thủ công khi click nút */
const handleVerifyManual = () => {
  /** Nếu OTP chưa đủ thì return */
  if (!IS_OTP_COMPLETE.value) return
  /** Gọi hàm verify */
  verifyOTP()
}

/** Hàm gửi lại mã */
const handleResend = () => {
  /** Reset OTP */
  OTP.value = Array(6).fill('')
  /** Reset countdown */
  time_remaining.value = 60
  /** Focus vào ô đầu tiên */
  nextTick(() => {
    if (inputs.value[0]) {
      inputs.value[0].focus()
    }
  })
  /** Emit event resend */
  $emit('resend')
}

/** Watch OTP thay đổi để tự động verify */
watch(
  OTP,
  newOTP => {
    /** Clear timeout cũ nếu có */
    if (verify_timeout) clearTimeout(verify_timeout)
    /** Lấy OTP string */
    const OTP_STRING = newOTP.join('')
    /** Nếu OTP đủ 6 số thì tự động verify sau 1s */
    if (OTP_STRING.length === 6 && OTP_STRING.trim() !== '') {
      verify_timeout = window.setTimeout(() => {
        verifyOTP()
      }, 1000)
    }
  },
  { deep: true }
)

/** Focus vào ô input đầu tiên khi component mounted */
onMounted(() => {
  /** Focus vào ô đầu tiên */
  nextTick(() => {
    if (inputs.value[0]) {
      inputs.value[0].focus()
    }
  })

  /** Bắt đầu countdown */
  countdown_interval = window.setInterval(() => {
    /** Nếu > 0 thì giảm */
    if (time_remaining.value > 0) {
      time_remaining.value--
    } else {
      /** Clear interval khi hết thời gian */
      clearInterval(countdown_interval)
    }
  }, 1000)
})

/** Clear interval khi component unmount */
onBeforeUnmount(() => {
  /** Clear countdown interval */
  clearInterval(countdown_interval)
  /** Clear verify timeout */
  if (verify_timeout) clearTimeout(verify_timeout)
})
</script>

<style scoped>
/** Thêm animation cho input khi focus */
input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
</style>
