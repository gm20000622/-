<template>
  <el-dialog
    :title="category ? '编辑分类' : '新增分类'"
    v-model="dialogVisible"
    width="500px"
    @close="$emit('cancel')"
  >
    <el-form :model="formData" label-width="80px">
      <el-form-item label="分类名称" required>
        <el-input v-model="formData.name" placeholder="请输入分类名称" />
      </el-form-item>
      
      <el-form-item label="父分类">
        <el-select v-model="formData.parentId" placeholder="选择父分类（可选）">
          <el-option label="无（一级分类）" value="null" />
          <template v-for="category in flattenCategories" :key="category.id">
            <el-option 
              :label="getCategoryPath(category)" 
              :value="category.id"
              :disabled="category.id === formData.id"
            />
          </template>
        </el-select>
      </el-form-item>
      
      <el-form-item label="排序">
        <el-input-number v-model="formData.order" :min="1" :max="999" />
      </el-form-item>
      
      <el-form-item label="状态">
        <el-switch v-model="formData.enabled" />
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
import { defineProps, defineEmits, ref, computed, onMounted } from 'vue'
import type { Category } from '../types'

const props = defineProps<{
  category: Category | null
  categories?: Category[]
}>()

const emit = defineEmits<{
  (e: 'save', category: Category): void
  (e: 'cancel'): void
}>()

const dialogVisible = ref(true)
const formData = ref<Category>({
  id: '',
  name: '',
  parentId: null,
  order: 1,
  enabled: true,
  children: []
})

// 扁平化分类列表，用于选择父分类
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

// 初始化表单数据
onMounted(() => {
  if (props.category) {
    formData.value = { ...props.category }
  } else {
    formData.value = {
      id: Date.now().toString(),
      name: '',
      parentId: null,
      order: 1,
      enabled: true,
      children: []
    }
  }
})

// 处理保存
const handleSave = () => {
  if (!formData.value.name.trim()) {
    ElMessage.error('请输入分类名称')
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