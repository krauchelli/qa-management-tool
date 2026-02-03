<template>
  <div ref="viewerRef" class="markdown-viewer"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import Viewer from '@toast-ui/editor/dist/toastui-editor-viewer';
import '@toast-ui/editor/dist/toastui-editor-viewer.css';

const props = defineProps<{
  content: string;
}>();

const viewerRef = ref<HTMLElement>();
let viewerInstance: Viewer | null = null;

onMounted(() => {
  if (!viewerRef.value) return;

  viewerInstance = new Viewer({
    el: viewerRef.value,
    initialValue: props.content || '',
  });
});

onBeforeUnmount(() => {
  if (viewerInstance) {
    viewerInstance.destroy();
  }
});

// Watch for content changes
watch(() => props.content, (newValue) => {
  if (viewerInstance && newValue !== viewerInstance.getMarkdown()) {
    viewerInstance.setMarkdown(newValue);
  }
});
</script>

<style>
.markdown-viewer {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 20px;
  background: white;
  min-height: 200px;
}

/* Customize Toast UI Viewer */
.toastui-editor-contents {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 14px;
  line-height: 1.6;
  color: #374151;
}

.toastui-editor-contents h1 {
  font-size: 28px;
  font-weight: 700;
  margin-top: 24px;
  margin-bottom: 16px;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 8px;
  color: #111827;
}

.toastui-editor-contents h2 {
  font-size: 24px;
  font-weight: 600;
  margin-top: 20px;
  margin-bottom: 12px;
  color: #111827;
}

.toastui-editor-contents h3 {
  font-size: 20px;
  font-weight: 600;
  margin-top: 16px;
  margin-bottom: 10px;
  color: #111827;
}

.toastui-editor-contents p {
  margin-bottom: 12px;
}

.toastui-editor-contents ul,
.toastui-editor-contents ol {
  margin-bottom: 12px;
  padding-left: 24px;
}

.toastui-editor-contents li {
  margin-bottom: 4px;
}

.toastui-editor-contents code {
  background: #f3f4f6;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 13px;
  font-family: 'Courier New', monospace;
  color: #dc2626;
}

.toastui-editor-contents pre {
  background: #1f2937;
  color: #f9fafb;
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
  margin-bottom: 12px;
}

.toastui-editor-contents pre code {
  background: none;
  padding: 0;
  color: inherit;
}

.toastui-editor-contents a {
  color: #2563eb;
  text-decoration: underline;
}

.toastui-editor-contents a:hover {
  color: #1d4ed8;
}

.toastui-editor-contents blockquote {
  border-left: 4px solid #e5e7eb;
  padding-left: 16px;
  margin: 16px 0;
  color: #6b7280;
  font-style: italic;
}

.toastui-editor-contents table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 16px;
}

.toastui-editor-contents th,
.toastui-editor-contents td {
  border: 1px solid #e5e7eb;
  padding: 8px 12px;
  text-align: left;
}

.toastui-editor-contents th {
  background: #f9fafb;
  font-weight: 600;
}

.toastui-editor-contents strong {
  font-weight: 600;
  color: #111827;
}

.toastui-editor-contents em {
  font-style: italic;
}

.toastui-editor-contents hr {
  border: none;
  border-top: 2px solid #e5e7eb;
  margin: 24px 0;
}
</style>
