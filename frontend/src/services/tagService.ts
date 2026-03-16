import api from './api';
import type { Tag } from '../types';

export const tagService = {
  // Get all tags
  async getAllTags(): Promise<Tag[]> {
    const response = await api.get<Tag[]>('/tags');
    return response.data;
  },

  // Get tag by ID
  async getTag(id: string): Promise<Tag> {
    const response = await api.get<Tag>(`/tags/${id}`);
    return response.data;
  },

  // Create tag
  async createTag(data: { name: string; color?: string; category?: string }): Promise<Tag> {
    const response = await api.post<Tag>('/tags', data);
    return response.data;
  },

  // Update tag
  async updateTag(id: string, data: { name?: string; color?: string; category?: string }): Promise<Tag> {
    const response = await api.put<Tag>(`/tags/${id}`, data);
    return response.data;
  },

  // Delete tag
  async deleteTag(id: string): Promise<void> {
    await api.delete(`/tags/${id}`);
  },

  // Add tag to test
  async addTagToTest(testId: string, tagId: string): Promise<void> {
    await api.post(`/tests/${testId}/tags`, { tagId });
  },

  // Remove tag from test
  async removeTagFromTest(testId: string, tagId: string): Promise<void> {
    await api.delete(`/tests/${testId}/tags/${tagId}`);
  },

  // Get tags for test
  async getTestTags(testId: string): Promise<Tag[]> {
    const response = await api.get<Tag[]>(`/tests/${testId}/tags`);
    return response.data;
  },
};
