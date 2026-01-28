<template>
  <div class="app-container">
    <!-- 顶部导航栏 -->
    <header class="app-header">
      <div class="logo">工具集成平台</div>
      <div class="header-actions">
        <el-input
          v-model="searchQuery"
          placeholder="搜索工具..."
          prefix-icon="Search"
          class="search-input"
          @input="handleSearch"
        />
        <el-button type="primary" @click="toggleTheme">
          {{ isDark ? '浅色模式' : '深色模式' }}
        </el-button>
      </div>
    </header>
    
    <div class="app-body">
      <!-- 左侧分类栏 -->
      <aside class="sidebar">
        <CategorySidebar 
          :categories="categories" 
          :activeCategory="activeCategory"
          @category-change="handleCategoryChange"
          @add-category="handleAddCategory"
          @edit-category="handleEditCategory"
          @delete-category="handleDeleteCategory"
        />
      </aside>
      
      <!-- 右侧工具区域 -->
      <main class="main-content">
        <ToolGrid 
          :tools="filteredTools"
          :viewMode="viewMode"
          @add-tool="handleAddTool"
          @edit-tool="handleEditTool"
          @delete-tool="handleDeleteTool"
          @toggle-favorite="handleToggleFavorite"
          @open-tool="handleOpenTool"
        />
      </main>
    </div>
    
    <!-- 分类编辑对话框 -->
    <CategoryDialog 
      v-if="showCategoryDialog"
      :category="editingCategory"
      @save="handleSaveCategory"
      @cancel="showCategoryDialog = false"
    />
    
    <!-- 工具编辑对话框 -->
    <ToolDialog 
      v-if="showToolDialog"
      :tool="editingTool"
      :categories="categories"
      @save="handleSaveTool"
      @cancel="showToolDialog = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import CategorySidebar from './components/CategorySidebar.vue'
import ToolGrid from './components/ToolGrid.vue'
import CategoryDialog from './components/CategoryDialog.vue'
import ToolDialog from './components/ToolDialog.vue'
import { useToolStore } from './store/toolStore'
import { ElMessage } from 'element-plus'
import type { Category, Tool } from './types'

// 全局注册ElMessage
window.ElMessage = ElMessage

const toolStore = useToolStore()

// 响应式数据
const searchQuery = ref('')
const activeCategory = ref<string>('all')
const viewMode = ref<'card' | 'list'>('card')
const isDark = ref(false)
const showCategoryDialog = ref(false)
const showToolDialog = ref(false)
const editingCategory = ref<Category | null>(null)
const editingTool = ref<Tool | null>(null)

// 计算属性
const categories = computed(() => toolStore.categories)
const filteredTools = computed(() => {
  let tools = toolStore.tools
  
  // 按分类筛选
  if (activeCategory.value !== 'all') {
    tools = tools.filter(tool => 
      tool.categories.includes(activeCategory.value)
    )
  }
  
  // 按搜索关键词筛选
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    tools = tools.filter(tool => 
      tool.name.toLowerCase().includes(query) ||
      tool.description.toLowerCase().includes(query) ||
      tool.tags.some(tag => tag.toLowerCase().includes(query))
    )
  }
  
  return tools
})

// 方法
const handleSearch = () => {
  // 搜索逻辑已在计算属性中处理
}

const handleCategoryChange = (categoryId: string) => {
  activeCategory.value = categoryId
}

const handleAddCategory = () => {
  editingCategory.value = null
  showCategoryDialog.value = true
}

const handleEditCategory = (category: Category) => {
  editingCategory.value = { ...category }
  showCategoryDialog.value = true
}

const handleDeleteCategory = (categoryId: string) => {
  toolStore.deleteCategory(categoryId)
}

const handleSaveCategory = (category: Category) => {
  if (editingCategory.value) {
    toolStore.updateCategory(category)
  } else {
    toolStore.addCategory(category)
  }
  showCategoryDialog.value = false
}

const handleAddTool = () => {
  editingTool.value = null
  showToolDialog.value = true
}

const handleEditTool = (tool: Tool) => {
  editingTool.value = { ...tool }
  showToolDialog.value = true
}

const handleDeleteTool = (toolId: string) => {
  toolStore.deleteTool(toolId)
}

const handleSaveTool = (tool: Tool) => {
  if (editingTool.value) {
    toolStore.updateTool(tool)
  } else {
    toolStore.addTool(tool)
  }
  showToolDialog.value = false
}

const handleToggleFavorite = (toolId: string) => {
  toolStore.toggleFavorite(toolId)
}

const handleOpenTool = (tool: Tool) => {
  window.open(tool.url, '_blank')
  toolStore.incrementClickCount(tool.id)
}

const toggleTheme = () => {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
}

// 生命周期
onMounted(() => {
  toolStore.initializeData()
})
</script>

<style scoped>
.app-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.app-header {
  height: 60px;
  background-color: #fff;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.logo {
  font-size: 20px;
  font-weight: bold;
  color: #409eff;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.search-input {
  width: 300px;
}

.app-body {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.sidebar {
  width: 250px;
  background-color: #f5f7fa;
  border-right: 1px solid #e0e0e0;
  overflow-y: auto;
}

.main-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: #fafafa;
}

/* 深色模式 */
.dark .app-header {
  background-color: #1f1f1f;
  border-bottom-color: #333;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.dark .logo {
  color: #66b1ff;
}

.dark .sidebar {
  background-color: #2c2c2c;
  border-right-color: #444;
}

.dark .main-content {
  background-color: #1f1f1f;
  color: #e0e0e0;
}
</style>