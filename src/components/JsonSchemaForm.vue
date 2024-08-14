<template>
  <v-container>
    <v-parallax
      class="rounded-xl"
      src="http://nas.ch405.top:5244/d/home/share_files/json.png?sign=2naosqJcwH8W3PSIWArcVQ8mSz6KNHZ18nmG43UZ93E=:0"
    >
      <div class="d-flex flex-column fill-height justify-center align-center text-white">
        <h1 class="text-h4 font-weight-thin mb-4">config.json Generator</h1>
        <h4 class="subheading">Generate config.json for cardinal challenges</h4>
      </div>
    </v-parallax>
    <v-spacer style="height: 2rem"></v-spacer>
    <v-form @submit.prevent="validateForm">
      <!-- 配置类型 -->
      <v-select
        v-model="formData.type"
        :items="['server', 'local']"
        label="配置类型"
        :error-messages="errors.type"
        required
      ></v-select>

      <!-- 题目信息 -->
      <v-text-field
        v-model="formData.challenge.name"
        label="题目名称"
        :error-messages="errors['challenge.name']"
        required
      ></v-text-field>

      <v-autocomplete
        v-model="formData.challenge.type"
        :items="[
          'web',
          'pwn',
          'reverse',
          'crypto',
          'misc',
          'stego',
          'forensic',
          'network',
          'hardware',
          'mobile',
          'osint',
          'recon',
          'programming',
          'blockchain',
          'ai',
          'cloud',
          'iot',
          'others'
        ]"
        label="题目类型"
        :error-messages="errors['challenge.type']"
        required
      ></v-autocomplete>

      <v-textarea
        v-model="formData.challenge.description"
        label="题目简介"
        :error-messages="errors['challenge.description']"
      ></v-textarea>

      <v-autocomplete
        v-model="formData.challenge.difficulty"
        :items="['easy', 'normal', 'hard']"
        label="题目难度"
        :error-messages="errors['challenge.difficulty']"
        required
      ></v-autocomplete>

      <v-combobox
        v-model="formData.challenge.keyword"
        label="题目关键词"
        multiple
        :error-messages="errors['challenge.keyword']"
      ></v-combobox>

      <v-combobox
        v-model="formData.challenge.hint"
        label="题目提示"
        multiple
        :error-messages="errors['challenge.hint']"
      ></v-combobox>

      <v-autocomplete
        v-model="formData.challenge.flag_type"
        :items="['static', 'dynamic']"
        label="Flag 类型"
        :error-messages="errors['challenge.flag_type']"
        required
      ></v-autocomplete>

      <v-text-field
        v-model="formData.challenge.flag_count"
        label="Flag 数量"
        type="number"
        :error-messages="errors['challenge.flag_count']"
      ></v-text-field>

      <v-text-field
        v-model="formData.challenge.flag_value"
        label="静态 Flag 值"
        :error-messages="errors['challenge.flag_value']"
      ></v-text-field>

      <v-textarea
        v-model="formData.challenge.comment"
        label="备注"
        :error-messages="errors['challenge.comment']"
      ></v-textarea>

      <v-combobox
        v-model="formData.challenge.writeup"
        label="Writeup 文件"
        multiple
        :error-messages="errors['challenge.writeup']"
      ></v-combobox>

      <v-combobox
        v-model="formData.challenge.attachment"
        label="题目附件"
        multiple
        :error-messages="errors['challenge.attachment']"
      ></v-combobox>

      <v-text-field
        v-model="formData.challenge.score"
        label="题目默认分值"
        type="number"
        :error-messages="errors['challenge.score']"
      ></v-text-field>
      <!-- 如果选择了 'server' 配置类型，则显示容器相关内容 -->
      <v-container v-if="formData.type === 'server'">
        <v-row justify="center">
          <v-col cols="auto">
            <v-btn @click="addContainer">添加容器</v-btn>
          </v-col>
          <v-col cols="auto">
            <v-btn @click="deleteContainer">删除容器</v-btn>
          </v-col>
        </v-row>
      </v-container>

      <!-- 容器定义 -->
      <v-container v-if="formData.type === 'server' && countContainers() > 0">
        <v-pagination :length="countContainers()" v-model="containerIndex" />

        <!-- 仅显示当前选中的容器 -->
        <v-container
          v-for="(container, name, index) in formData.containers"
          :key="name"
          v-show="index + 1 === containerIndex"
        >
          <v-card style="background-color: transparent">
            <v-card-title>容器定义 - {{ name }}</v-card-title>
            <v-select
              v-model="container.image_type"
              :items="['remote', 'local']"
              label="容器镜像类型"
              :error-messages="errors[`containers.${name}.image_type`]"
              required
            ></v-select>

            <v-text-field
              v-if="container.image_type === 'remote'"
              v-model="container.image_name"
              label="远端镜像名称"
              :error-messages="errors[`containers.${name}.image_name`]"
            ></v-text-field>

            <v-text-field
              v-if="container.image_type === 'local'"
              v-model="container.image_path"
              label="本地镜像路径"
              :error-messages="errors[`containers.${name}.image_path`]"
            ></v-text-field>

            <v-combobox
              v-model="container.volumes"
              label="文件卷信息"
              multiple
              :error-messages="errors[`containers.${name}.volumes`]"
            ></v-combobox>

            <v-combobox
              v-model="container.port"
              label="题目靶机开放端口"
              multiple
              :error-messages="errors[`containers.${name}.port`]"
              type="number"
            ></v-combobox>

            <v-combobox
              v-model="container.link"
              label="容器连接"
              multiple
              :error-messages="errors[`containers.${name}.link`]"
            ></v-combobox>

            <v-combobox
              v-model="container.environments"
              label="容器环境变量"
              multiple
              :error-messages="errors[`containers.${name}.environments`]"
            ></v-combobox>

            <v-text-field
              v-model="container.cmd"
              label="启动时执行的命令"
              :error-messages="errors[`containers.${name}.cmd`]"
            ></v-text-field>

            <v-text-field
              v-model="container.update_cmd"
              label="更新 Flag 时执行的命令"
              :error-messages="errors[`containers.${name}.update_cmd`]"
            ></v-text-field>
          </v-card>
        </v-container>
      </v-container>
      <v-row justify="center">
        <v-col cols="auto">
          <v-btn type="submit">提交</v-btn>
        </v-col>
        <v-col cols="auto">
          <v-btn @click="exportConfig" color="primary">导出配置 JSON</v-btn>
        </v-col>
      </v-row>
    </v-form>

    <v-alert v-if="errors.global.length > 0" type="error">
      {{ errors.global.join(', ') }}
    </v-alert>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Ajv, { type ErrorObject } from 'ajv'
