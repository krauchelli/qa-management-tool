<template>
  <div>
    <!-- Header -->
    <div class="mb-6 flex items-center justify-between">
      <h2 class="text-3xl font-bold text-gray-900">Tag Management</h2>
      <button
        @click="showCreateModal = true"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        + Create Tag
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading && tags.length === 0" class="text-center py-12">
      <p class="text-gray-600">Loading tags...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <p class="text-red-800">{{ error }}</p>
    </div>

    <!-- Tags by Category -->
    <div v-else class="space-y-6">
      <div v-for="(categoryTags, category) in tagsByCategory" :key="category" class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4 capitalize">
          {{ category === 'uncategorized' ? 'Uncategorized' : category }}
        </h3>
        <div class="space-y-3">
          <div
            v-for="tag in categoryTags"
            :key="tag.id"
            class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
          >
            <div class="flex items-center gap-3">
              <TagBadge :tag="tag" />
              <span class="text-sm text-gray-600">
                {{ tag.usageCount || 0 }} test{{ (tag.usageCount || 0) !== 1 ? 's' : '' }}
              </span>
            </div>
            <div class="flex gap-2">
              <button
                @click="editTag(tag)"
                class="px-3 py-1 text-sm text-blue-600 hover:text-blue-800"
              >
                Edit
              </button>
              <button
                @click="deleteTag(tag)"
                class="px-3 py-1 text-sm text-red-600 hover:text-red-800"
                :disabled="(tag.usageCount || 0) > 0"
                :class="{ 'opacity-50 cursor-not-allowed': (tag.usageCount || 0) > 0 }"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="Object.keys(tagsByCategory).length === 0" class="text-center py-12">
        <p class="text-gray-600">No tags yet. Create your first tag!</p>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div
      v-if="showCreateModal || editingTag"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="closeModal"
    >
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 class="text-xl font-semibold text-gray-900 mb-4">
          {{ editingTag ? 'Edit Tag' : 'Create New Tag' }}
        </h3>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Tag Name *
            </label>
            <input
              v-model="formData.name"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="e.g., regression"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Color
            </label>
            <div class="flex gap-2">
              <input
                v-model="formData.color"
                type="color"
                class="h-10 w-20 border border-gray-300 rounded cursor-pointer"
              />
              <input
                v-model="formData.color"
                type="text"
                class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="#3B82F6"
              />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              v-model="formData.category"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">Uncategorized</option>
              <option value="test-type">Test Type</option>
              <option value="priority">Priority</option>
              <option value="feature">Feature</option>
            </select>
          </div>
          <div class="flex gap-2 pt-4">
            <button
              type="submit"
              :disabled="submitting"
              class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              {{ submitting ? 'Saving...' : (editingTag ? 'Update' : 'Create') }}
            </button>
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useTagStore } from '../stores/tagStore';
import TagBadge from '../components/TagBadge.vue';
import type { Tag } from '../types';

const tagStore = useTagStore();

const showCreateModal = ref(false);
const editingTag = ref<Tag | null>(null);
const submitting = ref(false);

const formData = ref({
  name: '',
  color: '#3B82F6',
  category: ''
});

const tags = computed(() => tagStore.tags);
const loading = computed(() => tagStore.loading);
const error = computed(() => tagStore.error);
const tagsByCategory = computed(() => tagStore.tagsByCategory);

onMounted(async () => {
  await tagStore.fetchTags();
});

const editTag = (tag: Tag) => {
  editingTag.value = tag;
  formData.value = {
    name: tag.name,
    color: tag.color,
    category: tag.category || ''
  };
};

const deleteTag = async (tag: Tag) => {
  if ((tag.usageCount || 0) > 0) {
    alert('Cannot delete tag that is in use');
    return;
  }

  if (!confirm(`Are you sure you want to delete "${tag.name}"?`)) {
    return;
  }

  try {
    await tagStore.deleteTag(tag.id);
  } catch (err: any) {
    alert('Failed to delete tag: ' + err.message);
  }
};

const handleSubmit = async () => {
  submitting.value = true;
  try {
    if (editingTag.value) {
      await tagStore.updateTag(editingTag.value.id, {
        name: formData.value.name,
        color: formData.value.color,
        category: formData.value.category || undefined
      });
    } else {
      await tagStore.createTag({
        name: formData.value.name,
        color: formData.value.color,
        category: formData.value.category || undefined
      });
    }
    closeModal();
  } catch (err: any) {
    alert('Failed to save tag: ' + err.message);
  } finally {
    submitting.value = false;
  }
};

const closeModal = () => {
  showCreateModal.value = false;
  editingTag.value = null;
  formData.value = {
    name: '',
    color: '#3B82F6',
    category: ''
  };
};
</script>
