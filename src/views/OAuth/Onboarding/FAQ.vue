<template>
  <section class="max-w-3xl mx-auto">
    <!-- Tiêu đề -->
    <h2
      class="text-3xl font-medium text-center pt-5 flex justify-center gap-2.5 items-center cursor-pointer"
      @click="toggleAll"
    >
      {{ $t('v1.view.onboarding.FAQ') }}
      <ChevronDownIcon
        class="size-7 transition-transform duration-200"
        :class="openAll ? 'rotate-180' : ''"
      />
    </h2>

    <div
      v-show="openAll"
      class="divide-y"
    >
      <!-- Loop FAQs -->
      <div
        v-for="(item, index) in FAQs"
        :key="index"
        class="py-4"
      >
        <button
          class="w-full flex justify-between items-center text-left"
          @click="toggle(index)"
        >
          <span class="text-lg font-medium">{{ item.question }}</span>
          <svg
            class="w-5 h-5 transition-transform duration-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              :d="openIndex === index ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'"
            />
          </svg>
        </button>
        <div
          v-show="openIndex === index"
          class="mt-2 text-gray-700"
          v-html="item.children"
        ></div>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
import { ChevronDownIcon } from '@heroicons/vue/24/solid'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const openIndex = ref<number | null>(null)
const openAll = ref(true) // mặc định hiện

const { t } = useI18n()

/**
 * faqs
 */
const FAQs = computed(() => [
  {
    question: t('what_is_page'),
    children: t('children_what_is_page'),
  },
  {
    question: t('monthly_payment'),
    children: t('children_monthly_payment'),
  },
  {
    question: t('refund_policy'),
    children: t('children_refund_policy'),
  },
  {
    question: t('expired_plan'),
    children: t('children_expired_plan'),
  },
  {
    question: t('data_storage_duration'),
    children: t('children_data_storage_duration'),
  },
  {
    question: t('data_storage_inactive'),
    children: t('children_data_storage_inactive'),
  },
  {
    question: t('delete_data'),
    children: t('children_delete_data'),
  },
  {
    question: t('self_host_data'),
    children: t('children_self_host_data'),
  },
  {
    question: t('direct_support'),
    children: t('children_direct_support'),
  },
  {
    question: t('ticket_platform'),
    children: t('children_ticket_platform'),
  },
  {
    question: t('payment_methods'),
    children: t('children_payment_methods'),
  },
])

const toggle = (index: number) => {
  // chỉ cho mở từng cái khi openAll true
  if (openAll.value) {
    openIndex.value = openIndex.value === index ? null : index
  }
}

const toggleAll = () => {
  openAll.value = !openAll.value
  if (!openAll.value) {
    openIndex.value = null // đóng tất cả
  }
}
</script>
