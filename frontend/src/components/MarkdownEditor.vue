<template>
  <div>
    <div ref="editorRef" class="markdown-editor"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import Editor from '@toast-ui/editor';
import '@toast-ui/editor/dist/toastui-editor.css';

const props = defineProps<{
  modelValue: string;
  height?: string;
  placeholder?: string;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
  change: [value: string];
}>();

const editorRef = ref<HTMLElement>();
let editorInstance: Editor | null = null;

onMounted(() => {
  if (!editorRef.value) return;

  editorInstance = new Editor({
    el: editorRef.value,
    height: props.height || '500px',
    initialEditType: 'wysiwyg',
    previewStyle: 'vertical',
    initialValue: props.modelValue || '',
    placeholder: props.placeholder || 'Enter content in markdown...',
    usageStatistics: false,
    toolbarItems: [
      ['heading', 'bold', 'italic', 'strike'],
      ['hr', 'quote'],
      ['ul', 'ol', 'task'],
      ['table', 'link', 'image'],
      ['code', 'codeblock'],
    ],
    events: {
      change: () => {
        if (editorInstance) {
          const markdown = editorInstance.getMarkdown();
          emit('update:modelValue', markdown);
          emit('change', markdown);
        }
      },
    },
  });
});

onBeforeUnmount(() => {
  if (editorInstance) {
    editorInstance.destroy();
  }
});

// Watch for external changes
watch(() => props.modelValue, (newValue) => {
  if (editorInstance && newValue !== editorInstance.getMarkdown()) {
    editorInstance.setMarkdown(newValue);
  }
});

// Expose methods for parent component
defineExpose({
  getMarkdown: () => editorInstance?.getMarkdown() || '',
  setMarkdown: (markdown: string) => editorInstance?.setMarkdown(markdown),
  getHTML: () => editorInstance?.getHTML() || '',
});
</script>

<style>
.markdown-editor {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}

/* Customize Toast UI Editor */
.toastui-editor-defaultUI {
  border: none;
}

.toastui-editor-toolbar {
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.toastui-editor-contents {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 14px;
  line-height: 1.6;
}

.toastui-editor-contents h1 {
  font-size: 28px;
  font-weight: 700;
  margin-top: 24px;
  margin-bottom: 16px;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 8px;
}

.toastui-editor-contents h2 {
  font-size: 24px;
  font-weight: 600;
  margin-top: 20px;
  margin-bottom: 12px;
}

.toastui-editor-contents h3 {
  font-size: 20px;
  font-weight: 600;
  margin-top: 16px;
  margin-bottom: 10px;
}
</style>
