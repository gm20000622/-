import { defineStore } from 'pinia'
import type { Category, Tool } from '../types'

export const useToolStore = defineStore('tool', {
  state: () => ({
    categories: [] as Category[],
    tools: [] as Tool[]
  }),
  
  getters: {
    getCategoryById: (state) => (id: string) => {
      const findCategory = (categories: Category[]): Category | undefined => {
        for (const category of categories) {
          if (category.id === id) {
            return category
          }
          if (category.children) {
            const found = findCategory(category.children)
            if (found) {
              return found
            }
          }
        }
        return undefined
      }
      return findCategory(state.categories)
    },
    
    favoriteTools: (state) => {
      return state.tools.filter(tool => tool.favorite && tool.enabled)
    }
  },
  
  actions: {
    // 初始化模拟数据
    initializeData() {
      // 模拟分类数据
      this.categories = [
        {
          id: 'ai',
          name: 'AI工具',
          parentId: null,
          order: 1,
          enabled: true,
          children: [
            {
              id: 'ai-text',
              name: '文本生成',
              parentId: 'ai',
              order: 1,
              enabled: true
            },
            {
              id: 'ai-image',
              name: '图像生成',
              parentId: 'ai',
              order: 2,
              enabled: true
            },
            {
              id: 'ai-code',
              name: '代码助手',
              parentId: 'ai',
              order: 3,
              enabled: true
            }
          ]
        },
        {
          id: 'audio',
          name: '音频工具',
          parentId: null,
          order: 2,
          enabled: true,
          children: [
            {
              id: 'audio-recognize',
              name: '语音识别',
              parentId: 'audio',
              order: 1,
              enabled: true
            },
            {
              id: 'audio-edit',
              name: '音频剪辑',
              parentId: 'audio',
              order: 2,
              enabled: true
            }
          ]
        },
        {
          id: 'video',
          name: '视频工具',
          parentId: null,
          order: 3,
          enabled: true
        },
        {
          id: 'dev',
          name: '开发工具',
          parentId: null,
          order: 4,
          enabled: true
        }
      ]
      
      // 模拟工具数据
      this.tools = [
        {
          id: '1',
          name: 'ChatGPT',
          url: 'https://chat.openai.com',
          description: 'OpenAI的聊天机器人，支持文本生成、问答等功能',
          icon: 'https://chat.openai.com/favicon.ico',
          categories: ['ai', 'ai-text'],
          tags: ['AI', '文本', 'GPT'],
          enabled: true,
          favorite: true,
          clickCount: 120,
          order: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Midjourney',
          url: 'https://www.midjourney.com',
          description: 'AI图像生成工具，可根据文本描述创建高质量图像',
          icon: 'https://www.midjourney.com/favicon.ico',
          categories: ['ai', 'ai-image'],
          tags: ['AI', '图像', '生成'],
          enabled: true,
          favorite: false,
          clickCount: 80,
          order: 2,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '3',
          name: 'GitHub Copilot',
          url: 'https://github.com/features/copilot',
          description: 'AI代码助手，实时提供代码建议和自动补全',
          icon: 'https://github.com/favicon.ico',
          categories: ['ai', 'ai-code', 'dev'],
          tags: ['AI', '代码', '开发'],
          enabled: true,
          favorite: true,
          clickCount: 95,
          order: 3,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '4',
          name: '百度语音识别',
          url: 'https://ai.baidu.com/tech/speech/asr',
          description: '百度AI开放平台的语音识别服务',
          icon: 'https://ai.baidu.com/favicon.ico',
          categories: ['audio', 'audio-recognize'],
          tags: ['音频', '语音识别', '国内'],
          enabled: true,
          favorite: false,
          clickCount: 45,
          order: 4,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '5',
          name: 'Audacity',
          url: 'https://www.audacityteam.org',
          description: '免费开源的音频编辑软件',
          icon: 'https://www.audacityteam.org/favicon.ico',
          categories: ['audio', 'audio-edit'],
          tags: ['音频', '剪辑', '免费'],
          enabled: true,
          favorite: false,
          clickCount: 60,
          order: 5,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
    },
    
    // 分类操作
    addCategory(category: Omit<Category, 'id'>) {
      const newCategory: Category = {
        ...category,
        id: Date.now().toString(),
        children: category.children || []
      }
      
      if (newCategory.parentId === null) {
        this.categories.push(newCategory)
      } else {
        const parentCategory = this.getCategoryById(newCategory.parentId)
        if (parentCategory) {
          if (!parentCategory.children) {
            parentCategory.children = []
          }
          parentCategory.children.push(newCategory)
        }
      }
    },
    
    updateCategory(updatedCategory: Category) {
      const updateCategoryRecursive = (categories: Category[]) => {
        for (let i = 0; i < categories.length; i++) {
          if (categories[i].id === updatedCategory.id) {
            categories[i] = updatedCategory
            return true
          }
          if (categories[i].children) {
            const updated = updateCategoryRecursive(categories[i].children!)
            if (updated) {
              return true
            }
          }
        }
        return false
      }
      
      updateCategoryRecursive(this.categories)
    },
    
    deleteCategory(categoryId: string) {
      const deleteCategoryRecursive = (categories: Category[]): boolean => {
        for (let i = 0; i < categories.length; i++) {
          if (categories[i].id === categoryId) {
            categories.splice(i, 1)
            return true
          }
          if (categories[i].children) {
            const deleted = deleteCategoryRecursive(categories[i].children!)
            if (deleted) {
              return true
            }
          }
        }
        return false
      }
      
      deleteCategoryRecursive(this.categories)
      
      // 移除工具中对该分类的引用
      this.tools.forEach(tool => {
        tool.categories = tool.categories.filter(id => id !== categoryId)
      })
    },
    
    // 工具操作
    addTool(tool: Omit<Tool, 'id' | 'clickCount' | 'createdAt' | 'updatedAt'>) {
      const newTool: Tool = {
        ...tool,
        id: Date.now().toString(),
        clickCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      this.tools.push(newTool)
    },
    
    updateTool(updatedTool: Tool) {
      const index = this.tools.findIndex(tool => tool.id === updatedTool.id)
      if (index !== -1) {
        this.tools[index] = {
          ...updatedTool,
          updatedAt: new Date().toISOString()
        }
      }
    },
    
    deleteTool(toolId: string) {
      const index = this.tools.findIndex(tool => tool.id === toolId)
      if (index !== -1) {
        this.tools.splice(index, 1)
      }
    },
    
    toggleFavorite(toolId: string) {
      const tool = this.tools.find(t => t.id === toolId)
      if (tool) {
        tool.favorite = !tool.favorite
      }
    },
    
    incrementClickCount(toolId: string) {
      const tool = this.tools.find(t => t.id === toolId)
      if (tool) {
        tool.clickCount++
      }
    },
    
    // 工具排序
    reorderTools(toolIds: string[]) {
      const toolMap = new Map(this.tools.map(tool => [tool.id, tool]))
      this.tools = toolIds.map((id, index) => {
        const tool = toolMap.get(id)
        if (tool) {
          tool.order = index + 1
        }
        return tool
      }).filter(Boolean) as Tool[]
    }
  }
})