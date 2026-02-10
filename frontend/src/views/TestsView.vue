<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-3xl font-bold text-gray-900">All Tests</h2>
      <div class="flex items-center gap-3">
        <!-- View Toggle -->
        <div class="flex bg-gray-100 rounded-lg p-1">
          <button
            @click="viewMode = 'table'"
            :class="[
              'px-4 py-2 rounded-md text-sm font-medium transition-colors',
              viewMode === 'table' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600 hover:text-gray-900'
            ]"
          >
            📋 Table
          </button>
          <button
            @click="viewMode = 'kanban'"
            :class="[
              'px-4 py-2 rounded-md text-sm font-medium transition-colors',
              viewMode === 'kanban' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600 hover:text-gray-900'
            ]"
          >
            📊 Kanban
          </button>
        </div>
        <router-link
          to="/tests/new"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
        >
          + Add Test
        </router-link>
      </div>
    </div>

    <!-- Filters & Sort (only in table view) -->
    <div v-if="viewMode === 'table'" class="bg-white rounded-lg shadow p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search feature, jira, notes..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            v-model="statusFilter"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All</option>
            <option value="PASSED">✅ Passed</option>
            <option value="FAILED">🔴 Failed</option>
            <option value="IN_PROGRESS">🟡 In Progress</option>
            <option value="NEED_CONFIRMATION">❓ Need Confirmation</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Environment</label>
          <select
            v-model="envFilter"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All</option>
            <option value="DEV">DEV</option>
            <option value="STAGING">STAGING</option>
            <option value="PROD">PROD</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
          <select
            v-model="sortBy"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="date">Date</option>
            <option value="feature">Feature</option>
            <option value="status">Status</option>
            <option value="env">Environment</option>
          </select>
        </div>
        <div class="flex items-end gap-2">
          <button
            @click="toggleSortOrder"
            class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            :title="sortOrder === 'desc' ? 'Sort Ascending' : 'Sort Descending'"
          >
            {{ sortOrder === 'desc' ? '↓' : '↑' }}
          </button>
          <button
            @click="clearFilters"
            class="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Clear
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading && tests.length === 0" class="text-center py-12">
      <div class="text-4xl mb-4">⏳</div>
      <p class="text-gray-600">Loading tests...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
      <p class="text-red-800">{{ error }}</p>
    </div>

    <!-- Kanban View -->
    <div v-else-if="viewMode === 'kanban'">
      <KanbanBoard
        :tests="tests"
        @view-test="handleViewTest"
        @status-change="handleStatusChange"
      />
    </div>

    <!-- Tests Table -->
    <div v-else class="bg-white rounded-lg shadow overflow-x-auto">
      <div v-if="tests.length === 0" class="text-center py-12">
        <div class="text-4xl mb-4">📋</div>
        <p class="text-gray-600">No tests found. Create your first test!</p>
      </div>
      <div v-else>
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Date
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Feature
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Jira
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Env
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tags
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Notes
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-32">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="test in tests"
              :key="test.id"
              class="hover:bg-gray-50 cursor-pointer"
              @click="$router.push(`/tests/${test.id}`)"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ test.date }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-900 max-w-xs">
                <div class="truncate" :title="test.feature">
                  {{ test.feature }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <a
                  v-if="test.jira && test.jiraUrl"
                  :href="test.jiraUrl"
                  target="_blank"
                  class="text-blue-600 hover:text-blue-800"
                  @click.stop
                >
                  {{ test.jira }}
                </a>
                <span v-else class="text-gray-400">-</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusClass(test.status)">
                  {{ getStatusText(test.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getEnvClass(test.env)">
                  {{ test.env }}
                </span>
              </td>
              <td class="px-6 py-4 max-w-xs">
                <div class="flex flex-wrap gap-1">
                  <TagBadge
                    v-for="testTag in test.tags"
                    :key="testTag.id"
                    :tag="testTag.tag"
                  />
                  <span v-if="!test.tags || test.tags.length === 0" class="text-gray-400 text-sm">-</span>
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-600 max-w-xs">
                <div v-if="test.detail" class="truncate" :title="test.detail.title">
                  {{ test.detail.title }}
                </div>
                <div v-else-if="test.notes" class="truncate" :title="test.notes">
                  {{ test.notes }}
                </div>
                <span v-else class="text-gray-400">-</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                <div class="flex items-center justify-end gap-2">
                  <button
                    @click.stop="$router.push(`/tests/${test.id}/edit`)"
                    class="text-blue-600 hover:text-blue-900"
                  >
                    Edit
                  </button>
                  <button
                    @click.stop="handleDelete(test.id)"
                    class="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Pagination Info & Load More -->
        <div v-if="pagination" class="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-700">
              Showing <span class="font-medium">{{ tests.length }}</span> of 
              <span class="font-medium">{{ pagination.total }}</span> tests
            </div>
            <button
              v-if="pagination.hasMore"
              @click="loadMore"
              :disabled="loading"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {{ loading ? 'Loading...' : 'Load More' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useTestStore } from '../stores/testStore';
import TagBadge from '../components/TagBadge.vue';
import KanbanBoard from '../components/KanbanBoard.vue';
import type { TestStatus } from '../types';

const router = useRouter();
const testStore = useTestStore();

const viewMode = ref<'table' | 'kanban'>('table');
const searchQuery = ref('');
const statusFilter = ref('');
const envFilter = ref('');
const sortBy = ref<'date' | 'feature' | 'status' | 'env'>('date');
const sortOrder = ref<'asc' | 'desc'>('desc');

const tests = computed(() => testStore.tests);
const loading = computed(() => testStore.loading);
const error = computed(() => testStore.error);
const pagination = computed(() => testStore.pagination);

// Simple debounce function
let debounceTimer: ReturnType<typeof setTimeout> | null = null;
const debouncedFetch = () => {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    testStore.fetchTests({
      search: searchQuery.value || undefined,
      status: statusFilter.value || undefined,
      env: envFilter.value || undefined,
      sortBy: sortBy.value,
      sortOrder: sortOrder.value,
      page: 1,
      limit: 20,
    });
  }, 300);
};

onMounted(() => {
  testStore.fetchTests({
    sortBy: sortBy.value,
    sortOrder: sortOrder.value,
    page: 1,
    limit: 20,
  });
});

// Watch filters and trigger fetch
watch([searchQuery, statusFilter, envFilter, sortBy, sortOrder], () => {
  debouncedFetch();
});

const clearFilters = () => {
  searchQuery.value = '';
  statusFilter.value = '';
  envFilter.value = '';
  sortBy.value = 'date';
  sortOrder.value = 'desc';
};

const toggleSortOrder = () => {
  sortOrder.value = sortOrder.value === 'desc' ? 'asc' : 'desc';
};

const loadMore = async () => {
  await testStore.loadMore();
};

const handleDelete = async (id: string) => {
  if (confirm('Are you sure you want to delete this test?')) {
    try {
      await testStore.deleteTest(id);
    } catch (error) {
      alert('Failed to delete test');
    }
  }
};

const getStatusText = (status: string): string => {
  switch (status) {
    case 'PASSED':
      return '✅ Passed';
    case 'FAILED':
      return '🔴 Failed';
    case 'IN_PROGRESS':
      return '🟡 In Progress';
    case 'NEED_CONFIRMATION':
      return '❓ Need Confirmation';
    default:
      return status;
  }
};

const getStatusClass = (status: string): string => {
  const baseClass = 'px-2 py-1 rounded-full text-xs font-medium';
  switch (status) {
    case 'PASSED':
      return `${baseClass} bg-green-100 text-green-800`;
    case 'FAILED':
      return `${baseClass} bg-red-100 text-red-800`;
    case 'IN_PROGRESS':
      return `${baseClass} bg-yellow-100 text-yellow-800`;
    case 'NEED_CONFIRMATION':
      return `${baseClass} bg-blue-100 text-blue-800`;
    default:
      return baseClass;
  }
};

const getEnvClass = (env: string): string => {
  const baseClass = 'px-2 py-1 rounded text-xs font-medium';
  switch (env) {
    case 'DEV':
      return `${baseClass} bg-gray-100 text-gray-800`;
    case 'STAGING':
      return `${baseClass} bg-blue-100 text-blue-800`;
    case 'PROD':
      return `${baseClass} bg-red-100 text-red-800`;
    default:
      return baseClass;
  }
};

const handleViewTest = (testId: string) => {
  router.push(`/tests/${testId}`);
};

const handleStatusChange = async (testId: string, newStatus: TestStatus) => {
  try {
    await testStore.updateTest(testId, { status: newStatus });
    await testStore.fetchTests();
  } catch (err: any) {
    alert('Failed to update status: ' + err.message);
  }
};
</script>
