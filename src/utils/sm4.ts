// src/utils/sm4.ts
import CryptoJS from 'crypto-js'
export interface SM4 {
  sm4Encrypt(plaintext: number[], key: number[]): number[]
  sm4Decrypt(ciphertext: number[], key: number[]): number[]
  textToBytes(text: string): number[]
  bytesToText(bytes: number[]): string
  sm4EncryptLongText(plaintext: string, key: number[]): number[]
  sm4DecryptLongText(ciphertext: number[], key: number[]): string
  genSM4key(input?: string): number[]
}
/**
 * S盒
 * @see https://en.wikipedia.org/wiki/S-box
 * @type {number[]}
 */
const SboxTable: number[] = [
  0xd6, 0x90, 0xe9, 0xfe, 0xcc, 0xe1, 0x3d, 0xb7, 0x16, 0xb6, 0x14, 0xc2, 0x28, 0xfb, 0x2c, 0x05,
  0x2b, 0x67, 0x9a, 0x76, 0x2a, 0xbe, 0x04, 0xc3, 0xaa, 0x44, 0x13, 0x26, 0x49, 0x86, 0x06, 0x99,
  0x9c, 0x42, 0x50, 0xf4, 0x91, 0xef, 0x98, 0x7a, 0x33, 0x54, 0x0b, 0x43, 0xed, 0xcf, 0xac, 0x62,
  0xe4, 0xb3, 0x1c, 0xa9, 0xc9, 0x08, 0xe8, 0x95, 0x80, 0xdf, 0x94, 0xfa, 0x75, 0x8f, 0x3f, 0xa6,
  0x47, 0x07, 0xa7, 0xfc, 0xf3, 0x73, 0x17, 0xba, 0x83, 0x59, 0x3c, 0x19, 0xe6, 0x85, 0x4f, 0xa8,
  0x68, 0x6b, 0x81, 0xb2, 0x71, 0x64, 0xda, 0x8b, 0xf8, 0xeb, 0x0f, 0x4b, 0x70, 0x56, 0x9d, 0x35,
  0x1e, 0x24, 0x0e, 0x5e, 0x63, 0x58, 0xd1, 0xa2, 0x25, 0x22, 0x7c, 0x3b, 0x01, 0x21, 0x78, 0x87,
  0xd4, 0x00, 0x46, 0x57, 0x9f, 0xd3, 0x27, 0x52, 0x4c, 0x36, 0x02, 0xe7, 0xa0, 0xc4, 0xc8, 0x9e,
  0xea, 0xbf, 0x8a, 0xd2, 0x40, 0xc7, 0x38, 0xb5, 0xa3, 0xf7, 0xf2, 0xce, 0xf9, 0x61, 0x15, 0xa1,
  0xe0, 0xae, 0x5d, 0xa4, 0x9b, 0x34, 0x1a, 0x55, 0xad, 0x93, 0x32, 0x30, 0xf5, 0x8c, 0xb1, 0xe3,
  0x1d, 0xf6, 0xe2, 0x2e, 0x82, 0x66, 0xca, 0x60, 0xc0, 0x29, 0x23, 0xab, 0x0d, 0x53, 0x4e, 0x6f,
  0xd5, 0xdb, 0x37, 0x45, 0xde, 0xfd, 0x8e, 0x2f, 0x03, 0xff, 0x6a, 0x72, 0x6d, 0x6c, 0x5b, 0x51,
  0x8d, 0x1b, 0xaf, 0x92, 0xbb, 0xdd, 0xbc, 0x7f, 0x11, 0xd9, 0x5c, 0x41, 0x1f, 0x10, 0x5a, 0xd8,
  0x0a, 0xc1, 0x31, 0x88, 0xa5, 0xcd, 0x7b, 0xbd, 0x2d, 0x74, 0xd0, 0x12, 0xb8, 0xe5, 0xb4, 0xb0,
  0x89, 0x69, 0x97, 0x4a, 0x0c, 0x96, 0x77, 0x7e, 0x65, 0xb9, 0xf1, 0x09, 0xc5, 0x6e, 0xc6, 0x84,
  0x18, 0xf0, 0x7d, 0xec, 0x3a, 0xdc, 0x4d, 0x20, 0x79, 0xee, 0x5f, 0x3e, 0xd7, 0xcb, 0x39, 0x48
]

