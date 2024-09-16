import { defineStore } from 'pinia'
import { sm4EncryptLongText, sm4DecryptLongText, genSM4key } from '@/utils/sm4'

export const useSM4Store = defineStore('sm4', {
  state: () => ({
    key: [] as number[],
    keyString: '' as string,
    ciphertext: '' as string,
    plaintext: '' as string,
    decryptedtext: '' as string
  }),
  actions: {
    string_to_key(keyString: string): number[] {
      const key = []
      for (let i = 0; i < keyString.length; i += 2) {
        key.push(parseInt(keyString.slice(i, i + 2), 16))
      }
      // 将 Uint8Array 转换为 4 个 32 位整数
      const words = []
      for (let i = 0; i < key.length; i += 4) {
        const word = (key[i] << 24) | (key[i + 1] << 16) | (key[i + 2] << 8) | key[i + 3]
        words.push(word >>> 0) // 确保无符号整数
      }
      return words
    },
    key_to_string(key: number[]): string {
      return key.map((byte) => byte.toString(16).padStart(2, '0')).join('')
    },
    generateKey(input?: string): { key: number[]; keyString: string } {
      this.key = genSM4key(input)
      this.keyString = this.key_to_string(this.key)
      return { key: this.key, keyString: this.keyString }
    },
    encryptText(plaintext: string, key?: number[]) {
      if (this.key.length === 0) {
        throw new Error('Key is not generated')
      }
      try {
        console.log('当前加密文本:', plaintext)
        console.log('key:', key)
      } catch (e) {
        console.log('Error:', e)
      }
      const encryptedBytes = sm4EncryptLongText(plaintext, key || this.key)
      this.ciphertext = encryptedBytes.map((byte) => byte.toString(16).padStart(2, '0')).join('')
      return this.ciphertext
    },
    decryptText(ciphertext: string, key?: number[]) {
      if (this.key.length === 0) {
        throw new Error('Key is not generated')
      }
      // 这里将密文字符串转换为字节数组
      const ciphertextBytes = []
      for (let i = 0; i < ciphertext.length; i += 2) {
        ciphertextBytes.push(parseInt(ciphertext.slice(i, i + 2), 16))
      }
      try {
        console.log('当前解密文本:', ciphertext)
        console.log('key:', key)
      } catch (e) {
        console.log('Error:', e)
      }
      this.decryptedtext = sm4DecryptLongText(ciphertextBytes, key || this.key)
      return this.decryptedtext
    },
    clear() {
      this.key = []
      this.keyString = ''
      this.ciphertext = ''
      this.plaintext = ''
    }
  }
})
