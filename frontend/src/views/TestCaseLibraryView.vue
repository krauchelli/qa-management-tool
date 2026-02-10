<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Test Case Library</h1>
      <button
        @click="goToNewTestCase"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        + New Test Case
      </button>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Search -->
        <div class="md:col-span-2">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by title or description..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <!-- Priority Filter -->
        <div>
          <select
            v-model="priorityFilter"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Priorities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>

        <!-- Sort -->
        <div>
          <select
            v-model="sortBy"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="createdAt">Newest First</option>
            <option value="updatedAt">Recently Updated</option>
            <option value="title">Title (A-Z)</option>
            <option value="priority">Priority</option>
          </select>
        </div>
      </div>

      <!-- Tag Filter -->
      <div class="mt-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">Filter by Tags</label>
        <TagSelector
          v-model="selectedTagIds"
          :multiple="true"
          placeholder="Select tags to filter..."
        />
      </div>

      <!-- Clear Filters -->
      <div class="mt-4 flex justify-end">
        <button
          @click="clearFilters"
          class="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          Clear Filters
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="testCaseStore.loading && testCases.length === 0" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <p class="mt-2 text-gray-600">Loading test cases...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="!testCaseStore.loading && testCases.length === 0" class="text-center py-12">
      <p class="text-gray-600 mb-4">No test cases found</p>
      <button
        @click="goToNewTestCase"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Create Your First Test Case
      </button>
    </div>

    <!-- Test Cases Grid -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <TestCaseCard
        v-for="testCase in testCases"
        :key="testCase.id"
        :test-case="testCase"
        @view="viewTestCase"
        @edit="editTestCase"
        @use="useTestCase"
        @delete="deleteTestCase"
      />
    </div>

    <!-- Load More -->
    <div v-if="testCaseStore.pagination?.hasMore" class="mt-6 text-center">
      <button
        @click="loadMore"
        :disabled="testCaseStore.loading"
        class="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
      >
        {{ testCaseStore.loading ? 'Loading...' : 'Load More' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useTestCaseStore } from '../stores/testCaseStore';
import TestCaseCard from '../components/TestCaseCard.vue';
import TagSelector from '../components/TagSelector.vue';
import type { TestCasePriority } from '../types';

const router = useRouter();
const testCaseStore = useTestCaseStore();

const searchQuery = ref('');
const priorityFilter = ref<TestCasePriority | ''>('');
const selectedTagIds = ref<string[]>([]);
const sortBy = ref<'title' | 'priority' | 'createdAt' | 'updatedAt'>('createdAt');

const testCases = computed(() => testCaseStore.testCases);

const fetchTestCases = async () => {
  await testCaseStore.fetchTestCases({
    search: searchQuery.value || undefined,
    priority: priorityFilter.value || undefined,
    tagIds: selectedTagIds.value.length > 0 ? selectedTagIds.value : undefined,
    sortBy: sortBy.value,
    sortOrder: 'desc',
    page: 1,
    limit: 20,
  });
};

const loadMore = async () => {
  await testCaseStore.loadMore();
};

const clearFilters = () => {
  searchQuery.value = '';
  priorityFilter.value = '';
  selectedTagIds.value = [];
  sortBy.value = 'createdAt';
  fetchTestCases();
};

const goToNewTestCase = () => {
  router.push('/test-cases/new');
};

const viewTestCase = (id: string) => {
  router.push(`/test-cases/${id}`);
};

const editTestCase = (id: string) => {
  router.push(`/test-cases/${id}/edit`);
};

const useTestCase = (id: string) => {
  router.push(`/tests/new?testCaseId=${id}`);
};

const deleteTestCase = async (id: string) => {
  if (!confirm('Are you sure you want to delete this test case?')) return;
  
  try {
    await testCaseStore.deleteTestCase(id);
  } catch (error) {
    console.error('Failed to delete test case:', error);
    alert('Failed to delete test case');
  }
};

// Watch filters and refetch
watch([searchQuery, priorityFilter, selectedTagIds, sortBy], () => {
  fetchTestCases();
}, { deep: true });

onMounted(() => {
  fetchTestCases();
});
</script>
