import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useSM4Store } from '@/stores/useSM4Store'

// Mock utils for encryption and decryption
vi.mock('@/utils/sm4', () => ({
  genSM4key: vi.fn(() => [1, 2, 3, 4, 5, 6, 7, 8]),
  sm4EncryptLongText: vi.fn((plaintext: string, key: any, onProgress: (arg0: number) => void) => {
    onProgress(1) // Mock full progress
    return plaintext.split('').map((char: string) => char.charCodeAt(0)) // Return mock encryption (ASCII values)
  }),
  sm4DecryptLongText: vi.fn(
    (ciphertextBytes: any, key: any, onProgress: (arg0: number) => void) => {
      onProgress(1) // Mock full progress
      return String.fromCharCode(...ciphertextBytes) // Return mock decryption (ASCII values to string)
    }
  )
}))

describe('useSM4Store', () => {
  let store: ReturnType<typeof useSM4Store>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useSM4Store()
  })

  it('should generate a key', () => {
    const { key, keyString } = store.generateKey()
    expect(key).toEqual([1, 2, 3, 4, 5, 6, 7, 8])
    expect(keyString).toBe('0102030405060708')
  })

  it('should encrypt and decrypt text', () => {
    store.generateKey() // Generate a mock key first
    const plaintext = 'Hello World'
    const encryptedText = store.encryptText(plaintext)
    expect(encryptedText).toBe('48656c6c6f20576f726c64') // Check mock encrypted output

    const decryptedText = store.decryptText(encryptedText)
    expect(decryptedText).toBe(plaintext) // Check decrypted matches original plaintext
  })

  it('should throw an error if key is not generated before encrypt', () => {
    expect(() => store.encryptText('Test')).toThrow('Key is not generated')
  })

  it('should throw an error if key is not generated before decrypt', () => {
    expect(() => store.decryptText('Test')).toThrow('Key is not generated')
  })

  it('should clear the state', () => {
    store.generateKey()
    store.encryptText('Test')
    store.clear()

    expect(store.key).toEqual([])
    expect(store.keyString).toBe('')
    expect(store.ciphertext).toBe('')
    expect(store.plaintext).toBe('')
    expect(store.fileContent).toEqual([])
    expect(store.decryptedtext).toBe('')
  })

  // Test for file encryption and decryption
  it('should encrypt and decrypt a file', async () => {
    store.generateKey()
    const file = new File(['Hello File'], 'test.txt', { type: 'text/plain' })

    const encryptedFile = await store.encryptFile(file)
    expect(encryptedFile.name).toBe('encrypted_test.txt')

    const decryptedFile = await store.decryptFile(encryptedFile)
    expect(decryptedFile.name).toBe('decrypted_encrypted_test.txt')

    // 读取解密后的文件内容
    const reader = new FileReader()
    reader.onload = () => {
      expect(reader.result).toBe('Hello File')
    }
    reader.readAsText(decryptedFile)
  })
})
