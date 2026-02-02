<template>
  <div>
    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <p class="text-gray-600">Loading test details...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6">
      <p class="text-red-800">{{ error }}</p>
      <button
        @click="router.push('/tests')"
        class="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
      >
        Back to Tests
      </button>
    </div>

    <!-- Test Detail Content -->
    <div v-else-if="test">
      <!-- Header -->
      <div class="mb-6">
        <button
          @click="router.push('/tests')"
          class="text-blue-600 hover:text-blue-800 mb-4 flex items-center gap-2"
        >
          ← Back to Tests
        </button>
        <div class="flex items-center justify-between">
          <h2 class="text-3xl font-bold text-gray-900">{{ test.feature }}</h2>
          <div class="flex gap-3">
            <button
              @click="router.push(`/tests/${test.id}/edit`)"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Edit Test
            </button>
            <button
              @click="handleDelete"
              class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      <!-- Test Info Card -->
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <h3 class="text-xl font-semibold text-gray-900 mb-4">Test Information</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-gray-600">Status</p>
            <span
              :class="[
                'inline-block px-3 py-1 rounded-full text-xs font-medium mt-1',
                test.status === 'PASSED' ? 'bg-green-100 text-green-800' :
                test.status === 'FAILED' ? 'bg-red-100 text-red-800' :
                test.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'
              ]"
            >
              {{ formatStatus(test.status) }}
            </span>
          </div>
          <div>
            <p class="text-sm text-gray-600">Environment</p>
            <span
              :class="[
                'inline-block px-3 py-1 rounded-full text-xs font-medium mt-1',
                test.env === 'PROD' ? 'bg-red-100 text-red-800' :
                test.env === 'STAGING' ? 'bg-yellow-100 text-yellow-800' :
                'bg-blue-100 text-blue-800'
              ]"
            >
              {{ test.env }}
            </span>
          </div>
          <div>
            <p class="text-sm text-gray-600">Test Date</p>
            <p class="text-gray-900 font-medium mt-1">{{ test.date }}</p>
          </div>
          <div v-if="test.jira">
            <p class="text-sm text-gray-600">JIRA Ticket</p>
            <a
              v-if="test.jiraUrl"
              :href="test.jiraUrl"
              target="_blank"
              class="text-blue-600 hover:text-blue-800 font-medium mt-1 inline-block"
            >
              {{ test.jira }} ↗
            </a>
            <p v-else class="text-gray-900 font-medium mt-1">{{ test.jira }}</p>
          </div>
          <div v-if="test.notes" class="md:col-span-2">
            <p class="text-sm text-gray-600">Notes</p>
            <p class="text-gray-900 mt-1">{{ test.notes }}</p>
          </div>
        </div>
      </div>

      <!-- Evidence Section -->
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xl font-semibold text-gray-900">Evidence</h3>
          <button
            @click="showAddEvidence = true"
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
          >
            + Add Evidence
          </button>
        </div>

        <!-- Add Evidence Form -->
        <div v-if="showAddEvidence" class="mb-6 p-4 bg-gray-50 rounded-lg">
          <h4 class="font-medium text-gray-900 mb-3">Add New Evidence</h4>
          <div class="space-y-3">
            <input
              v-model="newEvidence.type"
              type="text"
              placeholder="Evidence type (e.g., screenshot, jam.dev, video)"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <input
              v-model="newEvidence.url"
              type="text"
              placeholder="URL or file path"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <input
              v-model="newEvidence.description"
              type="text"
              placeholder="Description (optional)"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <div class="flex gap-2">
              <button
                @click="handleAddEvidence"
                :disabled="!newEvidence.type || !newEvidence.url"
                class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
              >
                Add
              </button>
              <button
                @click="cancelAddEvidence"
                class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>

        <!-- Evidence List -->
        <div v-if="test.evidence && test.evidence.length > 0" class="space-y-3">
          <div
            v-for="evidence in test.evidence"
            :key="evidence.id"
            class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div class="flex-1">
              <p class="font-medium text-gray-900">{{ evidence.type }}</p>
              <a
                :href="evidence.url"
                target="_blank"
                class="text-sm text-blue-600 hover:text-blue-800"
              >
                {{ evidence.url }} ↗
              </a>
              <p v-if="evidence.description" class="text-sm text-gray-600 mt-1">
                {{ evidence.description }}
              </p>
            </div>
            <button
              @click="handleDeleteEvidence(evidence.id)"
              class="text-red-600 hover:text-red-800 text-sm"
            >
              Delete
            </button>
          </div>
        </div>
        <p v-else class="text-gray-600 text-center py-4">No evidence added yet</p>
      </div>

      <!-- Test Details Section -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xl font-semibold text-gray-900">Test Details</h3>
          <button
            v-if="!editingDetails"
            @click="loadDetails"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
          >
            {{ details ? 'Edit Details' : 'Add Details' }}
          </button>
        </div>

        <!-- Details Form -->
        <div v-if="editingDetails" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              v-model="detailsForm.title"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Short title for table notes column"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Content (Markdown)
            </label>
            <textarea
              v-model="detailsForm.content"
              rows="12"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono text-sm"
              placeholder="Enter full markdown content..."
            ></textarea>
          </div>
          <div class="flex gap-2">
            <button
              @click="handleSaveDetails"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save Details
            </button>
            <button
              @click="cancelEditDetails"
              class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>

        <!-- Details Display -->
        <div v-else-if="details" class="space-y-4">
          <div>
            <h4 class="font-medium text-gray-900 mb-2">{{ details.title }}</h4>
            <div class="prose max-w-none bg-gray-50 p-4 rounded-lg">
              <pre class="whitespace-pre-wrap text-sm">{{ details.content }}</pre>
            </div>
          </div>
        </div>
        <p v-else class="text-gray-600 text-center py-4">No test details added yet</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useTestStore } from '@/stores/testStore';
