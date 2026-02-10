<template>
  <div class="container mx-auto px-4 py-8 max-w-6xl">
    <!-- Loading State -->
    <div v-if="testCaseStore.loading && !testCase" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <p class="mt-2 text-gray-600">Loading test case...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="testCaseStore.error" class="text-center py-12">
      <p class="text-red-600">{{ testCaseStore.error }}</p>
      <button @click="goBack" class="mt-4 text-blue-600 hover:underline">
        Go Back
      </button>
    </div>

    <!-- Test Case Content -->
    <div v-else-if="testCase">
      <!-- Header -->
      <div class="mb-6">
        <button
          @click="goBack"
          class="text-blue-600 hover:underline mb-4 flex items-center gap-1"
        >
          ← Back to Library
        </button>
        
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <span :class="priorityClass" class="w-4 h-4 rounded-full"></span>
              <h1 class="text-3xl font-bold text-gray-900">{{ testCase.title }}</h1>
              <span :class="priorityBadgeClass" class="px-3 py-1 text-sm font-medium rounded">
                {{ testCase.priority }}
              </span>
            </div>
            
            <!-- Tags -->
            <div v-if="testCase.tags && testCase.tags.length > 0" class="flex flex-wrap gap-2 mt-3">
              <TagBadge
                v-for="testCaseTag in testCase.tags"
                :key="testCaseTag.id"
                :tag="testCaseTag.tag"
              />
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-2">
            <button
              @click="editTestCase"
              class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Edit
            </button>
            <button
              @click="useTestCase"
              class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Use in Test
            </button>
            <button
              @click="deleteTestCase"
              class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Column: Test Case Details -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Description -->
          <div v-if="testCase.description" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-3">Description</h2>
            <p class="text-gray-700">{{ testCase.description }}</p>
          </div>

          <!-- Test Steps -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-3">Test Steps</h2>
            <MarkdownViewer :content="testCase.steps" />
          </div>

          <!-- Expected Results -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-3">Expected Results</h2>
            <MarkdownViewer :content="testCase.expected" />
          </div>

          <!-- Execution History -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">
              Execution History ({{ executionHistory.length }})
            </h2>
            
            <div v-if="executionHistory.length === 0" class="text-center py-8 text-gray-500">
              No executions yet
            </div>
            
            <div v-else class="space-y-3">
              <div
                v-for="test in executionHistory"
                :key="test.id"
                class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                @click="viewTest(test.id)"
              >
                <div class="flex items-center gap-3">
                  <span :class="getStatusClass(test.status)" class="px-2 py-1 text-xs font-medium rounded">
                    {{ test.status }}
                  </span>
                  <span class="text-sm text-gray-600">{{ formatDate(test.date) }}</span>
                  <span class="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded">{{ test.env }}</span>
                </div>
                <span class="text-sm text-gray-500">{{ test.feature }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: Statistics -->
        <div class="space-y-6">
          <!-- Statistics Card -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Statistics</h2>
            
            <div v-if="stats" class="space-y-4">
              <div>
                <p class="text-sm text-gray-600">Total Executions</p>
                <p class="text-2xl font-bold text-gray-900">{{ stats.executionCount }}</p>
              </div>
              
              <div v-if="stats.executionCount > 0">
                <p class="text-sm text-gray-600">Pass Rate</p>
                <div class="flex items-center gap-2">
                  <p class="text-2xl font-bold text-gray-900">{{ stats.passRate.toFixed(1) }}%</p>
                  <span class="text-sm text-gray-500">({{ stats.passCount }}/{{ stats.executionCount }})</span>
                </div>
                <div class="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div
                    class="bg-green-500 h-2 rounded-full transition-all"
                    :style="{ width: `${stats.passRate}%` }"
                  ></div>
                </div>
              </div>
              
              <div v-if="stats.lastTested">
                <p class="text-sm text-gray-600">Last Tested</p>
                <p class="text-base font-medium text-gray-900">{{ formatDate(stats.lastTested) }}</p>
              </div>
              
              <div>
                <p class="text-sm text-gray-600">Created</p>
                <p class="text-base font-medium text-gray-900">{{ formatDate(testCase.createdAt) }}</p>
              </div>
              
              <div>
                <p class="text-sm text-gray-600">Last Updated</p>
                <p class="text-base font-medium text-gray-900">{{ formatDate(testCase.updatedAt) }}</p>
              </div>
            </div>
            
            <div v-else class="text-center py-4 text-gray-500">
              Loading statistics...
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useTestCaseStore } from '../stores/testCaseStore';
import TagBadge from '../components/TagBadge.vue';
import MarkdownViewer from '../components/MarkdownViewer.vue';

const router = useRouter();
const route = useRoute();
const testCaseStore = useTestCaseStore();

const testCase = computed(() => testCaseStore.currentTestCase);
const executionHistory = computed(() => testCaseStore.executionHistory);
const stats = computed(() => testCaseStore.stats);

const priorityClass = computed(() => {
  if (!testCase.value) return '';
  const classes = {
    CRITICAL: 'bg-red-500',
    HIGH: 'bg-orange-500',
    MEDIUM: 'bg-yellow-500',
    LOW: 'bg-green-500',
  };
  return classes[testCase.value.priority] || classes.MEDIUM;
});

const priorityBadgeClass = computed(() => {
  if (!testCase.value) return '';
  const classes = {
    CRITICAL: 'bg-red-100 text-red-800',
    HIGH: 'bg-orange-100 text-orange-800',
    MEDIUM: 'bg-yellow-100 text-yellow-800',
    LOW: 'bg-green-100 text-green-800',
  };
  return classes[testCase.value.priority] || classes.MEDIUM;
});

const loadTestCase = async () => {
  const id = route.params.id as string;
  await Promise.all([
    testCaseStore.fetchTestCase(id),
    testCaseStore.fetchExecutionHistory(id),
    testCaseStore.fetchTestCaseStats(id),
  ]);
};

const goBack = () => {
  router.push('/test-cases');
};

const editTestCase = () => {
  router.push(`/test-cases/${route.params.id}/edit`);
};

const useTestCase = () => {
  router.push(`/tests/new?testCaseId=${route.params.id}`);
};

const deleteTestCase = async () => {
  if (!confirm('Are you sure you want to delete this test case? This action cannot be undone.')) return;
  
  try {
    await testCaseStore.deleteTestCase(route.params.id as string);
    router.push('/test-cases');
  } catch (error) {
    console.error('Failed to delete test case:', error);
    alert('Failed to delete test case');
  }
};

const viewTest = (testId: string) => {
  router.push(`/tests/${testId}`);
};

const getStatusClass = (status: string) => {
  const classes = {
    PASSED: 'bg-green-100 text-green-800',
    FAILED: 'bg-red-100 text-red-800',
    IN_PROGRESS: 'bg-blue-100 text-blue-800',
    NEED_CONFIRMATION: 'bg-yellow-100 text-yellow-800',
  };
  return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800';
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

onMounted(() => {
  loadTestCase();
});
</script>
