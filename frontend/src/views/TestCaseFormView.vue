<template>
  <div class="container mx-auto px-4 py-8 max-w-4xl">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-3xl font-bold text-gray-900">
        {{ isEditMode ? 'Edit Test Case' : 'Create Test Case' }}
      </h1>
      <button
        @click="goBack"
        class="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        Cancel
      </button>
    </div>

    <!-- Form -->
    <form @submit.prevent="handleSubmit" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <!-- Title -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Title <span class="text-red-500">*</span>
        </label>
        <input
          v-model="form.title"
          type="text"
          required
          placeholder="e.g., Login with valid credentials"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <!-- Description -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Description (optional)
        </label>
        <textarea
          v-model="form.description"
          rows="2"
          placeholder="Brief description of what this test case covers"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        ></textarea>
      </div>

      <!-- Priority -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Priority <span class="text-red-500">*</span>
        </label>
        <select
          v-model="form.priority"
          required
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="CRITICAL">Critical</option>
        </select>
      </div>

      <!-- Tags -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Tags <span class="text-red-500">*</span>
        </label>
        <TagSelector
          v-model="form.tagIds"
          :multiple="true"
          placeholder="Select tags for this test case..."
        />
        <p class="mt-1 text-sm text-gray-500">
          Tags help organize and filter test cases
        </p>
      </div>

      <!-- Test Steps -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Test Steps <span class="text-red-500">*</span>
        </label>
        <MarkdownEditor
          v-model="form.steps"
          placeholder="1. Open login page&#10;2. Enter valid email&#10;3. Enter valid password&#10;4. Click Login button"
          :min-height="150"
        />
        <p class="mt-1 text-sm text-gray-500">
          Markdown supported. List the steps to execute this test.
        </p>
      </div>

      <!-- Expected Results -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Expected Results <span class="text-red-500">*</span>
        </label>
        <MarkdownEditor
          v-model="form.expected"
          placeholder="- User is logged in successfully&#10;- Redirected to dashboard&#10;- Welcome message displayed"
          :min-height="150"
        />
        <p class="mt-1 text-sm text-gray-500">
          Markdown supported. Describe what should happen when the test passes.
        </p>
      </div>

      <!-- Submit Button -->
      <div class="flex items-center justify-end gap-4">
        <button
          type="button"
          @click="goBack"
          class="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          :disabled="testCaseStore.loading || !isFormValid"
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ testCaseStore.loading ? 'Saving...' : (isEditMode ? 'Update Test Case' : 'Create Test Case') }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useTestCaseStore } from '../stores/testCaseStore';
import TagSelector from '../components/TagSelector.vue';
import MarkdownEditor from '../components/MarkdownEditor.vue';
import type { TestCasePriority } from '../types';

const router = useRouter();
const route = useRoute();
const testCaseStore = useTestCaseStore();

const isEditMode = computed(() => !!route.params.id);

const form = ref({
  title: '',
  description: '',
  priority: 'MEDIUM' as TestCasePriority,
  tagIds: [] as string[],
  steps: '',
  expected: '',
});

const isFormValid = computed(() => {
  return (
    form.value.title.trim() !== '' &&
    form.value.steps.trim() !== '' &&
    form.value.expected.trim() !== '' &&
    form.value.tagIds.length > 0
  );
});

const loadTestCase = async () => {
  if (!isEditMode.value) return;
  
  const id = route.params.id as string;
  await testCaseStore.fetchTestCase(id);
  
  if (testCaseStore.currentTestCase) {
    form.value = {
      title: testCaseStore.currentTestCase.title,
      description: testCaseStore.currentTestCase.description || '',
      priority: testCaseStore.currentTestCase.priority,
      tagIds: testCaseStore.currentTestCase.tags?.map(t => t.tagId) || [],
      steps: testCaseStore.currentTestCase.steps,
      expected: testCaseStore.currentTestCase.expected,
    };
  }
};

const handleSubmit = async () => {
  if (!isFormValid.value) return;

  try {
    if (isEditMode.value) {
      const id = route.params.id as string;
      await testCaseStore.updateTestCase(id, {
        title: form.value.title,
        description: form.value.description || undefined,
        priority: form.value.priority,
        steps: form.value.steps,
        expected: form.value.expected,
      });
      
      // Update tags separately
      await testCaseStore.updateTestCaseTags(id, form.value.tagIds);
      
      router.push(`/test-cases/${id}`);
    } else {
      const testCase = await testCaseStore.createTestCase({
        title: form.value.title,
        description: form.value.description || undefined,
        priority: form.value.priority,
        tagIds: form.value.tagIds,
        steps: form.value.steps,
        expected: form.value.expected,
      });
      
      router.push(`/test-cases/${testCase.id}`);
    }
  } catch (error) {
    console.error('Failed to save test case:', error);
    alert('Failed to save test case');
  }
};

const goBack = () => {
  router.back();
};

onMounted(() => {
  loadTestCase();
});
</script>
