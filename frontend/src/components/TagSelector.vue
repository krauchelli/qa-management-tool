<template>
  <div class="tag-selector">
    <label class="block text-sm font-medium text-gray-700 mb-2">
      Tags
    </label>

    <!-- Selected Tags -->
    <div v-if="selectedTags.length > 0" class="flex flex-wrap gap-2 mb-3">
      <TagBadge
        v-for="tag in selectedTags"
        :key="tag.id"
        :tag="tag"
        :removable="true"
        @remove="removeTag(tag.id)"
      />
    </div>

    <!-- Tag Input with Autocomplete -->
    <div class="relative">
      <input
        v-model="searchQuery"
        @input="handleInput"
        @focus="showDropdown = true"
        @blur="handleBlur"
        type="text"
        placeholder="Type to search or create tag..."
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />

      <!-- Dropdown -->
      <div
        v-if="showDropdown && (filteredTags.length > 0 || searchQuery)"
        class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
      >
        <!-- Existing Tags -->
        <button
          v-for="tag in filteredTags"
          :key="tag.id"
          @mousedown.prevent="selectTag(tag)"
          class="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center justify-between"
        >
          <TagBadge :tag="tag" />
          <span v-if="tag.usageCount" class="text-xs text-gray-500">
            {{ tag.usageCount }} tests
          </span>
        </button>

        <!-- Create New Tag -->
        <button
          v-if="searchQuery && !exactMatch"
          @mousedown.prevent="createNewTag"
          class="w-full px-4 py-2 text-left hover:bg-gray-50 border-t border-gray-200 text-blue-600 font-medium"
        >
          + Create "{{ searchQuery }}"
        </button>

        <!-- No Results -->
        <div
          v-if="filteredTags.length === 0 && !searchQuery"
          class="px-4 py-2 text-gray-500 text-sm"
        >
          No tags available
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useTagStore } from '../stores/tagStore';
import TagBadge from './TagBadge.vue';
import type { Tag } from '../types';

const props = defineProps<{
  modelValue: string[]; // Array of tag IDs
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string[]];
}>();

const tagStore = useTagStore();
const searchQuery = ref('');
const showDropdown = ref(false);

onMounted(async () => {
  if (tagStore.tags.length === 0) {
    await tagStore.fetchTags();
  }
});

const selectedTags = computed(() => {
  return props.modelValue
    .map(id => tagStore.getTagById(id))
    .filter(Boolean) as Tag[];
});

const filteredTags = computed(() => {
  const query = searchQuery.value.toLowerCase();
  return tagStore.tags
    .filter(tag => {
      // Exclude already selected tags
      if (props.modelValue.includes(tag.id)) return false;
      // Filter by search query
      if (query && !tag.name.toLowerCase().includes(query)) return false;
      return true;
    })
    .slice(0, 10); // Limit to 10 results
});

const exactMatch = computed(() => {
  const query = searchQuery.value.toLowerCase();
  return tagStore.tags.some(tag => tag.name.toLowerCase() === query);
});

const handleInput = () => {
  showDropdown.value = true;
};

const handleBlur = () => {
  setTimeout(() => {
    showDropdown.value = false;
  }, 200);
};

const selectTag = (tag: Tag) => {
  emit('update:modelValue', [...props.modelValue, tag.id]);
  searchQuery.value = '';
  showDropdown.value = false;
};

const removeTag = (tagId: string) => {
  emit('update:modelValue', props.modelValue.filter(id => id !== tagId));
};

const createNewTag = async () => {
  try {
    const tag = await tagStore.createTag({
      name: searchQuery.value,
      color: getRandomColor(),
    });
    selectTag(tag);
  } catch (error: any) {
    alert('Failed to create tag: ' + error.message);
  }
};

const getRandomColor = () => {
  const colors = [
    '#EF4444', '#F59E0B', '#10B981', '#3B82F6', 
    '#8B5CF6', '#EC4899', '#06B6D4', '#14B8A6'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};
</script>
