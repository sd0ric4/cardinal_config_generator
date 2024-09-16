<template>
  <v-layout>
    <AppBar />

    <v-main class="main-background">
      <RouterView />
    </v-main>
  </v-layout>
</template>
<script setup>
import AppBar from './components/AppBar.vue'
import { RouterView } from 'vue-router'
</script>
<style>
.main-background {
  position: relative;
  overflow: hidden;
}

.main-background::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg');
  background-size: cover;
  filter: blur(10px);
  z-index: -1;
}
</style>
