<template>
  <div>
    <h2 class="text-3xl font-bold text-gray-900 mb-8">Dashboard</h2>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="text-4xl mb-4">⏳</div>
      <p class="text-gray-600">Loading statistics...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <p class="text-red-800">{{ error }}</p>
    </div>

    <!-- Stats Cards -->
    <div v-else-if="stats" class="space-y-8">
      <!-- Overview Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="text-sm font-medium text-gray-500 mb-2">Total Tests</div>
          <div class="text-3xl font-bold text-gray-900">{{ stats.total }}</div>
        </div>

        <div class="bg-green-50 rounded-lg shadow p-6">
          <div class="text-sm font-medium text-green-700 mb-2">✅ Passed</div>
          <div class="text-3xl font-bold text-green-900">{{ stats.passed }}</div>
          <div class="text-xs text-green-600 mt-1">
            {{ getPercentage(stats.passed, stats.total) }}%
          </div>
        </div>

        <div class="bg-red-50 rounded-lg shadow p-6">
          <div class="text-sm font-medium text-red-700 mb-2">🔴 Failed</div>
          <div class="text-3xl font-bold text-red-900">{{ stats.failed }}</div>
          <div class="text-xs text-red-600 mt-1">
            {{ getPercentage(stats.failed, stats.total) }}%
          </div>
        </div>

        <div class="bg-yellow-50 rounded-lg shadow p-6">
          <div class="text-sm font-medium text-yellow-700 mb-2">🟡 In Progress</div>
          <div class="text-3xl font-bold text-yellow-900">{{ stats.inProgress }}</div>
          <div class="text-xs text-yellow-600 mt-1">
            {{ getPercentage(stats.inProgress, stats.total) }}%
          </div>
        </div>

        <div class="bg-blue-50 rounded-lg shadow p-6">
          <div class="text-sm font-medium text-blue-700 mb-2">❓ Need Confirmation</div>
          <div class="text-3xl font-bold text-blue-900">{{ stats.needConfirmation }}</div>
          <div class="text-xs text-blue-600 mt-1">
            {{ getPercentage(stats.needConfirmation, stats.total) }}%
          </div>
        </div>
      </div>

      <!-- Environment Breakdown -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Tests by Environment</h3>
        <div class="grid grid-cols-3 gap-4">
          <div class="text-center">
            <div class="text-2xl font-bold text-gray-900">{{ stats.byEnv.dev }}</div>
            <div class="text-sm text-gray-500">DEV</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-gray-900">{{ stats.byEnv.staging }}</div>
            <div class="text-sm text-gray-500">STAGING</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-gray-900">{{ stats.byEnv.prod }}</div>
            <div class="text-sm text-gray-500">PROD</div>
          </div>
        </div>
      </div>

      <!-- Recent Tests -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Recent Tests</h3>
        <div v-if="stats.recentTests.length === 0" class="text-center py-8 text-gray-500">
          No tests yet. Create your first test!
        </div>
        <div v-else class="space-y-3">
          <div
            v-for="test in stats.recentTests"
            :key="test.id"
            class="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
            @click="$router.push(`/tests/${test.id}`)"
          >
            <div class="flex-1">
              <div class="font-medium text-gray-900">{{ test.feature }}</div>
              <div class="text-sm text-gray-500">{{ test.date }} • {{ test.env }}</div>
            </div>
            <div>
              <span :class="getStatusClass(test.status)">
                {{ getStatusEmoji(test.status) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <router-link
            to="/tests/new"
            class="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            <span>➕</span>
            <span>Add New Test</span>
          </router-link>
          <router-link
            to="/tests"
            class="flex items-center justify-center gap-2 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium"
          >
            <span>📋</span>
            <span>View All Tests</span>
          </router-link>
          <button
            @click="refreshStats"
            class="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
          >
            <span>🔄</span>
            <span>Refresh Stats</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useStatsStore } from '../stores/statsStore';

const statsStore = useStatsStore();

const stats = computed(() => statsStore.stats);
const loading = computed(() => statsStore.loading);
const error = computed(() => statsStore.error);

onMounted(() => {
  statsStore.fetchStats();
});

const refreshStats = () => {
  statsStore.fetchStats();
};

const getPercentage = (value: number, total: number): string => {
  if (total === 0) return '0';
  return ((value / total) * 100).toFixed(0);
};

const getStatusEmoji = (status: string): string => {
  switch (status) {
    case 'PASSED':
      return '✅';
    case 'FAILED':
      return '🔴';
    case 'IN_PROGRESS':
      return '🟡';
    case 'NEED_CONFIRMATION':
      return '❓';
    default:
      return '';
  }
};

const getStatusClass = (status: string): string => {
  const baseClass = 'px-3 py-1 rounded-full text-sm font-medium';
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
</script>
