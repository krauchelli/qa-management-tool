# Toast UI Editor Integration Guide

**Created:** 2026-02-03  
**Status:** 📋 Planning  
**For Feature:** Details with Header Navigation

---

## Why Toast UI Editor?

### ✅ Perfect for Our Use Case

1. **Native Markdown Support**
   - Stores content as pure markdown (no conversion)
   - Perfect for Obsidian compatibility
   - No data loss during edit/save cycles

2. **Dual Mode Editing**
   - WYSIWYG mode for non-technical users
   - Markdown mode for power users
   - Toggle between modes seamlessly

3. **Built-in Preview**
   - Live preview while editing
   - Side-by-side or tab view
   - Renders markdown in real-time

4. **Rich Toolbar**
   - Headers (H1, H2, H3) for navigation
   - Bold, italic, strikethrough
   - Lists (ordered, unordered, task)
   - Links, images, code blocks
   - Tables, quotes, horizontal rules

5. **Vue 3 Compatible**
   - Official Vue wrapper: `@toast-ui/vue-editor`
   - TypeScript support
   - Easy integration

---

## Installation

### NPM Packages

```bash
cd frontend
npm install @toast-ui/editor @toast-ui/vue-editor
```

### Package Versions

```json
{
  "@toast-ui/editor": "^3.2.2",
  "@toast-ui/vue-editor": "^3.2.2"
}
```

---

## Basic Setup

### 1. Import in Component

```vue
<script setup lang="ts">
import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor } from '@toast-ui/vue-editor';
import { ref } from 'vue';

const editorRef = ref<InstanceType<typeof Editor>>();
const content = ref('# Test Details\n\nEnter your test details here...');

const handleChange = () => {
  if (editorRef.value) {
    const markdown = editorRef.value.invoke('getMarkdown');
    console.log('Current markdown:', markdown);
  }
};

const handleSave = () => {
  if (editorRef.value) {
    const markdown = editorRef.value.invoke('getMarkdown');
    // Save to API
    saveDetails(markdown);
  }
};
</script>

<template>
  <div>
    <Editor
      ref="editorRef"
      :initialValue="content"
      initialEditType="wysiwyg"
      previewStyle="vertical"
      height="500px"
      :usageStatistics="false"
      @change="handleChange"
    />
    <button @click="handleSave">Save</button>
  </div>
</template>
```

---

## Configuration Options

### Full Configuration

```typescript
const editorOptions = {
  // Initial content
  initialValue: '# Test Details\n\nStart writing...',
  
  // Edit mode: 'markdown' or 'wysiwyg'
  initialEditType: 'wysiwyg',
  
  // Preview style: 'tab' or 'vertical'
  previewStyle: 'vertical',
  
  // Editor height
  height: '500px',
  
  // Disable usage statistics
  usageStatistics: false,
  
  // Toolbar items
  toolbarItems: [
    ['heading', 'bold', 'italic', 'strike'],
    ['hr', 'quote'],
    ['ul', 'ol', 'task', 'indent', 'outdent'],
    ['table', 'link', 'image'],
    ['code', 'codeblock']
  ],
  
  // Placeholder text
  placeholder: 'Enter test details in markdown...',
  
  // Auto focus
  autofocus: false,
  
  // Language (for UI)
  language: 'en-US',
  
  // Use command shortcut
  useCommandShortcut: true,
  
  // Hide mode switch button
  hideModeSwitch: false
};
```

---

## Custom Toolbar

### QA-Specific Toolbar

```typescript
const qaToolbarItems = [
  // Headers for navigation
  ['heading'],
  
  // Text formatting
  ['bold', 'italic', 'strike'],
  
  // Separators and quotes
  ['hr', 'quote'],
  
  // Lists (important for test steps)
  ['ul', 'ol', 'task'],
  
  // Links and images (for evidence)
  ['link', 'image'],
  
  // Code blocks (for API responses, logs)
  ['code', 'codeblock'],
  
  // Tables (for test data)
  ['table']
];
```

---

## API Methods

### Get Content

```typescript
// Get markdown
const markdown = editorRef.value.invoke('getMarkdown');

// Get HTML (if needed)
const html = editorRef.value.invoke('getHTML');
```

### Set Content

```typescript
// Set markdown
editorRef.value.invoke('setMarkdown', '# New Content');

// Set HTML (converts to markdown)
editorRef.value.invoke('setHTML', '<h1>New Content</h1>');
```

