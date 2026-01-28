<template>
  <div class="category-sidebar">
    <div class="sidebar-header">
      <h3>分类管理</h3>
      <el-button type="primary" size="small" @click="$emit('add-category')">
        新增分类
      </el-button>
    </div>
    
    <div class="category-list">
      <!-- 全部工具 -->
      <div 
        class="category-item" 
        :class="{ active: activeCategory === 'all' }"
        @click="$emit('category-change', 'all')"
      >
        <span class="category-name">全部工具</span>
      </div>
      
      <!-- 收藏工具 -->
      <div 
        class="category-item" 
        :class="{ active: activeCategory === 'favorite' }"
        @click="$emit('category-change', 'favorite')"
      >
        <span class="category-name">收藏工具</span>
      </div>
      
      <!-- 分类列表 -->
      <div v-for="category in categories" :key="category.id" class="category-tree">
        <div class="category-item" :class="{ active: activeCategory === category.id }">
          <span 
            class="category-name" 
            @click="$emit('category-change', category.id)"
          >
            {{ category.name }}
          </span>
          <div class="category-actions">
            <el-button 
              size="small" 
              type="text" 
              @click.stop="$emit('edit-category', category)"
            >
              编辑
            </el-button>
            <el-button 
              size="small" 
              type="text" 
              danger 
              @click.stop="$emit('delete-category', category.id)"
            >
              删除
            </el-button>
          </div>
        </div>
        
        <!-- 子分类 -->
        <div v-if="category.children && category.children.length > 0" class="sub-category-list">
          <div 
            v-for="subCategory in category.children" 
            :key="subCategory.id"
            class="sub-category-item"
            :class="{ active: activeCategory === subCategory.id }"
          >
            <span 
              class="category-name" 
              @click="$emit('category-change', subCategory.id)"
            >
              {{ subCategory.name }}
            </span>
            <div class="category-actions">
              <el-button 
                size="small" 
                type="text" 
                @click.stop="$emit('edit-category', subCategory)"
              >
                编辑
              </el-button>
              <el-button 
                size="small" 
                type="text" 
                danger 
                @click.stop="$emit('delete-category', subCategory.id)"
              >
                删除
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import type { Category } from '../types'

const props = defineProps<{
  categories: Category[]
  activeCategory: string
}>()

const emit = defineEmits<{
  (e: 'category-change', categoryId: string): void
  (e: 'add-category'): void
  (e: 'edit-category', category: Category): void
  (e: 'delete-category', categoryId: string): void
}>()
</script>

<style scoped>
.category-sidebar {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 16px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sidebar-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.category-list {
  flex: 1;
  padding: 8px 0;
  overflow-y: auto;
}

.category-item {
  padding: 8px 16px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background-color 0.2s;
}

.category-item:hover {
  background-color: rgba(64, 158, 255, 0.1);
}

.category-item.active {
  background-color: rgba(64, 158, 255, 0.2);
  color: #409eff;
}

.sub-category-list {
  padding-left: 20px;
}

.sub-category-item {
  padding: 6px 16px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background-color 0.2s;
  font-size: 14px;
}

.sub-category-item:hover {
  background-color: rgba(64, 158, 255, 0.1);
}

.sub-category-item.active {
  background-color: rgba(64, 158, 255, 0.2);
  color: #409eff;
}

.category-name {
  flex: 1;
}

.category-actions {
  display: none;
  gap: 4px;
}

.category-item:hover .category-actions,
.sub-category-item:hover .category-actions {
  display: flex;
}

/* 深色模式 */
:deep(.dark) .category-item:hover {
  background-color: rgba(102, 177, 255, 0.15);
}

:deep(.dark) .category-item.active {
  background-color: rgba(102, 177, 255, 0.25);
  color: #66b1ff;
}

:deep(.dark) .sub-category-item:hover {
  background-color: rgba(102, 177, 255, 0.15);
}

:deep(.dark) .sub-category-item.active {
  background-color: rgba(102, 177, 255, 0.25);
  color: #66b1ff;
}

:deep(.dark) .sidebar-header {
  border-bottom-color: #444;
}
</style>