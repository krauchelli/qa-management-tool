<template>
  <div>
    <!-- Header -->
    <div class="mb-6">
      <button
        @click="router.back()"
        class="text-blue-600 hover:text-blue-800 mb-4 flex items-center gap-2"
      >
        ← Back
      </button>
      <h2 class="text-3xl font-bold text-gray-900">
        {{ isEdit ? 'Edit Test' : 'Add New Test' }}
      </h2>
    </div>

    <!-- Form -->
    <div class="bg-white rounded-lg shadow p-6">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Test Date -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Test Date *
          </label>
          <input
            v-model="form.date"
            type="date"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <!-- Feature Name -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Feature Name *
          </label>
          <input
            v-model="form.feature"
            type="text"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Enter feature name"
          />
        </div>

        <!-- JIRA Ticket -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            JIRA Ticket
          </label>
          <input
            v-model="form.jira"
            type="text"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="e.g., PROJ-123"
          />
        </div>

        <!-- JIRA URL -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            JIRA URL
          </label>
          <input
            v-model="form.jiraUrl"
            type="url"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="https://jira.example.com/browse/PROJ-123"
          />
        </div>

        <!-- Environment -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Environment *
          </label>
          <select
            v-model="form.env"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">Select environment</option>
            <option value="DEV">Development</option>
            <option value="STAGING">Staging</option>
            <option value="PROD">Production</option>
          </select>
        </div>

        <!-- Status -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Status *
          </label>
          <select
            v-model="form.status"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">Select status</option>
            <option value="PASSED">Passed</option>
            <option value="FAILED">Failed</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="NEED_CONFIRMATION">Need Confirmation</option>
          </select>
        </div>

        <!-- Notes -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Notes
          </label>
          <textarea
            v-model="form.notes"
            rows="4"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Add any additional notes..."
          ></textarea>
        </div>

        <!-- Tags -->
        <div>
          <TagSelector v-model="form.tagIds" />
        </div>

        <!-- Test Details Section -->
        <div class="border-t pt-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Test Details (Optional)</h3>
          
          <!-- Mode Selection -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Details Mode
            </label>
            <div class="flex gap-2">
              <button
                type="button"
                @click="form.detailsMode = 'none'"
                :class="[
                  'px-4 py-2 rounded-lg text-sm font-medium',
                  form.detailsMode === 'none' ? 'bg-gray-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                ]"
              >
                No Details
              </button>
              <button
                type="button"
                @click="form.detailsMode = 'formatted'"
                :class="[
                  'px-4 py-2 rounded-lg text-sm font-medium',
                  form.detailsMode === 'formatted' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                ]"
              >
                📝 Formatted (Form Fields)
              </button>
              <button
                type="button"
                @click="form.detailsMode = 'free'"
                :class="[
                  'px-4 py-2 rounded-lg text-sm font-medium',
                  form.detailsMode === 'free' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                ]"
              >
                ✍️ Free Mode (Markdown Editor)
              </button>
            </div>
          </div>

          <!-- Formatted Mode -->
          <div v-if="form.detailsMode === 'formatted'" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Test Scenario
              </label>
              <textarea
                v-model="form.testScenario"
                rows="2"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Describe what you're testing..."
              ></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Test Steps
              </label>
              <textarea
                v-model="form.testSteps"
                rows="4"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="1. Step 1&#10;2. Step 2&#10;3. Step 3"
              ></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Expected Results
              </label>
              <textarea
                v-model="form.expectedResults"
                rows="2"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="What should happen..."
              ></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Actual Results
              </label>
              <textarea
                v-model="form.actualResults"
                rows="2"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="What actually happened..."
              ></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Root Cause (if failed)
              </label>
              <textarea
                v-model="form.rootCause"
                rows="2"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Analysis of the issue..."
              ></textarea>
            </div>
          </div>

          <!-- Free Mode -->
          <div v-if="form.detailsMode === 'free'">
            <MarkdownEditor
              v-model="form.detailsContent"
              height="400px"
              placeholder="Enter test details in markdown..."
            />
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-4 pt-4">
          <button
            type="submit"
            :disabled="loading"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {{ loading ? 'Saving...' : (isEdit ? 'Update Test' : 'Create Test') }}
          </button>
          <button
            type="button"
            @click="router.back()"
            class="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-red-800">{{ error }}</p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useTestStore } from '@/stores/testStore';
