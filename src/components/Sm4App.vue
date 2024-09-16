<template>
  <v-container>
    <v-parallax
      class="rounded-xl"
      src="https://alist.ch405.top/d/home/share_files/json.png?sign=2naosqJcwH8W3PSIWArcVQ8mSz6KNHZ18nmG43UZ93E=:0"
    >
      <div class="d-flex flex-column fill-height justify-center align-center text-white">
        <h1 class="text-h4 font-weight-thin mb-4">sm4 加密解密</h1>
        <h4 class="subheading">SM4 Encryption and Decryption</h4>
      </div>
    </v-parallax>
    <v-spacer style="height: 2rem"></v-spacer>
    <v-form>
      <v-textarea
        v-model="inputText"
        label="输入"
        outlined
        rows="5"
        placeholder="Input text to encrypt or decrypt"
      ></v-textarea>
      <v-spacer style="height: 1rem"></v-spacer>
      <v-text-field
        v-model="inputKey"
        label="密钥"
        outlined
        append-inner-icon="mdi-refresh"
        @click:append-inner="generateKey"
        placeholder="请输入密钥喵"
      ></v-text-field>
      <v-row justify="center">
        <v-col cols="auto">
          <v-btn @click="encryptText" color="primary">加密</v-btn>
        </v-col>
        <v-col cols="auto">
          <v-btn @click="decryptText" color="primary">解密</v-btn>
        </v-col>
      </v-row>
      <v-spacer style="height: 20rem"></v-spacer>

      <v-textarea
        v-model="output"
        label="输出"
        outlined
        rows="5"
        placeholder="输出结果"
      ></v-textarea>
      <v-spacer style="height: 10rem"></v-spacer>
    </v-form>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useSM4Store } from '@/stores/useSM4Store'

const sm4Store = useSM4Store()

const inputText = ref('')
const inputKey = ref('')
const encryptedText = ref('')
const decryptedText = ref('')
const output = ref('')

const encryptText = () => {
  try {
    encryptedText.value = sm4Store.encryptText(inputText.value, inputKey.value)
    output.value = encryptedText.value
  } catch (error) {
    const errorMessage = (error as Error).message
    console.error(errorMessage)
    alert(errorMessage)
  }
}

const decryptText = () => {
  try {
    decryptedText.value = sm4Store.decryptText(encryptedText.value, inputKey.value)
    output.value = decryptedText.value
  } catch (error) {
    const errorMessage = (error as Error).message
    console.error(errorMessage)
    alert(errorMessage)
  }
}
const generateKey = () => {
  let keyHex = ''
  keyHex = useSM4Store().generateHexKey()
  inputKey.value = keyHex
}
</script>
