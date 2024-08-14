// src/schemas/configSchema.ts
export const schema: Record<string, any> = {
  type: 'object',
  properties: {
    type: {
      type: 'string',
      enum: ['server', 'local'],
      title: '配置类型',
      default: 'server'
    },
    challenge: {
      type: 'object',
      title: '题目信息',
      properties: {
        name: {
          type: 'string',
          title: '题目名称'
        },
        type: {
          type: 'string',
          enum: [
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
          ],
          title: '题目类型'
        },
        description: {
          type: 'string',
          title: '题目简介'
        },
        difficulty: {
          type: 'string',
          enum: ['easy', 'normal', 'hard'],
          title: '题目难度'
        },
        keyword: {
          type: 'array',
          items: {
            type: 'string'
          },
          title: '题目关键词'
        },
        hint: {
          type: 'array',
          items: {
            type: 'string'
          },
          title: '题目提示'
        },
        flag_type: {
          type: 'string',
          enum: ['static', 'dynamic'],
          title: 'Flag 类型'
        },
        flag_count: {
          type: 'integer',
          title: 'Flag 数量',
          default: 1
        },
        flag_value: {
          type: 'string',
          title: '静态 Flag 值'
        },
        comment: {
          type: 'string',
          title: '备注'
        },
        writeup: {
          type: 'array',
          items: {
            type: 'string'
          },
          title: 'Writeup 文件'
        },
        attachment: {
          type: 'array',
          items: {
            type: 'string'
          },
          title: '题目附件'
        },
        score: {
          type: 'number',
          title: '题目默认分值',
          default: 100
        }
      }
    },
    containers: {
      type: 'object',
      additionalProperties: {
        type: 'object',
        properties: {
          image_type: {
            type: 'string',
            enum: ['remote', 'local'],
            title: '容器镜像类型'
          },
          image_name: {
            type: 'string',
            title: '远端镜像名称'
          },
          image_path: {
            type: 'string',
            title: '本地镜像路径'
          },
          volumes: {
            type: 'array',
            items: {
              type: 'string'
            },
            title: '文件卷信息'
          },
          port: {
            type: 'array',
            items: {
              type: 'integer'
            },
            title: '题目靶机开放端口'
          },
          link: {
            type: 'array',
            items: {
              type: 'string'
            },
            title: '容器连接'
          },
          environments: {
            type: 'array',
            items: {
              type: 'string'
            },
            title: '容器环境变量'
          },
          cmd: {
            type: 'string',
            title: '启动时执行的命令'
          },
          update_cmd: {
            type: 'string',
            title: '更新 Flag 时执行的命令'
          }
        }
      },
      title: '容器定义'
    }
  }
}