import { schema } from '@/schemas/configSchema'

// 定义表单数据类型
interface Challenge {
  name: string
  type: string
  description: string
  difficulty: string
  keyword: string[]
  hint: string[]
  flag_type: string
  flag_count: number
  flag_value: string
  comment: string
  writeup: string[]
  attachment: string[]
  score: number
}

interface Container {
  image_type: string
  image_name: string
  image_path: string
  volumes: string[]
  port: string[]
  link: string[]
  environments: string[]
  cmd: string
  update_cmd: string
}

interface FormData {
  type: string
  challenge: Challenge
  containers?: Record<string, Container>
}

interface Errors {
  global: string[]
  [key: string]: string | string[]
}

// 初始化 Ajv 实例
const ajv = new Ajv({ allErrors: true })
const validate = ajv.compile(schema)

// 初始化表单数据
const formData = ref<FormData>({
  type: 'server',
  challenge: {
    name: '',
    type: '',
    description: '',
    difficulty: '',
    keyword: [],
    hint: [],
    flag_type: '',
    flag_count: 1,
    flag_value: '',
    comment: '',
    writeup: [],
    attachment: [],
    score: 100
  },
  containers: {
    container1: {
      image_type: 'remote',
      image_name: '',
      image_path: '',
      volumes: [],
      port: [],
      link: [],
      environments: [],
      cmd: '',
      update_cmd: ''
    }
  }
})

// 容器索引
const containerIndex = ref<number>(1)