/**
 * 固定参数 FK
 * @type {number[]}
 */
const FK: number[] = [0xa3b1bac6, 0x56aa3350, 0x677d9197, 0xb27022dc]

// 固定参数 CK
const CK = [
  0x00070e15, 0x1c232a31, 0x383f464d, 0x545b6269, 0x70777e85, 0x8c939aa1, 0xa8afb6bd, 0xc4cbd2d9,
  0xe0e7eef5, 0xfc030a11, 0x181f262d, 0x343b4249, 0x50575e65, 0x6c737a81, 0x888f969d, 0xa4abb2b9,
  0xc0c7ced5, 0xdce3eaf1, 0xf8ff060d, 0x141b2229, 0x30373e45, 0x4c535a61, 0x686f767d, 0x848b9299,
  0xa0a7aeb5, 0xbcc3cad1, 0xd8dfe6ed, 0xf4fb0209, 0x10171e25, 0x2c333a41, 0x484f565d, 0x646b7279
]

/**
 * 线性变换 L
 * @param {number} x
 * @returns {number}
 * @see https://en.wikipedia.org/wiki/Linear_transformation
 * @description L(x) = x ^ (x <<< 2) ^ (x <<< 10) ^ (x <<< 18) ^ (x <<< 24)
 */
function L(x: number): number {
  return x ^ rotl(x, 2) ^ rotl(x, 10) ^ rotl(x, 18) ^ rotl(x, 24)
}

/** 非线性变换 L'
 * @param {number} x
 * @returns {number}
 * @description L'(x) = x ^ (x <<< 13) ^ (x <<< 23)
 * @see https://en.wikipedia.org/wiki/Linear_transformation
 */
function LPrime(x: number): number {
  return x ^ rotl(x, 13) ^ rotl(x, 23)
}

/**
 * 左循环移位
 * @param {number} x  待移位的数
 * @param {number} n  移位位数
 * @returns  {number}  移位后的数
 */
function rotl(x: number, n: number): number {
  return ((x << n) & 0xffffffff) | (x >>> (32 - n))
}

// S盒变换
function Sbox(x: number): number {
  const a = (x >>> 24) & 0xff
  const b = (x >>> 16) & 0xff
  const c = (x >>> 8) & 0xff
  const d = x & 0xff
  return (SboxTable[a] << 24) | (SboxTable[b] << 16) | (SboxTable[c] << 8) | SboxTable[d]
}

// 密钥扩展
function keyExpansion(MK: number[]): number[] {
  console.log('MK:', MK)
  const K = []
  for (let i = 0; i < 4; i++) {
    K[i] = MK[i] ^ FK[i]
  }
  for (let i = 4; i < 36; i++) {
    K[i] = K[i - 4] ^ LPrime(Sbox(K[i - 1] ^ K[i - 2] ^ K[i - 3] ^ CK[i - 4]))
  }
  return K.slice(4, 36) // 只保留32个子密钥
}

// 加密函数
export function sm4Encrypt(plaintext: number[], key: number[]): number[] {
  const rk = keyExpansion(key)
  let X = plaintext.slice().map((x) => x >>> 0) // 复制一份明文并转换为无符号整数
  for (let i = 0; i < 32; i++) {
    const tmp = X[1] ^ X[2] ^ X[3] ^ rk[i]
    X = [X[1], X[2], X[3], (X[0] ^ L(Sbox(tmp))) >>> 0]
  }
  return [X[3], X[2], X[1], X[0]]
}

