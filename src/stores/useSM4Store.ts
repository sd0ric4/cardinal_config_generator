import { defineStore } from 'pinia'
import { sm4EncryptLongText, sm4DecryptLongText, genSM4key } from '@/utils/sm4'

export const useSM4Store = defineStore('sm4', {
  state: () => ({
    key: [] as number[],
    ciphertext: '' as string,
    plaintext: '' as string
  }),
  actions: {
    generateKey(input?: string) {
      this.key = genSM4key(input)
    },
    encryptText(plaintext: string, key?: number[]) {
      if (this.key.length === 0) {
        throw new Error('Key is not generated')
      }
      const encryptedBytes = sm4EncryptLongText(plaintext, key || this.key)
      this.ciphertext = encryptedBytes.map((byte) => byte.toString(16).padStart(2, '0')).join('')
      return this.ciphertext
    },
    decryptText(ciphertext: string, key?: number[]) {
      if (this.key.length === 0) {
        throw new Error('Key is not generated')
      }
      const ciphertextBytes = []
      for (let i = 0; i < ciphertext.length; i += 2) {
        ciphertextBytes.push(parseInt(ciphertext.slice(i, i + 2), 16))
      }
      this.plaintext = sm4DecryptLongText(ciphertextBytes, key || this.key)
      return this.plaintext
    }
  }
})
