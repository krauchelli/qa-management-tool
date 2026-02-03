# Editor Decision: Toast UI Editor

**Date:** 2026-02-03  
**Decision:** Use Toast UI Editor instead of TinyMCE  
**Status:** ✅ Approved

---

## Why Toast UI Editor?

### ✅ Native Markdown Support
- **TinyMCE:** Works with HTML, needs conversion to/from markdown
- **Toast UI:** Native markdown, no conversion needed
- **Result:** No data loss, perfect Obsidian compatibility

### ✅ Dual Mode Editing
- WYSIWYG mode for non-technical users
- Markdown mode for power users
- Toggle between modes seamlessly

### ✅ Built-in Preview
- Live preview while editing
- Side-by-side view
- No need for separate preview component

### ✅ Perfect for Our Use Case
- Store markdown directly in database
- Export to Obsidian without conversion
- Header extraction is straightforward
- No HTML → Markdown conversion risks

---

## Comparison

| Feature | TinyMCE | Toast UI Editor |
|---------|---------|-----------------|
| Native Format | HTML | Markdown |
| Conversion Needed | Yes (HTML ↔ MD) | No |
| Obsidian Compatible | Risky | Perfect |
| WYSIWYG Mode | ✅ | ✅ |
| Markdown Mode | ❌ | ✅ |
| Live Preview | ❌ | ✅ |
| Vue 3 Support | ✅ | ✅ |
| License | GPL/Commercial | MIT (Free) |
| Data Loss Risk | Medium | Low |

---

## Implementation

### Packages
```bash
npm install @toast-ui/editor @toast-ui/vue-editor
```

### Basic Usage
```vue
<script setup>
import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor } from '@toast-ui/vue-editor';
</script>

<template>
  <Editor
    initialValue="# Test Details"
    initialEditType="wysiwyg"
    previewStyle="vertical"
    height="500px"
  />
</template>
```

---

## Next Steps

1. ✅ Decision made: Toast UI Editor
2. ⏭️ Install packages
3. ⏭️ Create editor component
4. ⏭️ Integrate with TestDetailView
5. ⏭️ Add header navigation
6. ⏭️ Implement auto-save

---

**Approved by:** User  
**Implementation:** Ready to start

