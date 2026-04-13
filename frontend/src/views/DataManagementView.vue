<template>
  <div>
    <h2 class="text-3xl font-bold text-gray-900 mb-8">Data Management</h2>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Export Section -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-xl font-semibold text-gray-900 mb-4">📤 Export Data</h3>
        <p class="text-sm text-gray-600 mb-6">
          Export all tests, test cases, tags, details, and evidence. Use this to backup your data or migrate to another device.
        </p>

        <!-- Current Data Summary -->
        <div v-if="preview" class="mb-6 p-4 bg-gray-50 rounded-lg">
          <p class="text-sm font-medium text-gray-700 mb-2">Current Data</p>
          <div class="grid grid-cols-3 gap-2 text-sm">
            <div><span class="text-gray-500">Tests:</span> <span class="font-medium">{{ preview.tests }}</span></div>
            <div><span class="text-gray-500">Test Cases:</span> <span class="font-medium">{{ preview.testCases }}</span></div>
            <div><span class="text-gray-500">Tags:</span> <span class="font-medium">{{ preview.tags }}</span></div>
            <div><span class="text-gray-500">Details:</span> <span class="font-medium">{{ preview.details }}</span></div>
            <div><span class="text-gray-500">Evidence:</span> <span class="font-medium">{{ preview.evidence }}</span></div>
          </div>
        </div>

        <div class="flex gap-3">
          <button
            @click="handleExportJSON"
            :disabled="exporting"
            class="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-medium text-sm"
          >
            {{ exporting === 'json' ? 'Exporting...' : '📄 Export JSON' }}
          </button>
          <button
            @click="handleExportZIP"
            :disabled="exporting"
            class="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 font-medium text-sm"
          >
            {{ exporting === 'zip' ? 'Exporting...' : '📦 Export ZIP' }}
          </button>
        </div>
        <p class="text-xs text-gray-400 mt-3">
          JSON = raw data for import. ZIP = JSON + readable markdown files.
        </p>
      </div>

      <!-- Import Section -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-xl font-semibold text-gray-900 mb-4">📥 Import Data</h3>
        <p class="text-sm text-gray-600 mb-6">
          Import from a previously exported JSON file. Choose merge to add/update, or replace to wipe and restore.
        </p>

        <!-- Import Mode -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Import Mode</label>
          <div class="flex gap-2">
            <button
              @click="importMode = 'merge'"
              :class="[
                'flex-1 px-4 py-2 rounded-lg text-sm font-medium border',
                importMode === 'merge'
                  ? 'bg-blue-50 border-blue-300 text-blue-700'
                  : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
              ]"
            >
              🔀 Merge
              <span class="block text-xs font-normal mt-0.5">Add new, update existing</span>
            </button>
            <button
              @click="importMode = 'replace'"
              :class="[
                'flex-1 px-4 py-2 rounded-lg text-sm font-medium border',
                importMode === 'replace'
                  ? 'bg-red-50 border-red-300 text-red-700'
                  : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
              ]"
            >
              ♻️ Replace
              <span class="block text-xs font-normal mt-0.5">Wipe all, then import</span>
            </button>
          </div>
        </div>

        <!-- File Input -->
        <div
          class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
          @click="triggerFileInput"
          @drop.prevent="handleFileDrop"
          @dragover.prevent
        >
          <input
            ref="fileInput"
            type="file"
            accept=".json"
            class="hidden"
            @change="handleFileSelect"
          />
          <div v-if="!importFile">
            <p class="text-gray-500 text-sm">Click or drag a .json export file here</p>
          </div>
          <div v-else>
            <p class="text-gray-900 font-medium text-sm">📄 {{ importFile.name }}</p>
            <p class="text-gray-500 text-xs mt-1">{{ formatFileSize(importFile.size) }}</p>
          </div>
        </div>

        <!-- Import Preview -->
        <div v-if="importPreview" class="mt-4 p-4 bg-gray-50 rounded-lg">
          <p class="text-sm font-medium text-gray-700 mb-2">File Contents</p>
          <div class="grid grid-cols-3 gap-2 text-sm">
            <div><span class="text-gray-500">Tests:</span> <span class="font-medium">{{ importPreview.tests }}</span></div>
            <div><span class="text-gray-500">Test Cases:</span> <span class="font-medium">{{ importPreview.testCases }}</span></div>
            <div><span class="text-gray-500">Tags:</span> <span class="font-medium">{{ importPreview.tags }}</span></div>
            <div><span class="text-gray-500">Details:</span> <span class="font-medium">{{ importPreview.details }}</span></div>
            <div><span class="text-gray-500">Evidence:</span> <span class="font-medium">{{ importPreview.evidence }}</span></div>
          </div>
        </div>

        <!-- Replace Warning -->
        <div v-if="importMode === 'replace' && importFile" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-red-800 text-sm font-medium">⚠️ Replace mode will delete ALL existing data before importing.</p>
        </div>

        <button
          @click="handleImport"
          :disabled="!importFile || importing"
          class="w-full mt-4 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 font-medium text-sm"
        >
          {{ importing ? 'Importing...' : `Import (${importMode})` }}
        </button>

        <!-- Import Result -->
        <div v-if="importResult" class="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p class="text-green-800 font-medium text-sm mb-2">✅ Import Complete</p>
          <div class="grid grid-cols-2 gap-1 text-xs">
            <div v-for="(count, key) in importResult.imported" :key="key">
              <span class="text-gray-600">{{ key }}:</span>
              <span class="text-green-700 font-medium"> {{ count }} imported</span>
              <span v-if="importResult.skipped[key]" class="text-yellow-600">, {{ importResult.skipped[key] }} skipped</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { dataService } from '../services/dataService';

