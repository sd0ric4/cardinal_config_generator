import { defineStore } from 'pinia'
import { sm4EncryptLongText, sm4DecryptLongText, genSM4key } from '@/utils/sm4'

export const useSM4Store = defineStore('sm4', {
  state: () => ({
    key: [] as number[],
    keyString: '' as string,
    ciphertext: '' as string,
    plaintext: '' as string,
    decryptedtext: '' as string,
    progress: 0 as number,
    fileContent: [] as File[]
  }),
  actions: {
    string_to_key(keyString: string): number[] {
      const key = []
      for (let i = 0; i < keyString.length; i += 2) {
        key.push(parseInt(keyString.slice(i, i + 2), 16))
      }
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
      const encryptedBytes = sm4EncryptLongText(plaintext, key || this.key, (progress) => {
        this.progress = progress * 100
      })
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
      this.decryptedtext = sm4DecryptLongText(ciphertextBytes, key || this.key, (progress) => {
        this.progress = progress * 100
      })
      return this.decryptedtext
    },
    // 将 ArrayBuffer 转换为十六进制字符串
    arrayBufferToHex(buffer: ArrayBuffer): string {
      const byteArray = new Uint8Array(buffer)
      let hexString = ''
      byteArray.forEach((byte) => {
        hexString += byte.toString(16).padStart(2, '0')
      })
      return hexString
    },
    // 将十六进制字符串转换回 Uint8Array
    hexToArrayBuffer(hex: string): Uint8Array {
      const byteArray = new Uint8Array(hex.length / 2)
      for (let i = 0; i < hex.length; i += 2) {
        byteArray[i / 2] = parseInt(hex.slice(i, i + 2), 16)
      }
      return byteArray
    },
    async encryptFile(file: File, key?: number[]): Promise<File> {
      if (this.key.length === 0) {
        throw new Error('Key is not generated')
      }
      const fileContent = await this.readFileAsArrayBuffer(file)

      // 将二进制数据转换为十六进制字符串
      const hexContent = this.arrayBufferToHex(fileContent)

      // 加密十六进制字符串
      const encryptedHex = sm4EncryptLongText(hexContent, key || this.key, (progress) => {
        this.progress = progress * 100
      })

      // 将加密后的十六进制字符串转换为 Uint8Array
      const encryptedBytes = new Uint8Array(encryptedHex)

      // 生成加密后的文件
      const encryptedBlob = new Blob([encryptedBytes], { type: file.type })
      const encryptedFile = new File([encryptedBlob], `encrypted_${file.name}`, { type: file.type })
      return encryptedFile
    },
    async decryptFile(file: File, key?: number[]): Promise<File> {
      if (this.key.length === 0) {
        throw new Error('Key is not generated')
      }
      const fileContent = await this.readFileAsArrayBuffer(file)

      // 将二进制数据转换为十六进制字符串
      const hexContent = Array.from(new Uint8Array(fileContent))

      // 解密十六进制字符串
      const decryptedHex = sm4DecryptLongText(hexContent, key || this.key, (progress) => {
        this.progress = progress * 100
      })

      // 将解密后的十六进制字符串转换回 Uint8Array
      const decryptedBytes = this.hexToArrayBuffer(decryptedHex)

      // 生成解密后的文件
      const decryptedBlob = new Blob([decryptedBytes], { type: file.type })
      const decryptedFile = new File([decryptedBlob], `decrypted_${file.name}`, { type: file.type })
      return decryptedFile
    },
    readFileAsText(file: File): Promise<string> {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsText(file)
      })
    },
    readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as ArrayBuffer)
        reader.onerror = reject
        reader.readAsArrayBuffer(file)
      })
    },
    clear() {
      this.key = []
      this.keyString = ''
      this.ciphertext = ''
      this.plaintext = ''
      this.fileContent = []
      this.decryptedtext = ''
    }
  }
})
