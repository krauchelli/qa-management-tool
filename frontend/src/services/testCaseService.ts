import api from './api';
import type { 
  TestCase, 
  CreateTestCaseDto, 
  UpdateTestCaseDto, 
  TestCaseFilters, 
  PaginatedResponse,
  Test 
} from '../types';

export const testCaseService = {
  /**
   * Get all test cases with optional filters
   */
  async getAllTestCases(filters?: TestCaseFilters): Promise<PaginatedResponse<TestCase>> {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.priority) params.append('priority', filters.priority);
    if (filters?.tagIds?.length) params.append('tagIds', filters.tagIds.join(','));
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const response = await api.get<PaginatedResponse<TestCase>>(`/test-cases?${params.toString()}`);
    return response.data;
  },

  /**
   * Get single test case by ID
   */
  async getTestCaseById(id: string): Promise<TestCase> {
    const response = await api.get<TestCase>(`/test-cases/${id}`);
    return response.data;
  },

  /**
   * Create new test case
   */
  async createTestCase(data: CreateTestCaseDto): Promise<TestCase> {
    const response = await api.post<TestCase>('/test-cases', data);
    return response.data;
  },

  /**
   * Update test case
   */
  async updateTestCase(id: string, data: UpdateTestCaseDto): Promise<TestCase> {
    const response = await api.put<TestCase>(`/test-cases/${id}`, data);
    return response.data;
  },

  /**
   * Delete test case
   */
  async deleteTestCase(id: string): Promise<void> {
    await api.delete(`/test-cases/${id}`);
  },

  /**
   * Add tag to test case
   */
  async addTagToTestCase(testCaseId: string, tagId: string): Promise<void> {
    await api.post(`/test-cases/${testCaseId}/tags`, { tagId });
  },

  /**
   * Remove tag from test case
   */
  async removeTagFromTestCase(testCaseId: string, tagId: string): Promise<void> {
    await api.delete(`/test-cases/${testCaseId}/tags/${tagId}`);
  },

  /**
   * Get execution history for test case
   */
  async getExecutionHistory(testCaseId: string): Promise<Test[]> {
    const response = await api.get<Test[]>(`/test-cases/${testCaseId}/executions`);
    return response.data;
  },

  /**
   * Get statistics for test case
   */
  async getTestCaseStats(testCaseId: string): Promise<{
    executionCount: number;
    passCount: number;
    failCount: number;
    passRate: number;
    lastTested?: string;
  }> {
    const response = await api.get(`/test-cases/${testCaseId}/stats`);
    return response.data;
  },
};
