import { defineStore } from 'pinia';
import { tagService } from '../services/tagService';
import type { Tag } from '../types';

interface TagState {
  tags: Tag[];
  loading: boolean;
  error: string | null;
}

export const useTagStore = defineStore('tag', {
  state: (): TagState => ({
    tags: [],
    loading: false,
    error: null,
  }),

  getters: {
    tagsByCategory: (state) => {
      const grouped: Record<string, Tag[]> = {};
      state.tags.forEach(tag => {
        const category = tag.category || 'uncategorized';
        if (!grouped[category]) {
          grouped[category] = [];
        }
        grouped[category].push(tag);
      });
      return grouped;
    },

    getTagById: (state) => (id: string) => {
      return state.tags.find(tag => tag.id === id);
    },

    getTagByName: (state) => (name: string) => {
      return state.tags.find(tag => tag.name.toLowerCase() === name.toLowerCase());
    },
  },

  actions: {
    async fetchTags() {
      this.loading = true;
      this.error = null;
      try {
        this.tags = await tagService.getAllTags();
      } catch (error: any) {
        this.error = error.message || 'Failed to fetch tags';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async createTag(data: { name: string; color?: string; category?: string }) {
      this.loading = true;
      this.error = null;
      try {
        const tag = await tagService.createTag(data);
        this.tags.push(tag);
        return tag;
      } catch (error: any) {
        this.error = error.message || 'Failed to create tag';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateTag(id: string, data: { name?: string; color?: string; category?: string }) {
      this.loading = true;
      this.error = null;
      try {
        const tag = await tagService.updateTag(id, data);
        const index = this.tags.findIndex(t => t.id === id);
        if (index !== -1) {
          this.tags[index] = tag;
        }
        return tag;
      } catch (error: any) {
        this.error = error.message || 'Failed to update tag';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteTag(id: string) {
      this.loading = true;
      this.error = null;
      try {
        await tagService.deleteTag(id);
        this.tags = this.tags.filter(t => t.id !== id);
      } catch (error: any) {
        this.error = error.message || 'Failed to delete tag';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async addTagToTest(testId: string, tagId: string) {
      try {
        await tagService.addTagToTest(testId, tagId);
      } catch (error: any) {
        this.error = error.message || 'Failed to add tag to test';
        throw error;
      }
    },

    async removeTagFromTest(testId: string, tagId: string) {
      try {
        await tagService.removeTagFromTest(testId, tagId);
      } catch (error: any) {
        this.error = error.message || 'Failed to remove tag from test';
        throw error;
      }
    },
  },
});
