<template>
  <v-container>
    <v-parallax
      class="rounded-xl"
      src="http://alist.dn11.ch405.top/d/home/share_files/json.png?sign=2naosqJcwH8W3PSIWArcVQ8mSz6KNHZ18nmG43UZ93E=:0"
    >
      <div class="d-flex flex-column fill-height justify-center align-center text-white">
        <h1 class="text-h4 font-weight-thin mb-4">sm4加密解密</h1>
        <h4 class="subheading">sm4加密解密工具</h4>
      </div>
    </v-parallax>
    <v-spacer style="height: 2rem"></v-spacer>
    <v-form>
      <v-card>
        <v-tabs v-model="tab" align-tabs="center" color="deep-purple-accent-4">
          <v-tab :value="1">文件输入</v-tab>
          <v-tab :value="2">文本输入</v-tab>
        </v-tabs>

        <v-tabs-window v-model="tab">
          <v-tabs-window-item :value="1">
            <v-container fluid>
              <v-row>
                <v-col cols="12">
                  <v-file-input clearable label="File input" variant="outlined" v-model="file" />
                </v-col>
              </v-row>
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
                  <v-btn
                    @click="encryptFile"
                    size="x-large"
                    variant="outlined"
                    prepend-icon="mdi-lock"
                    >加密</v-btn
                  >
                </v-col>
                <v-col cols="auto">
                  <v-btn
                    @click="decryptFile"
                    size="x-large"
                    variant="outlined"
                    prepend-icon="mdi-lock-open"
                    >解密</v-btn
                  >
                </v-col>
              </v-row>
            </v-container>
          </v-tabs-window-item>
          <v-tabs-window-item :value="2">
            <v-container fluid>
              <v-row>
                <v-col cols="12">
                  <v-textarea
                    label="输入"
                    outlined
                    rows="5"
                    placeholder="请输入来加密或解密的文本"
                    v-model="plaintext"
                  ></v-textarea>
                </v-col>
              </v-row>
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
                  <v-btn
                    @click="encryptText"
                    size="x-large"
                    variant="outlined"
                    prepend-icon="mdi-lock"
                    >加密</v-btn
                  >
                </v-col>
                <v-col cols="auto">
                  <v-btn
                    @click="decryptText"
                    size="x-large"
                    variant="outlined"
                    prepend-icon="mdi-lock-open"
                    >解密</v-btn
                  >
                </v-col>
                <v-col cols="auto">
                  <v-btn
                    @click="swapText"
                    size="x-large"
                    variant="outlined"
                    prepend-icon="mdi-swap-horizontal"
                    >交换</v-btn
                  >
                </v-col>
              </v-row>
              <v-spacer style="height: 1rem"></v-spacer>

              <v-textarea
                label="输出"
                outlined
                rows="5"
                placeholder="输出结果"
                v-model="output"
              ></v-textarea>
            </v-container>
          </v-tabs-window-item>
        </v-tabs-window>
      </v-card>

      <v-spacer style="height: 2rem"></v-spacer>
      <v-progress-linear color="primary" v-model="progress" rounded striped />

      <v-spacer style="height: 10rem"></v-spacer>
    </v-form>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useSM4Store } from '@/stores/useSM4Store'

const store = useSM4Store()
const tab = ref(null)
const plaintext = computed({
  get: () => store.plaintext,
  set: (value) => (store.plaintext = value)
})
const progress = computed({
  get: () => store.progress,
  set: (value) => (store.progress = value)
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

const swapText = () => {
  const temp = plaintext.value
  plaintext.value = output.value
  output.value = temp
}

const file = computed({
  get: () => store.fileContent,
  set: (value) => {
    ;(store.fileContent = value), (store.progress = 0)
  }
})

const downloadFile = (blob: Blob, filename: string) => {
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  link.click()
  URL.revokeObjectURL(link.href)
}

const encryptFile = async () => {
  if (!file.value) {
    alert('请先选择一个文件')
    return
  }
  try {
    const encryptedFile = await store.encryptFile(file.value[0], key.value || undefined)
    const blob = new Blob([encryptedFile], { type: encryptedFile.type })
    downloadFile(blob, encryptedFile.name)
  } catch (error) {
    console.error('加密文件时出错:', error)
  }
}

const decryptFile = async () => {
  if (!file.value) {
    alert('请先选择一个文件')
    return
  }
  try {
    const decryptedFile = await store.decryptFile(file.value[0], key.value || undefined)
    const blob = new Blob([decryptedFile], { type: decryptedFile.type })
    downloadFile(blob, decryptedFile.name)
  } catch (error) {
    console.error('解密文件时出错:', error)
  }
}
</script>
