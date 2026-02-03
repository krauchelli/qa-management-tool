<template>
  <div 
    class="test-card" 
    :class="{ 'dragging': isDragging }"
    :draggable="draggable"
    @click="$emit('click')"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
  >
    <!-- Header -->
    <div class="card-header">
      <h4 class="card-title">{{ test.feature }}</h4>
      <span class="card-date">{{ test.date }}</span>
    </div>

    <!-- Environment Badge -->
    <div class="card-badges">
      <span
        :class="[
          'badge',
          test.env === 'PROD' ? 'badge-red' :
          test.env === 'STAGING' ? 'badge-yellow' :
          'badge-blue'
        ]"
      >
        {{ test.env }}
      </span>
    </div>

    <!-- Tags -->
    <div v-if="test.tags && test.tags.length > 0" class="card-tags">
      <TagBadge
        v-for="testTag in test.tags.slice(0, 3)"
        :key="testTag.id"
        :tag="testTag.tag"
      />
      <span v-if="test.tags.length > 3" class="text-xs text-gray-500">
        +{{ test.tags.length - 3 }}
      </span>
    </div>

    <!-- Jira Link -->
    <div v-if="test.jira" class="card-jira">
      <a
        :href="test.jiraUrl || '#'"
        target="_blank"
        @click.stop
        class="jira-link"
      >
        🔗 {{ test.jira }}
      </a>
    </div>

    <!-- Evidence Count -->
    <div v-if="test.evidence && test.evidence.length > 0" class="card-footer">
      <span class="evidence-count">
        📎 {{ test.evidence.length }} evidence
      </span>
    </div>

    <!-- Status Change Dropdown -->
    <div class="card-actions" @click.stop>
      <select
        :value="test.status"
        @change="handleStatusChange"
        class="status-select"
      >
        <option value="IN_PROGRESS">In Progress</option>
        <option value="NEED_CONFIRMATION">Need Confirmation</option>
        <option value="FAILED">Failed</option>
        <option value="PASSED">Passed</option>
      </select>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import TagBadge from './TagBadge.vue';
import type { Test, TestStatus } from '../types';

const props = defineProps<{
  test: Test;
  draggable?: boolean;
}>();

const emit = defineEmits<{
  click: [];
  'status-change': [testId: string, newStatus: TestStatus];
  dragstart: [event: DragEvent, test: Test];
}>();

const isDragging = ref(false);

const handleStatusChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  emit('status-change', props.test.id, target.value as TestStatus);
};

const handleDragStart = (event: DragEvent) => {
  isDragging.value = true;
  emit('dragstart', event, props.test);
};

const handleDragEnd = () => {
  isDragging.value = false;
};
</script>

<style scoped>
.test-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.test-card:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.test-card.dragging {
  opacity: 0.5;
  cursor: grabbing;
}

.test-card[draggable="true"] {
  cursor: grab;
}

.card-header {
  margin-bottom: 8px;
}

.card-title {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 4px;
  line-height: 1.4;
}

.card-date {
  font-size: 12px;
  color: #6b7280;
}

.card-badges {
  margin-bottom: 8px;
}

.badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
}

.badge-red {
  background: #fee2e2;
  color: #991b1b;
}

.badge-yellow {
  background: #fef3c7;
  color: #92400e;
}

.badge-blue {
  background: #dbeafe;
  color: #1e40af;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 8px;
}

.card-jira {
  margin-bottom: 8px;
}

.jira-link {
  font-size: 12px;
  color: #2563eb;
  text-decoration: none;
}

.jira-link:hover {
  text-decoration: underline;
}

.card-footer {
  margin-bottom: 8px;
  padding-top: 8px;
  border-top: 1px solid #f3f4f6;
}

.evidence-count {
  font-size: 12px;
  color: #6b7280;
}

.card-actions {
  margin-top: 8px;
}

.status-select {
  width: 100%;
  padding: 4px 8px;
  font-size: 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background: white;
  cursor: pointer;
}

.status-select:hover {
  border-color: #9ca3af;
}

.status-select:focus {
  outline: none;
  border-color: #3b82f6;
  ring: 2px;
  ring-color: #3b82f6;
}
</style>
