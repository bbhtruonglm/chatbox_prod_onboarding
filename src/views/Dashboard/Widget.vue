<template>
  <div
    v-if="widgetStore.is_loading"
    class="absolute top-9 left-1/2 -translate-x-1/2 z-50"
  >
    <Loading />
  </div>

  <DashboardLayout class_content="flex flex-col gap-3 relative overflow-y-auto">
    <template #menu><Menu /></template>
    <template #menu_mobile>
      <Tabs
        :tabs="LIST_TABS"
        :currentTab="select_tab"
        @update:tab="selectTab"
      />
    </template>
    <template #content>
      <RouterView />
    </template>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { useWidgetStore } from '@/stores'
import Menu from '@/views/Dashboard/Widget/Menu.vue'
import DashboardLayout from '@/components/Main/Dashboard/DashboardLayout.vue'
import Loading from '@/components/Loading.vue'
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Tabs from './Tabs.vue'

const widgetStore = useWidgetStore()
const router = useRouter()
const { t: $t } = useI18n()

/** Danh sách tabs */
const LIST_TABS = [
  {
    title: $t('v1.view.main.dashboard.widget.tab.market'),
    path: 'market',
  },
  {
    title: $t('v1.view.main.dashboard.widget.tab.installed'),
    path: 'installed',
  },
  {
    title: $t('v1.view.main.dashboard.widget.tab.my_app'),
    path: 'my-widget',
  },
]

/** Tab đang chọn */
const select_tab = ref('market')

/** Chọn tab */
const selectTab = (value: string) => {
  select_tab.value = value
  router.push(genOrgPath(value))
}

/** Tạo path cho router */
function genOrgPath(path: string) {
  return `/dashboard/widget/${path}`
}
</script>
