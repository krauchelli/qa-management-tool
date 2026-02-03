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
          <div v-if="test.tags && test.tags.length > 0" class="md:col-span-2">
            <p class="text-sm text-gray-600 mb-2">Tags</p>
            <div class="flex flex-wrap gap-2">
              <TagBadge
                v-for="testTag in test.tags"
                :key="testTag.id"
                :tag="testTag.tag"
              />
            </div>
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
          <div class="flex gap-2">
            <!-- Copy Buttons (only show in view mode) -->
            <button
              v-if="!editingDetails && details"
              @click="copyMarkdown"
              class="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm flex items-center gap-1"
              title="Copy as Markdown (for Obsidian, etc)"
            >
              📋 Copy Markdown
            </button>
            <button
              v-if="!editingDetails && details"
              @click="copyDiscord"
              class="px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 text-sm flex items-center gap-1"
              title="Copy for Discord (headers converted to bold)"
            >
              💬 Copy for Discord
            </button>
            <!-- Edit Button -->
            <button
              v-if="!editingDetails"
              @click="loadDetails"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
            >
              {{ details ? 'Edit Details' : 'Add Details' }}
            </button>
          </div>
        </div>

        <!-- Details Editor with Navigation -->
        <div v-if="editingDetails" class="flex gap-6">
          <!-- Header Navigation Sidebar -->
          <aside v-if="headers.length > 0" class="w-64 flex-shrink-0">
            <div class="sticky top-4 bg-gray-50 rounded-lg p-4">
              <h4 class="font-semibold text-gray-900 mb-3">Contents</h4>
              <nav class="space-y-1">
                <a
                  v-for="header in headers"
                  :key="header.id"
                  :href="`#${header.id}`"
                  :style="{ paddingLeft: `${(header.level - 1) * 12}px` }"
                  class="block text-sm text-gray-700 hover:text-blue-600 hover:bg-gray-100 px-2 py-1 rounded"
                >
                  {{ header.text }}
                </a>
              </nav>
            </div>
          </aside>

          <!-- Editor -->
          <div class="flex-1">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Title (for table display)
              </label>
              <input
                v-model="detailsForm.title"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Short title for table notes column"
              />
            </div>
            
            <MarkdownEditor
              v-model="detailsForm.content"
              height="600px"
              placeholder="Enter test details in markdown..."
              @change="extractHeaders"
            />
            
            <div class="flex gap-2 mt-4">
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
        </div>

        <!-- Details Display -->
        <div v-else-if="details" class="flex gap-6">
          <!-- Header Navigation Sidebar -->
          <aside v-if="displayHeaders.length > 0" class="w-64 flex-shrink-0">
            <div class="sticky top-4 bg-gray-50 rounded-lg p-4">
              <h4 class="font-semibold text-gray-900 mb-3">Contents</h4>
              <nav class="space-y-1">
                <a
                  v-for="header in displayHeaders"
                  :key="header.id"
                  :href="`#${header.id}`"
                  :style="{ paddingLeft: `${(header.level - 1) * 12}px` }"
                  class="block text-sm text-gray-700 hover:text-blue-600 hover:bg-gray-100 px-2 py-1 rounded"
                >
                  {{ header.text }}
                </a>
              </nav>
            </div>
          </aside>

          <!-- Content Display with Toast UI Viewer -->
          <div class="flex-1">
            <h4 class="font-medium text-gray-900 mb-4">{{ details.title }}</h4>
            <MarkdownViewer :content="details.content" />
            <p class="text-xs text-gray-500 mt-2">
              💡 Tip: You can copy the content with markdown formatting preserved
            </p>
          </div>
        </div>
        
        <p v-else class="text-gray-600 text-center py-4">No test details added yet</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useTestStore } from '@/stores/testStore';
