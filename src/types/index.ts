// 分类类型
export interface Category {
  id: string
  name: string
  parentId: string | null
  children?: Category[]
  order: number
  enabled: boolean
}

// 工具类型
export interface Tool {
  id: string
  name: string
  url: string
  description: string
  icon: string
  categories: string[]
  tags: string[]
  enabled: boolean
  favorite: boolean
  clickCount: number
  order: number
  createdAt: string
  updatedAt: string
}