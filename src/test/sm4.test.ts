// sm4.test.ts
import { describe, it, expect } from 'vitest'
import { sm4EncryptLongText, sm4DecryptLongText, genSM4key } from '@/utils/sm4'
import * as fs from 'fs'
describe('SM4 Encryption and Decryption', () => {
  const key = genSM4key()

  it('should correctly encrypt and decrypt a long text', () => {
    const originalText = '这是一个需要加密和解密的长文本，可以包含多种字符。'
    console.log('originalText:', originalText)
    console.log('key:', key)
    // 加密
    const encrypted = sm4EncryptLongText(originalText, key)
    // 解密
    const decrypted = sm4DecryptLongText(encrypted, key)

    // 验证解密后的文本是否与原始文本一致
    expect(decrypted).toBe(originalText)
  })

  it('should handle empty text', () => {
    const originalText = ''

    // 加密
    const encrypted = sm4EncryptLongText(originalText, key)

    // 解密
    const decrypted = sm4DecryptLongText(encrypted, key)

    // 验证解密后的文本是否与原始文本一致
    expect(decrypted).toBe(originalText)
  })

  it('should handle files', () => {
    const originalText = fs.readFileSync('src/assets/background.jpg').toString('utf-8')
    // 加密
    const encrypted = sm4EncryptLongText(originalText, key)

    // 解密
    const decrypted = sm4DecryptLongText(encrypted, key)

    // 验证解密后的文本是否与原始文本一致
    expect(decrypted).toBe(originalText)
  }),
    it('should handle assigned key', () => {
      const originalText = '这是一个需要加密和解密的长文本，可以包含多种字符。'
      const key = genSM4key('test')
      console.log('key:', key)
      // 加密
      const encrypted = sm4EncryptLongText(originalText, key)
      // 解密
      const decrypted = sm4DecryptLongText(encrypted, key)

      // 验证解密后的文本是否与原始文本一致
      expect(decrypted).toBe(originalText)
    })
})
