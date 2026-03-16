<template>
  <div class="kanban-board">
    <!-- Columns -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- In Progress Column -->
      <div 
        class="kanban-column"
        :class="{ 'drag-over': dragOverColumn === 'IN_PROGRESS' }"
        @drop="handleDrop($event, 'IN_PROGRESS')"
        @dragover.prevent
        @dragenter="handleDragEnter('IN_PROGRESS')"
        @dragleave="handleDragLeave"
      >
        <div class="column-header bg-blue-100 text-blue-800">
          <h3 class="font-semibold">In Progress</h3>
          <span class="text-sm">{{ getTestsByStatus('IN_PROGRESS').length }}</span>
        </div>
        <div class="column-content">
          <TestCard
            v-for="test in getTestsByStatus('IN_PROGRESS')"
            :key="test.id"
            :test="test"
            :draggable="true"
            @click="$emit('view-test', test.id)"
            @status-change="handleStatusChange"
            @dragstart="handleDragStart($event, test)"
          />
          <div v-if="getTestsByStatus('IN_PROGRESS').length === 0" class="empty-state">
            No tests in progress
          </div>
        </div>
      </div>

      <!-- Need Confirmation Column -->
      <div 
        class="kanban-column"
        :class="{ 'drag-over': dragOverColumn === 'NEED_CONFIRMATION' }"
        @drop="handleDrop($event, 'NEED_CONFIRMATION')"
        @dragover.prevent
        @dragenter="handleDragEnter('NEED_CONFIRMATION')"
        @dragleave="handleDragLeave"
      >
        <div class="column-header bg-yellow-100 text-yellow-800">
          <h3 class="font-semibold">Need Confirmation</h3>
          <span class="text-sm">{{ getTestsByStatus('NEED_CONFIRMATION').length }}</span>
        </div>
        <div class="column-content">
          <TestCard
            v-for="test in getTestsByStatus('NEED_CONFIRMATION')"
            :key="test.id"
            :test="test"
            :draggable="true"
            @click="$emit('view-test', test.id)"
            @status-change="handleStatusChange"
            @dragstart="handleDragStart($event, test)"
          />
          <div v-if="getTestsByStatus('NEED_CONFIRMATION').length === 0" class="empty-state">
            No tests need confirmation
          </div>
        </div>
      </div>

      <!-- Failed Column -->
      <div 
        class="kanban-column"
        :class="{ 'drag-over': dragOverColumn === 'FAILED' }"
        @drop="handleDrop($event, 'FAILED')"
        @dragover.prevent
        @dragenter="handleDragEnter('FAILED')"
        @dragleave="handleDragLeave"
      >
        <div class="column-header bg-red-100 text-red-800">
          <h3 class="font-semibold">Failed</h3>
          <span class="text-sm">{{ getTestsByStatus('FAILED').length }}</span>
        </div>
        <div class="column-content">
          <TestCard
            v-for="test in getTestsByStatus('FAILED')"
            :key="test.id"
            :test="test"
            :draggable="true"
            @click="$emit('view-test', test.id)"
            @status-change="handleStatusChange"
            @dragstart="handleDragStart($event, test)"
          />
          <div v-if="getTestsByStatus('FAILED').length === 0" class="empty-state">
            No failed tests
          </div>
        </div>
      </div>

      <!-- Passed Column -->
      <div 
        class="kanban-column"
        :class="{ 'drag-over': dragOverColumn === 'PASSED' }"
        @drop="handleDrop($event, 'PASSED')"
        @dragover.prevent
        @dragenter="handleDragEnter('PASSED')"
        @dragleave="handleDragLeave"
      >
        <div class="column-header bg-green-100 text-green-800">
          <h3 class="font-semibold">Passed</h3>
          <span class="text-sm">{{ getTestsByStatus('PASSED').length }}</span>
        </div>
        <div class="column-content">
          <TestCard
            v-for="test in getTestsByStatus('PASSED')"
            :key="test.id"
            :test="test"
            :draggable="true"
            @click="$emit('view-test', test.id)"
            @status-change="handleStatusChange"
            @dragstart="handleDragStart($event, test)"
          />
          <div v-if="getTestsByStatus('PASSED').length === 0" class="empty-state">
            No passed tests
          </div>
        </div>
      </div>
    </div>

    <!-- Backlog Section (collapsible, hidden by default) -->
    <div class="mt-4" v-if="getTestsByStatus('BACKLOG').length > 0 || showBacklog">
      <button
        @click="showBacklog = !showBacklog"
        class="w-full flex items-center justify-between px-4 py-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        :class="{ 'rounded-b-none': showBacklog }"
      >
        <div class="flex items-center gap-2">
          <span class="text-sm">{{ showBacklog ? '▼' : '▶' }}</span>
          <h3 class="font-semibold text-gray-600">📦 Backlog</h3>
          <span class="text-sm text-gray-500">({{ getTestsByStatus('BACKLOG').length }})</span>
        </div>
        <span class="text-xs text-gray-400">Hidden from main board</span>
      </button>
      <div
        v-if="showBacklog"
        class="bg-gray-50 border border-t-0 border-gray-200 rounded-b-lg p-4"
        @drop="handleDrop($event, 'BACKLOG')"
        @dragover.prevent
        @dragenter="handleDragEnter('BACKLOG')"
        @dragleave="handleDragLeave"
        :class="{ 'ring-2 ring-gray-400 ring-dashed': dragOverColumn === 'BACKLOG' }"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <TestCard
            v-for="test in getTestsByStatus('BACKLOG')"
            :key="test.id"
            :test="test"
            :draggable="true"
            @click="$emit('view-test', test.id)"
            @status-change="handleStatusChange"
            @dragstart="handleDragStart($event, test)"
          />
        </div>
        <div v-if="getTestsByStatus('BACKLOG').length === 0" class="text-center py-4 text-gray-400 text-sm">
          Drag passed tests here to archive them from the board
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import TestCard from './TestCard.vue';
import type { Test, TestStatus } from '../types';

