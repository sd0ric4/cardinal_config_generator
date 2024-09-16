<template>
  <v-container>
    <v-form>
      <v-file-input label="File input"></v-file-input>
      <v-textarea
        label="输入"
        outlined
        rows="5"
        placeholder="请输入来加密或解密的文本"
        v-model="plaintext"
      ></v-textarea>
      <v-spacer style="height: 1rem"></v-spacer>
      <v-text-field
        label="密钥"
        outlined
        append-inner-icon="mdi-refresh"
        @click:append-inner="handleGenerateKey"
        placeholder="请输入密钥喵"
        v-model="keyString"
      ></v-text-field>
      <v-row justify="center">
        <v-col cols="auto">
          <v-btn @click="encryptText">加密</v-btn>
        </v-col>
        <v-col cols="auto">
          <v-btn @click="decryptText">解密</v-btn>
        </v-col>
      </v-row>
      <v-spacer style="height: 5rem"></v-spacer>

      <v-textarea
        label="输出"
        outlined
        rows="5"
        placeholder="输出结果"
        v-model="output"
      ></v-textarea>
      <v-spacer style="height: 10rem"></v-spacer>
    </v-form>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useSM4Store } from '@/stores/useSM4Store'

const store = useSM4Store()

const plaintext = ref('')
const output = ref('')
const generateKey = (input?: string) => {
  store.generateKey(input)
}

const handleGenerateKey = () => {
  generateKey()
}

const encryptText = () => {
  output.value = store.encryptText(plaintext.value, store.key)
}

const decryptText = () => {
  output.value = store.decryptText(plaintext.value, store.key)
}

// 将数组key转为类似md5的字符串
const keyString = computed(() => {
  return store.key.map((num) => num.toString(16).padStart(2, '0')).join('')
})
</script>
