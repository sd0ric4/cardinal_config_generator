<template>
  <v-container>
    <v-parallax
      class="rounded-xl"
      src="http://alist.dn11.ch405.top:5244/d/home/share_files/json.png?sign=2naosqJcwH8W3PSIWArcVQ8mSz6KNHZ18nmG43UZ93E=:0"
    >
      <div class="d-flex flex-column fill-height justify-center align-center text-white">
        <h1 class="text-h4 font-weight-thin mb-4">sm4加密解密</h1>
        <h4 class="subheading">sm4加密解密工具</h4>
      </div>
    </v-parallax>
    <v-spacer style="height: 2rem"></v-spacer>
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
        @change="validateKey"
        :error-messages="keyError"
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

const plaintext = computed({
  get: () => store.plaintext,
  set: (value) => (store.plaintext = value)
})
const output = ref('')
const keyString = computed({
  get: () => {
    return store.keyString || ''
  },
  set: (value) => {
    if (typeof value === 'string' && value.trim() !== '') {
      store.keyString = value
      store.key = store.string_to_key(value)
    } else {
      console.error('Invalid key string')
    }
  }
})
const key = computed({
  get: () => store.key,
  set: (value) => {
    store.key = value as number[] // 确保 value 是 number[]
    store.keyString = store.key_to_string(value)
  }
})

const generateKey = (input?: string) => {
  store.generateKey(input)
}

const handleGenerateKey = () => {
  generateKey()
}

const encryptText = () => {
  output.value = store.encryptText(plaintext.value, key.value || undefined)
}

const decryptText = () => {
  output.value = store.decryptText(plaintext.value, key.value || undefined)
}

const keyError = ref('')

const validateKey = () => {
  if (!keyString.value) {
    keyError.value = 'Key string is missing.'
    return
  }

  if (!/^([0-9a-fA-F]{2})+$/.test(keyString.value)) {
    keyError.value = 'Key must be a hex string.'
    return
  }

  const hexString = keyString.value
  const bytes = new Uint8Array(hexString.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)))
  const byteLength = bytes.length

  if (byteLength % 16 !== 0) {
    keyError.value = 'Key must be 16 bytes in length when converted to bytes.'
  } else {
    keyError.value = ''
  }
}
</script>