### Insert Content

```typescript
// Insert text at cursor
editorRef.value.invoke('insertText', 'Inserted text');

// Insert markdown
editorRef.value.invoke('insertMarkdown', '## New Section');
```

### Editor State

```typescript
// Get current mode
const mode = editorRef.value.invoke('getCurrentModeEditor');

// Switch mode
editorRef.value.invoke('changeMode', 'markdown'); // or 'wysiwyg'

// Focus editor
editorRef.value.invoke('focus');

// Blur editor
editorRef.value.invoke('blur');
```

---

## Header Extraction

### Parse Headers from Markdown

```typescript
function extractHeaders(markdown: string) {
  const headerRegex = /^(#{1,6})\s+(.+)$/gm;
  const headers: Array<{ level: number; text: string; id: string }> = [];
  
  let match;
  while ((match = headerRegex.exec(markdown)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = text.toLowerCase().replace(/[^\w]+/g, '-');
    
    headers.push({ level, text, id });
  }
  
  return headers;
}

// Usage
const markdown = editorRef.value.invoke('getMarkdown');
const headers = extractHeaders(markdown);

// Result:
// [
//   { level: 1, text: 'Test Details', id: 'test-details' },
//   { level: 2, text: 'Test Scenario', id: 'test-scenario' },
//   { level: 2, text: 'Expected Results', id: 'expected-results' }
// ]
```

---

## Integration with Detail View

### Complete Component Example

```vue
<script setup lang="ts">
import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor } from '@toast-ui/vue-editor';
import { ref, computed, onMounted } from 'vue';
import { testService } from '@/services/testService';

const props = defineProps<{
  testId: string;
}>();

const editorRef = ref<InstanceType<typeof Editor>>();
const content = ref('');
const headers = ref<Array<{ level: number; text: string; id: string }>>([]);
const saving = ref(false);

// Extract headers from markdown
const extractHeaders = (markdown: string) => {
  const headerRegex = /^(#{1,6})\s+(.+)$/gm;
  const result: Array<{ level: number; text: string; id: string }> = [];
  
  let match;
  while ((match = headerRegex.exec(markdown)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = text.toLowerCase().replace(/[^\w]+/g, '-');
    result.push({ level, text, id });
  }
  
  return result;
};

// Handle content change
const handleChange = () => {
  if (editorRef.value) {
    const markdown = editorRef.value.invoke('getMarkdown');
    headers.value = extractHeaders(markdown);
  }
};

// Save details
const handleSave = async () => {
  if (!editorRef.value) return;
  
  saving.value = true;
  try {
    const markdown = editorRef.value.invoke('getMarkdown');
    const firstHeader = headers.value[0]?.text || 'Test Details';
    
    await testService.updateDetails(props.testId, {
      title: firstHeader,
      content: markdown
    });
    
    alert('Details saved successfully!');
  } catch (error) {
    alert('Failed to save details');
  } finally {
    saving.value = false;
  }
};

// Load existing details
onMounted(async () => {
  try {
    const details = await testService.getDetails(props.testId);
    content.value = details.content;
    headers.value = extractHeaders(details.content);
  } catch (error) {
    // No details yet, use template
    content.value = `# Test Details

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
- [Link to recording](#)
- [Screenshot](#)

## Root Cause
Analysis of the issue...
`;
    headers.value = extractHeaders(content.value);
  }
});
</script>

<template>
  <div class="detail-editor">
    <!-- Header Navigation -->
    <aside class="navigation">
      <h3>Contents</h3>
      <ul>
        <li
          v-for="header in headers"
          :key="header.id"
          :style="{ paddingLeft: `${(header.level - 1) * 16}px` }"
        >
          <a :href="`#${header.id}`">{{ header.text }}</a>
        </li>
      </ul>
    </aside>

    <!-- Editor -->
    <main class="editor-container">
      <div class="editor-toolbar">
        <button @click="handleSave" :disabled="saving">
          {{ saving ? 'Saving...' : 'Save Details' }}
        </button>
      </div>
      
      <Editor
        ref="editorRef"
        :initialValue="content"
        initialEditType="wysiwyg"
        previewStyle="vertical"
        height="600px"
        :usageStatistics="false"
        :toolbarItems="[
          ['heading', 'bold', 'italic', 'strike'],
          ['hr', 'quote'],
          ['ul', 'ol', 'task'],
          ['table', 'link', 'image'],
          ['code', 'codeblock']
        ]"
        placeholder="Enter test details in markdown..."
        @change="handleChange"
      />
    </main>
  </div>
</template>

<style scoped>
.detail-editor {
  display: flex;
  gap: 24px;
}

.navigation {
  width: 250px;
  position: sticky;
  top: 20px;
  height: fit-content;
}

.navigation h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
}