const props = defineProps<{
  tests: Test[];
}>();

const emit = defineEmits<{
  'view-test': [id: string];
  'status-change': [testId: string, newStatus: TestStatus];
}>();

const draggedTest = ref<Test | null>(null);
const dragOverColumn = ref<TestStatus | null>(null);
const showBacklog = ref(false);

const getTestsByStatus = (status: TestStatus) => {
  return props.tests.filter(test => test.status === status);
};

const handleStatusChange = (testId: string, newStatus: TestStatus) => {
  emit('status-change', testId, newStatus);
};

const handleDragStart = (event: DragEvent, test: Test) => {
  draggedTest.value = test;
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', test.id);
  }
};

const handleDragEnter = (status: TestStatus) => {
  dragOverColumn.value = status;
};

const handleDragLeave = () => {
  dragOverColumn.value = null;
};

const handleDrop = (event: DragEvent, newStatus: TestStatus) => {
  event.preventDefault();
  dragOverColumn.value = null;
  if (draggedTest.value && draggedTest.value.status !== newStatus) {
    emit('status-change', draggedTest.value.id, newStatus);
  }
  draggedTest.value = null;
};
</script>

<style scoped>
.kanban-board {
  width: 100%;
  overflow-x: auto;
}

.kanban-column {
  background: #f9fafb;
  border-radius: 8px;
  min-height: 500px;
  display: flex;
  flex-direction: column;
  transition: background-color 0.2s;
}

.kanban-column.drag-over {
  background: #e0f2fe;
  border: 2px dashed #3b82f6;
}

.column-header {
  padding: 12px 16px;
  border-radius: 8px 8px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.column-content {
  padding: 12px;
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.empty-state {
  text-align: center;
  padding: 24px;
  color: #9ca3af;
  font-size: 14px;
}
</style>