import TagBadge from '@/components/TagBadge.vue';
import MarkdownEditor from '@/components/MarkdownEditor.vue';
import MarkdownViewer from '@/components/MarkdownViewer.vue';
import type { Test, Detail } from '@/types';
import { testService } from '@/services/testService';
import { convertToDiscordFormat, copyToClipboard } from '@/utils/discordFormatter';

interface Header {
  level: number;
  text: string;
  id: string;
}

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
const headers = ref<Header[]>([]);

const newEvidence = ref({
  type: '',
  url: '',
  description: ''
});

const detailsForm = ref({
  title: '',
  content: ''
});

// Computed: Extract headers from displayed content
const displayHeaders = computed(() => {
  if (!details.value?.content) return [];
  return extractHeadersFromMarkdown(details.value.content);
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
    headers.value = extractHeadersFromMarkdown(response.content);
    editingDetails.value = true;
  } catch (err) {
    // No details yet, start with empty form and template
    const template = `# Test Details

## Test Scenario
Describe what you're testing...

## Test Steps
1. Step 1
2. Step 2
3. Step 3

## Expected Results
What should happen...

## Actual Results
What actually happened...

## Evidence
- Link to recording or screenshot

## Root Cause
Analysis of the issue (if failed)...
`;
    detailsForm.value = {
      title: '',
      content: template
    };
    headers.value = extractHeadersFromMarkdown(template);
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

// Extract headers from markdown
const extractHeadersFromMarkdown = (markdown: string): Header[] => {
  const headerRegex = /^(#{1,6})\s+(.+)$/gm;
  const result: Header[] = [];
  
  let match;
  while ((match = headerRegex.exec(markdown)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = text.toLowerCase().replace(/[^\w]+/g, '-');
    result.push({ level, text, id });
  }
  
  return result;
};

// Extract headers when content changes
const extractHeaders = (markdown: string) => {
  headers.value = extractHeadersFromMarkdown(markdown);
};

// Copy functions
const copyMarkdown = async () => {
  if (!details.value?.content) return;
  
  const success = await copyToClipboard(details.value.content);
  if (success) {
    alert('✅ Copied as Markdown!');
  } else {
    alert('❌ Failed to copy');
  }
};

const copyDiscord = async () => {
  const content = details.value?.content;
  if (!content) return;
  
  const discordFormat = convertToDiscordFormat(content);
  const success = await copyToClipboard(discordFormat);
  if (success) {
    alert('✅ Copied for Discord!');
  } else {
    alert('❌ Failed to copy');
  }
};
</script>


<style scoped>
.prose {
  color: #374151;
}

.prose h1 {
  font-size: 28px;
  font-weight: 700;
  margin-top: 24px;
  margin-bottom: 16px;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 8px;
}

.prose h2 {
  font-size: 24px;
  font-weight: 600;
  margin-top: 20px;
  margin-bottom: 12px;
}

.prose h3 {
  font-size: 20px;
  font-weight: 600;
  margin-top: 16px;
  margin-bottom: 10px;
}

.prose p {
  margin-bottom: 12px;
  line-height: 1.6;
}

.prose ul, .prose ol {
  margin-bottom: 12px;
  padding-left: 24px;
}

.prose li {
  margin-bottom: 4px;
}

.prose code {
  background: #f3f4f6;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 13px;
  font-family: 'Courier New', monospace;
}

.prose pre {
  background: #1f2937;
  color: #f9fafb;
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
  margin-bottom: 12px;
}

.prose pre code {
  background: none;
  padding: 0;
  color: inherit;
}

.prose a {
  color: #2563eb;
  text-decoration: underline;
}

.prose a:hover {
  color: #1d4ed8;
}

.prose blockquote {
  border-left: 4px solid #e5e7eb;
  padding-left: 16px;
  margin: 16px 0;
  color: #6b7280;
  font-style: italic;
}

.prose table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 16px;
}

.prose th, .prose td {
  border: 1px solid #e5e7eb;
  padding: 8px 12px;
  text-align: left;
}

.prose th {
  background: #f9fafb;
  font-weight: 600;
}
</style>