.navigation ul {
  list-style: none;
  padding: 0;
}

.navigation li {
  margin-bottom: 8px;
}

.navigation a {
  color: #3b82f6;
  text-decoration: none;
  font-size: 14px;
}

.navigation a:hover {
  text-decoration: underline;
}

.editor-container {
  flex: 1;
}

.editor-toolbar {
  margin-bottom: 16px;
  display: flex;
  justify-content: flex-end;
}

.editor-toolbar button {
  padding: 8px 16px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.editor-toolbar button:hover {
  background: #2563eb;
}

.editor-toolbar button:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}
</style>
```

---

## Styling

### Custom CSS

```css
/* Override Toast UI Editor styles */
.toastui-editor-defaultUI {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.toastui-editor-toolbar {
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.toastui-editor-toolbar-icons {
  color: #374151;
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
```

---

## Auto-Save Implementation

### Debounced Auto-Save

```typescript
import { ref, watch } from 'vue';
import { debounce } from 'lodash-es'; // or implement your own

const editorRef = ref<InstanceType<typeof Editor>>();
const autoSaving = ref(false);

// Debounced save function
const debouncedSave = debounce(async () => {
  if (!editorRef.value) return;
  
  autoSaving.value = true;
  try {
    const markdown = editorRef.value.invoke('getMarkdown');
    await testService.updateDetails(testId, {
      title: extractFirstHeader(markdown),
      content: markdown
    });
    console.log('Auto-saved at', new Date().toLocaleTimeString());
  } catch (error) {
    console.error('Auto-save failed:', error);
  } finally {
    autoSaving.value = false;
  }
}, 2000); // Save 2 seconds after last change

// Watch for changes
const handleChange = () => {
  debouncedSave();
};
```

---

## Best Practices

### 1. Always Extract Headers
- Parse headers on every change
- Update navigation tree
- Store headers in database for quick access

### 2. Provide Templates
- Pre-fill with QA-specific template
- Include common sections (scenario, steps, results)
- Make it easy to get started

### 3. Auto-Save
- Implement debounced auto-save
- Show save status indicator
- Handle save errors gracefully

### 4. Keyboard Shortcuts
- Enable command shortcuts
- Document shortcuts for users
- Add custom shortcuts if needed

### 5. Responsive Design
- Hide navigation on mobile
- Make editor full-width on small screens
- Ensure toolbar is accessible

---

## Troubleshooting

### Issue: Editor not rendering
**Solution:** Make sure CSS is imported:
```typescript
import '@toast-ui/editor/dist/toastui-editor.css';
```

### Issue: TypeScript errors
**Solution:** Add type definitions:
```typescript
import type { Editor as EditorType } from '@toast-ui/editor';
const editorRef = ref<InstanceType<typeof Editor>>();
```

### Issue: Content not updating
**Solution:** Use `invoke` method:
```typescript
editorRef.value.invoke('setMarkdown', newContent);
```

### Issue: Headers not extracting
**Solution:** Check regex pattern and markdown format:
```typescript
// Headers must start at beginning of line
const headerRegex = /^(#{1,6})\s+(.+)$/gm;
```

---

## Migration from Current Implementation

### Step 1: Install Toast UI Editor
```bash
cd frontend
npm install @toast-ui/editor @toast-ui/vue-editor
```

### Step 2: Replace Textarea in TestDetailView.vue
- Remove current textarea
- Add Toast UI Editor component
- Update save logic to use `getMarkdown()`

### Step 3: Add Header Navigation
- Extract headers from markdown
- Create navigation sidebar
- Add scroll-to-section functionality

### Step 4: Test
- Test with existing data
- Test header extraction
- Test save functionality
- Test auto-save

---

## Resources

- **Official Docs:** https://github.com/nhn/tui.editor
- **Vue Wrapper:** https://github.com/nhn/tui.editor/tree/master/apps/vue-editor
- **Examples:** https://ui.toast.com/tui-editor
- **API Reference:** https://nhn.github.io/tui.editor/latest/

---

**Status:** 📋 Ready for Implementation  
**Next Step:** Install packages and create editor component

