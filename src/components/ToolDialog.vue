<template>
  <el-dialog
    :title="tool ? '编辑工具' : '新增工具'"
    v-model="dialogVisible"
    width="600px"
    @close="$emit('cancel')"
  >
    <el-form :model="formData" label-width="80px">
      <el-form-item label="工具名称" required>
        <el-input v-model="formData.name" placeholder="请输入工具名称" />
      </el-form-item>
      
      <el-form-item label="工具URL" required>
        <el-input v-model="formData.url" placeholder="请输入工具网址" />
      </el-form-item>
      
      <el-form-item label="描述">
        <el-input 
          v-model="formData.description" 
          type="textarea" 
          :rows="3" 
          placeholder="请输入工具描述"
        />
      </el-form-item>
      
      <el-form-item label="图标">
        <el-input v-model="formData.icon" placeholder="请输入图标URL（可选）" />
      </el-form-item>
      
      <el-form-item label="分类">
        <el-select 
          v-model="formData.categories" 
          multiple 
          placeholder="选择工具分类"
          style="width: 100%"
        >
          <template v-for="category in flattenCategories" :key="category.id">
            <el-option 
              :label="getCategoryPath(category)" 
              :value="category.id"
            />
          </template>
        </el-select>
      </el-form-item>
      
      <el-form-item label="标签">
        <el-input 
          v-model="tagsInput" 
          placeholder="请输入标签，用逗号分隔"
        />
      </el-form-item>
      
      <el-form-item label="排序">
        <el-input-number v-model="formData.order" :min="1" :max="999" />
      </el-form-item>
      
      <el-form-item label="状态">
        <el-switch v-model="formData.enabled" />
      </el-form-item>
      
      <el-form-item label="收藏">
        <el-switch v-model="formData.favorite" />
      </el-form-item>
    </el-form>
    
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="$emit('cancel')">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, computed, onMounted, watch } from 'vue'
import type { Category, Tool } from '../types'

const props = defineProps<{
  tool: Tool | null
  categories: Category[]
}>()

const emit = defineEmits<{
  (e: 'save', tool: Tool): void
  (e: 'cancel'): void
}>()

const dialogVisible = ref(true)
const formData = ref<Tool>({
  id: '',
  name: '',
  url: '',
  description: '',
  icon: '',
  categories: [],
  tags: [],
  enabled: true,
  favorite: false,
  clickCount: 0,
  order: 1,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
})

const tagsInput = ref('')

// 扁平化分类列表，用于选择分类
const flattenCategories = computed(() => {
  const categories = props.categories || []
  const result: Category[] = []
  
  const flatten = (cats: Category[], parentPath: string = '') => {
    for (const cat of cats) {
      result.push(cat)
      if (cat.children) {
        flatten(cat.children, parentPath + cat.name + ' > ')
      }
    }
  }
  
  flatten(categories)
  return result
})

// 获取分类的完整路径
const getCategoryPath = (category: Category): string => {
  const path: string[] = []
  let current: Category | undefined = category
  
  while (current) {
    path.unshift(current.name)
    if (current.parentId) {
      current = flattenCategories.value.find(c => c.id === current.parentId)
    } else {
      current = undefined
    }
  }
  
  return path.join(' > ')
}

// 监听标签输入
watch(() => formData.value.tags, (newTags) => {
  tagsInput.value = newTags.join(', ')
}, { immediate: true })

watch(tagsInput, (newInput) => {
  formData.value.tags = newInput
    .split(',')
    .map(tag => tag.trim())
    .filter(tag => tag)
})

// 初始化表单数据
onMounted(() => {
  if (props.tool) {
    formData.value = { ...props.tool }
    tagsInput.value = props.tool.tags.join(', ')
  } else {
    formData.value = {
      id: Date.now().toString(),
      name: '',
      url: '',
      description: '',
      icon: '',
      categories: [],
      tags: [],
      enabled: true,
      favorite: false,
      clickCount: 0,
      order: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    tagsInput.value = ''
  }
})

// 处理保存
const handleSave = () => {
  if (!formData.value.name.trim()) {
    ElMessage.error('请输入工具名称')
    return
  }
  
  if (!formData.value.url.trim()) {
    ElMessage.error('请输入工具URL')
    return
  }
  
  emit('save', formData.value)
  dialogVisible.value = false
}
</script>

<style scoped>
.dialog-footer {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>