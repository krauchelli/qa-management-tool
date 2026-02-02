import api from './api';
import type { Test, CreateTestDto, UpdateTestDto, TestFilters, Detail, PaginatedResponse } from '../types';

export const testService = {
  /**
   * Get all tests with optional filters, sorting, and pagination
   */
  async getAllTests(filters?: TestFilters): Promise<PaginatedResponse<Test>> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.env) params.append('env', filters.env);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters?.dateTo) params.append('dateTo', filters.dateTo);
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const response = await api.get<PaginatedResponse<Test>>(`/tests?${params.toString()}`);
    return response.data;
  },

  /**
   * Get single test by ID
   */
  async getTestById(id: string): Promise<Test> {
    const response = await api.get<Test>(`/tests/${id}`);
    return response.data;
  },

  /**
   * Create new test
   */
  async createTest(data: CreateTestDto): Promise<Test> {
    const response = await api.post<Test>('/tests', data);
    return response.data;
  },

  /**
   * Update test
   */
  async updateTest(id: string, data: UpdateTestDto): Promise<Test> {
    const response = await api.put<Test>(`/tests/${id}`, data);
    return response.data;
  },

  /**
   * Delete test
   */
  async deleteTest(id: string): Promise<void> {
    await api.delete(`/tests/${id}`);
  },

  /**
   * Add evidence to test
   */
  async addEvidence(
    testId: string,
    evidence: { type: string; url: string; description?: string }
  ): Promise<void> {
    await api.post(`/tests/${testId}/evidence`, evidence);
  },

  /**
   * Delete evidence from test
   */
  async deleteEvidence(testId: string, evidenceId: string): Promise<void> {
    await api.delete(`/tests/${testId}/evidence/${evidenceId}`);
  },

  /**
   * Get test details
   */
  async getDetails(testId: string): Promise<Detail> {
    const response = await api.get<Detail>(`/details/${testId}`);
    return response.data;
  },

  /**
   * Create test details
   */
  async createDetails(data: { testId: string; title: string; content: string }): Promise<Detail> {
    const response = await api.post<Detail>('/details', data);
    return response.data;
  },

  /**
   * Update test details
   */
  async updateDetails(testId: string, data: { title: string; content: string }): Promise<Detail> {
    const response = await api.put<Detail>(`/details/${testId}`, data);
    return response.data;
  },

  /**
   * Delete test details
   */
  async deleteDetails(testId: string): Promise<void> {
    await api.delete(`/details/${testId}`);
  },
};
