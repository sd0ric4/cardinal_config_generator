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

    <v-app-bar-title id="code-blocks">{{ currentTitle }}</v-app-bar-title>
  </v-app-bar>
  <v-navigation-drawer
    v-model="drawer"
    :location="$vuetify.display.mobile ? 'bottom' : undefined"
    temporary
  >
    <v-list>
      <v-list-item
        v-for="item in items"
        :key="item.value"
        :to="item.link"
        @click="selectItem(item)"
      >
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<style scoped></style>

<script setup lang="ts">
import { ref, watch, type Ref } from 'vue'

interface Item {
  title: string
  value: string
  link: string
}

const items: Item[] = [
  {
    title: 'sm4',
    value: 'sm4加密解密',
    link: '/sm4'
  },
  {
    title: 'config_generator',
    value: 'config.json生成器',
    link: '/config_generator'
  }
]

const drawer: Ref<boolean> = ref(false)
const currentTitle: Ref<string> = ref(items[0].value) // 默认显示第一个项的 value

const selectItem = (item: Item) => {
  currentTitle.value = item.value
  drawer.value = false
}

watch(currentTitle, () => {
  drawer.value = false
})
</script>
