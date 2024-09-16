<template>
  <v-app-bar
    image="https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg"
    scroll-behavior="collapse"
    prominent
    color="primary"
  >
    <template v-slot:prepend>
      <v-app-bar-nav-icon
        icon="mdi-code-block-braces"
        variant="text"
        @click.stop="drawer = !drawer"
      ></v-app-bar-nav-icon>
    </template>

    <v-app-bar-title id="code-blocks">Sm4加密解密</v-app-bar-title>
  </v-app-bar>
  <v-navigation-drawer
    v-model="drawer"
    :location="$vuetify.display.mobile ? 'bottom' : undefined"
    temporary
  >
    <v-list :items="items"></v-list>
  </v-navigation-drawer>
</template>

<style scoped></style>

<script setup lang="ts">
import { ref, watch, type Ref } from 'vue'

interface Item {
  title: string
  value: string
}

const items: Item[] = [
  {
    title: 'sm4',
    value: 'sm4'
  }
]

const drawer: Ref<boolean> = ref(false)
const group: Ref<string | null> = ref(null)

watch(group, () => {
  drawer.value = false
})
</script>
