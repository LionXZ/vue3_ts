<template>
  <div class="app">
    <transition name="fade">
      <!-- vue3.0配置 -->
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" v-if="$route.meta.keepAlive" :key="$route.path" />
        </keep-alive>
        <component :is="Component" v-if="!$route.meta.keepAlive" :key="$route.path" />
      </router-view>
    </transition>
  </div>
</template>
<script setup lang="ts">
</script>
<style>
</style>
