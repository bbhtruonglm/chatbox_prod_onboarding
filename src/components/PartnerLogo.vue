<template>
  <div
    :style="{
      backgroundImage: `url(${commonStore.partner?.logo?.full})`,
    }"
    class="h-7 w-full bg-contain bg-no-repeat bg-left flex-shrink-0 cursor-pointer"
    @click="backToLogin"
  ></div>
</template>

<script setup lang="ts">
import { useCommonStore } from '@/stores'
import { useRouter } from 'vue-router'

const commonStore = useCommonStore()
const router = useRouter()

/** Quay lại trang login */
const backToLogin = () => {
  router.push('/oauth/login')
}
</script>
