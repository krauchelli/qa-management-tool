<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
    <!-- Header -->
    <div class="flex items-start justify-between mb-3">
      <div class="flex-1">
        <div class="flex items-center gap-2 mb-1">
          <span :class="priorityClass" class="w-3 h-3 rounded-full"></span>
          <h3 class="text-lg font-semibold text-gray-900">{{ testCase.title }}</h3>
        </div>
        <p v-if="testCase.description" class="text-sm text-gray-600 line-clamp-2">
          {{ testCase.description }}
        </p>
      </div>
      <span :class="priorityBadgeClass" class="px-2 py-1 text-xs font-medium rounded">
        {{ testCase.priority }}
      </span>
    </div>

    <!-- Tags -->
    <div v-if="testCase.tags && testCase.tags.length > 0" class="flex flex-wrap gap-1 mb-3">
      <TagBadge
        v-for="testCaseTag in testCase.tags"
        :key="testCaseTag.id"
        :tag="testCaseTag.tag"
        size="sm"
      />
    </div>

    <!-- Stats -->
    <div v-if="showStats" class="flex items-center gap-4 text-sm text-gray-600 mb-3">
      <span v-if="stats">
        Used in {{ stats.executionCount }} tests
      </span>
      <span v-if="stats?.lastTested">
        Last used: {{ formatDate(stats.lastTested) }}
      </span>
    </div>

    <!-- Actions -->
    <div class="flex items-center gap-2">
      <button
        @click="$emit('view', testCase.id)"
        class="px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded transition-colors"
      >
        View
      </button>
      <button
        @click="$emit('edit', testCase.id)"
        class="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded transition-colors"
      >
        Edit
      </button>
      <button
        @click="$emit('use', testCase.id)"
        class="px-3 py-1.5 text-sm font-medium text-green-600 hover:bg-green-50 rounded transition-colors"
      >
        Use in Test
      </button>
      <button
        @click="$emit('delete', testCase.id)"
        class="ml-auto px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded transition-colors"
      >
        Delete
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { TestCase } from '../types';
import TagBadge from './TagBadge.vue';

interface Props {
  testCase: TestCase;
  showStats?: boolean;
  stats?: {
    executionCount: number;
    passCount: number;
    failCount: number;
    passRate: number;
    lastTested?: string;
  };
}

const props = withDefaults(defineProps<Props>(), {
  showStats: false,
});

defineEmits<{
  view: [id: string];
  edit: [id: string];
  use: [id: string];
  delete: [id: string];
}>();

const priorityClass = computed(() => {
  const classes = {
    CRITICAL: 'bg-red-500',
    HIGH: 'bg-orange-500',
    MEDIUM: 'bg-yellow-500',
    LOW: 'bg-green-500',
  };
  return classes[props.testCase.priority] || classes.MEDIUM;
});

const priorityBadgeClass = computed(() => {
  const classes = {
    CRITICAL: 'bg-red-100 text-red-800',
    HIGH: 'bg-orange-100 text-orange-800',
    MEDIUM: 'bg-yellow-100 text-yellow-800',
    LOW: 'bg-green-100 text-green-800',
  };
  return classes[props.testCase.priority] || classes.MEDIUM;
});

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};
</script>