// 错误信息初始化
const errors = ref<Errors>({
  global: [],
  type: '',
  'challenge.name': '',
  'challenge.type': '',
  'challenge.description': '',
  'challenge.difficulty': '',
  'challenge.keyword': '',
  'challenge.hint': '',
  'challenge.flag_type': '',
  'challenge.flag_count': '',
  'challenge.flag_value': '',
  'challenge.comment': '',
  'challenge.writeup': '',
  'challenge.attachment': '',
  'challenge.score': '',
  'containers.container1.image_type': '',
  'containers.container1.image_name': '',
  'containers.container1.image_path': '',
  'containers.container1.volumes': '',
  'containers.container1.port': '',
  'containers.container1.link': '',
  'containers.container1.environments': '',
  'containers.container1.cmd': '',
  'containers.container1.update_cmd': ''
})

// 表单验证函数
const validateForm = (): boolean => {
  if (formData.value.type === 'local' && formData.value.containers) {
    console.log('删除 containers 属性')
    delete formData.value.containers
  }
  const valid = validate(formData.value)
  errors.value = { global: [] }

  if (!valid && validate.errors) {
    console.log('Validation errors:', validate.errors)
    validate.errors.forEach((error: ErrorObject) => {
      const path = error.instancePath.slice(1).replace(/\//g, '.')
      if (path) {
        console.log('Error path:', path)
        errors.value[path] = error.message || ''
      } else {
        console.log('Global error:', error.message)
        errors.value.global.push(error.message || '')
      }
    })
    return false
  } else {
    // 如果验证通过，处理表单数据
    console.log('Valid data:', formData.value)
    resetErrors()
    return true
  }
}

// 重置错误信息
const resetErrors = () => {
  errors.value = {
    global: [],
    type: '',
    'challenge.name': '',
    'challenge.type': '',
    'challenge.description': '',
    'challenge.difficulty': '',
    'challenge.keyword': '',
    'challenge.hint': '',
    'challenge.flag_type': '',
    'challenge.flag_count': '',
    'challenge.flag_value': '',
    'challenge.comment': '',
    'challenge.writeup': '',
    'challenge.attachment': '',
    'challenge.score': '',
    'containers.container1.image_type': '',
    'containers.container1.image_name': '',
    'containers.container1.image_path': '',
    'containers.container1.volumes': '',
    'containers.container1.port': '',
    'containers.container1.link': '',
    'containers.container1.environments': '',
    'containers.container1.cmd': '',
    'containers.container1.update_cmd': ''
  }
}

// 容器数量
const countContainers = (): number => {
  if (formData.value.containers) {
    return Object.keys(formData.value.containers).length
  } else {
    return 0
  }
}

// 添加容器
const addContainer = () => {
  if (!formData.value.containers) {
    formData.value.containers = {}
  }
  const containerName = `container${Object.keys(formData.value.containers).length + 1}`
  formData.value.containers[containerName] = {
    image_type: 'remote',
    image_name: '',
    image_path: '',
    volumes: [],
    port: [],
    link: [],
    environments: [],
    cmd: '',
    update_cmd: ''
  }
}

// 删除容器
const deleteContainer = () => {
  if (formData.value.containers) {
    const containerName = `container${Object.keys(formData.value.containers).length}`
    delete formData.value.containers[containerName]
  } else {
    console.log('containers 属性未定义')
  }
}

// 导出配置 JSON,先进行validateForm 验证
const exportConfig = () => {
  if (!validateForm()) {
    return
  }
  // 将 formData 转换为 JSON 字符串
  const jsonString = JSON.stringify(formData.value, null, 2)

  // 创建一个 Blob 对象，表示一个不可变、原始数据的类文件对象
  const blob = new Blob([jsonString], { type: 'application/json' })

  // 创建一个下载链接
  const url = URL.createObjectURL(blob)

  // 创建一个隐藏的<a>标签，并点击它
  const a = document.createElement('a')
  a.href = url
  a.download = 'config.json' // 下载文件的名称
  document.body.appendChild(a)
  a.click()

  // 移除链接以释放内存
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
</script>

<style scoped>
/* 添加表单和错误信息的样式 */
</style>