// 解密函数（加密函数的逆）
export function sm4Decrypt(ciphertext: number[], key: number[]): number[] {
  const rk = keyExpansion(key).reverse() // 密钥逆序
  let X = ciphertext.slice().map((x) => x >>> 0) // 复制一份密文并转换为无符号整数
  for (let i = 0; i < 32; i++) {
    const tmp = X[1] ^ X[2] ^ X[3] ^ rk[i]
    X = [X[1], X[2], X[3], (X[0] ^ L(Sbox(tmp))) >>> 0]
  }
  return [X[3], X[2], X[1], X[0]]
}

// 将字符串转换为字节数组（使用 TextEncoder 处理多字节字符）
export function textToBytes(text: string): number[] {
  const encoder = new TextEncoder()
  return Array.from(encoder.encode(text)) // 使用 TextEncoder 编码为 Uint8Array
}

// 将字节数组转换回字符串
export function bytesToText(bytes: number[]): string {
  const decoder = new TextDecoder()
  return decoder.decode(new Uint8Array(bytes)) // 使用 TextDecoder 解码为字符串
}

// PKCS#7 填充
function pkcs7Padding(data: number[]): number[] {
  const pad = 16 - (data.length % 16)
  return [...data, ...Array(pad).fill(pad)]
}

// 去掉填充
function pkcs7Unpadding(data: number[]): number[] {
  const pad = data[data.length - 1]
  return data.slice(0, data.length - pad)
}

// 将16字节分块转换为四个32位整数（字数组）
function blockToWordArray(block: number[]): number[] {
  const words = []
  for (let i = 0; i < block.length; i += 4) {
    words.push((block[i] << 24) | (block[i + 1] << 16) | (block[i + 2] << 8) | block[i + 3])
  }
  return words
}

// 将四个32位整数转换回字节数组
function wordArrayToBytes(words: number[]): number[] {
  const bytes = []
  for (let i = 0; i < words.length; i++) {
    bytes.push((words[i] >>> 24) & 0xff)
    bytes.push((words[i] >>> 16) & 0xff)
    bytes.push((words[i] >>> 8) & 0xff)
    bytes.push(words[i] & 0xff)
  }
  return bytes
}

export function sm4EncryptLongText(plaintext: string, key: number[]): number[] {
  let plaintextBytes = textToBytes(plaintext)
  plaintextBytes = pkcs7Padding(plaintextBytes) // 填充数据
  const ciphertext: number[] = []

  // 按 16 字节分块加密
  for (let i = 0; i < plaintextBytes.length; i += 16) {
    const block = plaintextBytes.slice(i, i + 16)
    const encryptedBlock = sm4Encrypt(blockToWordArray(block), key)
    ciphertext.push(...wordArrayToBytes(encryptedBlock))
  }

  return ciphertext
}

export function sm4DecryptLongText(ciphertext: number[], key: number[]): string {
  const plaintext: number[] = []

  // 按 16 字节分块解密
  for (let i = 0; i < ciphertext.length; i += 16) {
    const block = ciphertext.slice(i, i + 16)
    const decryptedBlock = sm4Decrypt(blockToWordArray(block), key)
    plaintext.push(...wordArrayToBytes(decryptedBlock))
  }

  const unpaddedPlaintext = pkcs7Unpadding(plaintext) // 去除填充
  return bytesToText(unpaddedPlaintext)
}

export function genSM4key(input?: string): number[] {
  if (input) {
    // 计算输入参数的 MD5 值
    const hash = CryptoJS.MD5(input)
    // 将 CryptoJS 的 WordArray 转换为 number[]
    return Array.from(CryptoJS.enc.Hex.parse(hash.toString()).words)
  } else {
    // SM4 密钥长度为 128 位，即 16 字节
    const keyLength = 16
    const key = new Uint8Array(keyLength)
    // 使用加密安全的随机数生成器填充密钥
    window.crypto.getRandomValues(key)

    // 将 Uint8Array 转换为 4 个 32 位整数
    const words = []
    for (let i = 0; i < key.length; i += 4) {
      const word = (key[i] << 24) | (key[i + 1] << 16) | (key[i + 2] << 8) | key[i + 3]
      words.push(word >>> 0) // 确保无符号整数
    }

    // 返回 4 个 32 位整数
    return words
  }
}