import type { Test, Detail } from '@/types';
import { testService } from '@/services/testService';

const route = useRoute();
const router = useRouter();
const testStore = useTestStore();

const testId = route.params.id as string;
const loading = ref(true);
const error = ref('');
const test = ref<Test | null>(null);
const details = ref<Detail | null>(null);
const editingDetails = ref(false);
const showAddEvidence = ref(false);

const newEvidence = ref({
  type: '',
  url: '',
  description: ''
});

const detailsForm = ref({
  title: '',
  content: ''
});

onMounted(async () => {
  await loadTest();
  await loadDetailsIfExists();
});

const loadTest = async () => {
  loading.value = true;
  error.value = '';
  try {
    await testStore.fetchTest(testId);
    test.value = testStore.currentTest;
    if (!test.value) {
      error.value = 'Test not found';
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to load test';
  } finally {
    loading.value = false;
  }
};

const loadDetailsIfExists = async () => {
  try {
    const response = await testService.getDetails(testId);
    details.value = response;
  } catch (err) {
    // No details yet, that's okay
    details.value = null;
  }
};

const loadDetails = async () => {
  try {
    const response = await testService.getDetails(testId);
    details.value = response;
    detailsForm.value = {
      title: response.title,
      content: response.content
    };
    editingDetails.value = true;
  } catch (err) {
    // No details yet, start with empty form
    detailsForm.value = {
      title: '',
      content: ''
    };
    editingDetails.value = true;
  }
};

const handleSaveDetails = async () => {
  try {
    if (details.value) {
      await testService.updateDetails(testId, detailsForm.value);
    } else {
      await testService.createDetails({
        testId,
        ...detailsForm.value
      });
    }
    // Reload details without opening edit form
    await loadDetailsIfExists();
    editingDetails.value = false;
  } catch (err: any) {
    alert('Failed to save details: ' + err.message);
  }
};

const cancelEditDetails = () => {
  editingDetails.value = false;
  if (details.value) {
    detailsForm.value = {
      title: details.value.title,
      content: details.value.content
    };
  }
};

const handleAddEvidence = async () => {
  try {
    await testService.addEvidence(testId, {
      type: newEvidence.value.type,
      url: newEvidence.value.url,
      description: newEvidence.value.description || undefined
    });
    await loadTest();
    cancelAddEvidence();
  } catch (err: any) {
    alert('Failed to add evidence: ' + err.message);
  }
};

const cancelAddEvidence = () => {
  showAddEvidence.value = false;
  newEvidence.value = { type: '', url: '', description: '' };
};

const handleDeleteEvidence = async (evidenceId: string) => {
  if (!confirm('Are you sure you want to delete this evidence?')) return;
  
  try {
    await testService.deleteEvidence(testId, evidenceId);
    await loadTest();
  } catch (err: any) {
    alert('Failed to delete evidence: ' + err.message);
  }
};

const handleDelete = async () => {
  if (!confirm('Are you sure you want to delete this test? This action cannot be undone.')) {
    return;
  }
  
  try {
    await testStore.deleteTest(testId);
    router.push('/tests');
  } catch (err: any) {
    alert('Failed to delete test: ' + err.message);
  }
};

const formatStatus = (status: string) => {
  return status.replace('_', ' ');
};
</script>
