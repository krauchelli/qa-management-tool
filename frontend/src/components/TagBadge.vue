<template>
  <span
    :style="{ backgroundColor: tag.color + '20', color: tag.color, borderColor: tag.color }"
    class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border"
  >
    {{ tag.name }}
    <button
      v-if="removable"
      @click.stop="$emit('remove')"
      class="hover:opacity-70"
      :style="{ color: tag.color }"
    >
      ×
    </button>
  </span>
</template>

<script setup lang="ts">
import type { Tag } from '../types';

defineProps<{
  tag: Tag;
  removable?: boolean;
}>();

defineEmits<{
  remove: [];
}>();
</script>