const preview = ref<Record<string, number> | null>(null);
const exporting = ref<string | false>(false);
const importMode = ref<'merge' | 'replace'>('merge');
const importFile = ref<File | null>(null);
const importData = ref<any>(null);
const importPreview = ref<Record<string, number> | null>(null);
const importing = ref(false);
const importResult = ref<any>(null);
const fileInput = ref<HTMLInputElement | null>(null);

const triggerFileInput = () => {
  fileInput.value?.click();
};

onMounted(async () => {
  try {
    preview.value = await dataService.getPreview();
  } catch {
    // silent
  }
});

const handleExportJSON = async () => {
  exporting.value = 'json';
  try {
    await dataService.exportJSON();
  } catch (err: any) {
    alert('Export failed: ' + err.message);
  } finally {
    exporting.value = false;
  }
};

const handleExportZIP = async () => {
  exporting.value = 'zip';
  try {
    await dataService.exportZIP();
  } catch (err: any) {
    alert('Export failed: ' + err.message);
  } finally {
    exporting.value = false;
  }
};

const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files?.[0]) {
    processFile(input.files[0]);
  }
};

const handleFileDrop = (event: DragEvent) => {
  const file = event.dataTransfer?.files[0];
  if (file && file.name.endsWith('.json')) {
    processFile(file);
  }
};

const processFile = async (file: File) => {
  importFile.value = file;
  importResult.value = null;
  try {
    const text = await file.text();
    const data = JSON.parse(text);
    importData.value = data;
    if (data.data) {
      importPreview.value = {
        tests: data.data.tests?.length || 0,
        testCases: data.data.testCases?.length || 0,
        tags: data.data.tags?.length || 0,
        details: data.data.details?.length || 0,
        evidence: data.data.evidence?.length || 0,
      };
    }
  } catch {
    alert('Invalid JSON file');
    importFile.value = null;
    importData.value = null;
    importPreview.value = null;
  }
};

const handleImport = async () => {
  if (!importData.value) return;
  if (importMode.value === 'replace') {
    if (!confirm('This will DELETE ALL existing data and replace with the imported data. Are you sure?')) return;
  }
  importing.value = true;
  importResult.value = null;
  try {
    const result = await dataService.importJSON(importData.value, importMode.value);
    importResult.value = result;
    // Refresh preview
    preview.value = await dataService.getPreview();
  } catch (err: any) {
    alert('Import failed: ' + err.message);
  } finally {
    importing.value = false;
  }
};

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};
</script>