import TagSelector from '@/components/TagSelector.vue';
import MarkdownEditor from '@/components/MarkdownEditor.vue';
import { testService } from '@/services/testService';
import type { TestStatus, TestEnv } from '@/types';

const route = useRoute();
const router = useRouter();
const testStore = useTestStore();

const isEdit = computed(() => route.name === 'EditTest');
const testId = computed(() => route.params.id as string);

const loading = ref(false);
const error = ref('');

const form = ref({
  date: '',
  feature: '',
  jira: '',
  jiraUrl: '',
  env: '' as TestEnv | '',
  status: '' as TestStatus | '',
  notes: '',
  tagIds: [] as string[],
  // Details
  detailsMode: 'none' as 'none' | 'formatted' | 'free',
  detailsTitle: '',
  detailsContent: '',
  // Formatted mode fields
  testScenario: '',
  testSteps: '',
  expectedResults: '',
  actualResults: '',
  rootCause: '',
});

// Load test data if editing
onMounted(async () => {
  if (isEdit.value && testId.value) {
    loading.value = true;
    try {
      await testStore.fetchTest(testId.value);
      const test = testStore.currentTest;
      if (test) {
        form.value = {
          date: test.date,
          feature: test.feature,
          jira: test.jira || '',
          jiraUrl: test.jiraUrl || '',
          env: test.env,
          status: test.status,
          notes: test.notes || '',
          tagIds: test.tags?.map(tt => tt.tag.id) || []
        };
      }
    } catch (err) {
      error.value = 'Failed to load test data';
    } finally {
      loading.value = false;
    }
  } else {
    // Set default date to today
    form.value.date = new Date().toISOString().split('T')[0];
  }
});

const handleSubmit = async () => {
  loading.value = true;
  error.value = '';

  try {
    let savedTestId: string;
    
    // Generate details content based on mode
    let detailsContent = '';
    let detailsTitle = '';
    
    if (form.value.detailsMode === 'formatted') {
      // Generate markdown from form fields
      detailsContent = `# Test Details

## Test Scenario
${form.value.testScenario || 'N/A'}

## Test Steps
${form.value.testSteps || 'N/A'}

## Expected Results
${form.value.expectedResults || 'N/A'}

## Actual Results
${form.value.actualResults || 'N/A'}

${form.value.rootCause ? `## Root Cause\n${form.value.rootCause}` : ''}`;
      
      detailsTitle = 'Test Details';
    } else if (form.value.detailsMode === 'free') {
      detailsContent = form.value.detailsContent;
      // Extract first header as title
      const firstHeader = detailsContent.match(/^#\s+(.+)$/m);
      detailsTitle = firstHeader ? firstHeader[1] : 'Test Details';
    }
    
    if (isEdit.value && testId.value) {
      await testStore.updateTest(testId.value, {
        date: form.value.date,
        feature: form.value.feature,
        jira: form.value.jira || undefined,
        jiraUrl: form.value.jiraUrl || undefined,
        env: form.value.env as TestEnv,
        status: form.value.status as TestStatus,
        notes: form.value.notes || undefined
      });
      savedTestId = testId.value;
      
      // Update details if provided
      if (form.value.detailsMode !== 'none' && detailsContent) {
        try {
          await testService.updateDetails(savedTestId, {
            title: detailsTitle,
            content: detailsContent
          });
        } catch (err) {
          // Details don't exist yet, create them
          await testService.createDetails({
            testId: savedTestId,
            title: detailsTitle,
            content: detailsContent
          });
        }
      }
    } else {
      const newTest = await testStore.createTest({
        date: form.value.date,
        feature: form.value.feature,
        jira: form.value.jira || undefined,
        jiraUrl: form.value.jiraUrl || undefined,
        env: form.value.env as TestEnv,
        status: form.value.status as TestStatus,
        notes: form.value.notes || undefined
      });
      savedTestId = newTest.id;
      
      // Create details if provided
      if (form.value.detailsMode !== 'none' && detailsContent) {
        await testService.createDetails({
          testId: savedTestId,
          title: detailsTitle,
          content: detailsContent
        });
      }
    }
    
    // Update tags
    if (form.value.tagIds.length > 0) {
      await testStore.updateTestTags(savedTestId, form.value.tagIds);
    }
    
    router.push('/tests');
  } catch (err: any) {
    error.value = err.message || 'Failed to save test';
  } finally {
    loading.value = false;
  }
};
</script>
