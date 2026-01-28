<template>
  <div class="tool-grid">
    <!-- 工具区域头部 -->
    <div class="tool-header">
      <h2>工具列表</h2>
      <div class="tool-header-actions">
        <el-button-group>
          <el-button 
            :type="viewMode === 'card' ? 'primary' : 'default'"
            @click="viewMode = 'card'"
          >
            卡片模式
          </el-button>
          <el-button 
            :type="viewMode === 'list' ? 'primary' : 'default'"
            @click="viewMode = 'list'"
          >
            列表模式
          </el-button>
        </el-button-group>
        <el-button type="primary" @click="$emit('add-tool')">
          新增工具
        </el-button>
      </div>
    </div>
    
    <!-- 工具网格 -->
    <div v-if="viewMode === 'card'" class="tool-cards">
      <div v-for="tool in tools" :key="tool.id" class="tool-card">
        <div class="tool-card-header">
          <img :src="tool.icon" :alt="tool.name" class="tool-icon" />
          <div class="tool-card-title">
            <h3>{{ tool.name }}</h3>
            <el-button 
              size="small" 
              :type="tool.favorite ? 'warning' : 'default'"
              @click="$emit('toggle-favorite', tool.id)"
            >
              {{ tool.favorite ? '已收藏' : '收藏' }}
            </el-button>
          </div>
        </div>
        <p class="tool-description">{{ tool.description }}</p>
        <div class="tool-tags">
          <span v-for="tag in tool.tags" :key="tag" class="tool-tag">
            {{ tag }}
          </span>
        </div>
        <div class="tool-card-footer">
          <span class="tool-stats">点击: {{ tool.clickCount }}</span>
          <div class="tool-card-actions">
            <el-button 
              size="small" 
              type="primary" 
              @click="$emit('open-tool', tool)"
            >
              打开工具
            </el-button>
            <el-button 
              size="small" 
              @click="$emit('edit-tool', tool)"
            >
              编辑
            </el-button>
            <el-button 
              size="small" 
              danger 
              @click="$emit('delete-tool', tool.id)"
            >
              删除
            </el-button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 工具列表 -->
    <el-table v-else-if="viewMode === 'list'" :data="tools" style="width: 100%">
      <el-table-column prop="name" label="工具名称" min-width="150">
        <template #default="{ row }">
          <div class="tool-list-name">
            <img :src="row.icon" :alt="row.name" class="tool-list-icon" />
            <span>{{ row.name }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="description" label="描述" min-width="200" />
      <el-table-column prop="tags" label="标签" min-width="150">
        <template #default="{ row }">
          <div class="tool-list-tags">
            <span v-for="tag in row.tags" :key="tag" class="tool-tag">
              {{ tag }}
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="clickCount" label="点击次数" width="100" />
      <el-table-column prop="favorite" label="收藏" width="80">
        <template #default="{ row }">
          <el-button 
            size="small" 
            :type="row.favorite ? 'warning' : 'default'"
            @click="$emit('toggle-favorite', row.id)"
          >
            {{ row.favorite ? '是' : '否' }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button 
            size="small" 
            type="primary" 
            @click="$emit('open-tool', row)"
          >
            打开
          </el-button>
          <el-button 
            size="small" 
            @click="$emit('edit-tool', row)"
          >
            编辑
          </el-button>
          <el-button 
            size="small" 
            danger 
            @click="$emit('delete-tool', row.id)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <!-- 空状态 -->
    <div v-if="tools.length === 0" class="empty-state">
      <el-empty description="暂无工具" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref } from 'vue'
import type { Tool } from '../types'

const props = defineProps<{
  tools: Tool[]
  viewMode: 'card' | 'list'
}>()

const emit = defineEmits<{
  (e: 'add-tool'): void
  (e: 'edit-tool', tool: Tool): void
  (e: 'delete-tool', toolId: string): void
  (e: 'toggle-favorite', toolId: string): void
  (e: 'open-tool', tool: Tool): void
}>()

// 本地状态
const viewMode = ref<'card' | 'list'>(props.viewMode)
</script>

<style scoped>
.tool-grid {
  height: 100%;
}

.tool-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.tool-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.tool-header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* 卡片模式 */
.tool-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.tool-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 16px;
  transition: box-shadow 0.3s, transform 0.2s;
}

.tool-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.tool-card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.tool-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  object-fit: cover;
}

.tool-card-title {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tool-card-title h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.tool-description {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #666;
  line-height: 1.4;
}

.tool-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
}

.tool-tag {
  background-color: #f0f0f0;
  color: #666;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
}

.tool-card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tool-stats {
  font-size: 12px;
  color: #999;
}

.tool-card-actions {
  display: flex;
  gap: 6px;
}

/* 列表模式 */
.tool-list-name {
  display: flex;
  align-items: center;
  gap: 8px;
}

.tool-list-icon {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  object-fit: cover;
}

.tool-list-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

/* 空状态 */
.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  background-color: #fafafa;
  border-radius: 8px;
}

/* 深色模式 */
:deep(.dark) .tool-card {
  background-color: #2c2c2c;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

:deep(.dark) .tool-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.45);
}

:deep(.dark) .tool-description {
  color: #ccc;
}

:deep(.dark) .tool-tag {
  background-color: #444;
  color: #ccc;
}

:deep(.dark) .tool-stats {
  color: #999;
}

:deep(.dark) .empty-state {
  background-color: #2c2c2c;
}

:deep(.dark) .el-table {
  background-color: #2c2c2c;
  color: #e0e0e0;
}

:deep(.dark) .el-table th {
  background-color: #333;
  color: #e0e0e0;
}

:deep(.dark) .el-table tr {
  background-color: #2c2c2c;
}

:deep(.dark) .el-table tr:hover {
  background-color: #363636;
}

:deep(.dark) .el-table--border, .el-table--group {
  border-color: #444;
}

:deep(.dark) .el-table th,
:deep(.dark) .el-table td {
  border-bottom-color: #444;
}
</style>