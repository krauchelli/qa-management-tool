import axios from 'axios';
import type { Tag } from '../types';

const API_URL = 'http://localhost:3000/api';

export const tagService = {
  // Get all tags
  async getAllTags(): Promise<Tag[]> {
    const response = await axios.get(`${API_URL}/tags`);
    return response.data;
  },

  // Get tag by ID
  async getTag(id: string): Promise<Tag> {
    const response = await axios.get(`${API_URL}/tags/${id}`);
    return response.data;
  },

  // Create tag
  async createTag(data: { name: string; color?: string; category?: string }): Promise<Tag> {
    const response = await axios.post(`${API_URL}/tags`, data);
    return response.data;
  },

  // Update tag
  async updateTag(id: string, data: { name?: string; color?: string; category?: string }): Promise<Tag> {
    const response = await axios.put(`${API_URL}/tags/${id}`, data);
    return response.data;
  },

  // Delete tag
  async deleteTag(id: string): Promise<void> {
    await axios.delete(`${API_URL}/tags/${id}`);
  },

  // Add tag to test
  async addTagToTest(testId: string, tagId: string): Promise<void> {
    await axios.post(`${API_URL}/tests/${testId}/tags`, { tagId });
  },

  // Remove tag from test
  async removeTagFromTest(testId: string, tagId: string): Promise<void> {
    await axios.delete(`${API_URL}/tests/${testId}/tags/${tagId}`);
  },

  // Get tags for test
  async getTestTags(testId: string): Promise<Tag[]> {
    const response = await axios.get(`${API_URL}/tests/${testId}/tags`);
    return response.data;
  },
};
