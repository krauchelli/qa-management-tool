import { defineStore } from 'pinia';
import { testCaseService } from '../services/testCaseService';
import type { 
  TestCase, 
  CreateTestCaseDto, 
  UpdateTestCaseDto, 
  TestCaseFilters, 
  PaginationMeta,
  Test 
} from '../types';

interface TestCaseState {
  testCases: TestCase[];
  currentTestCase: TestCase | null;
  executionHistory: Test[];
  stats: {
    executionCount: number;
    passCount: number;
    failCount: number;
    passRate: number;
    lastTested?: string;
  } | null;
  loading: boolean;
  error: string | null;
  filters: TestCaseFilters;
  pagination: PaginationMeta | null;
}

export const useTestCaseStore = defineStore('testCase', {
  state: (): TestCaseState => ({
    testCases: [],
    currentTestCase: null,
    executionHistory: [],
    stats: null,
    loading: false,
    error: null,
    filters: {},
    pagination: null,
  }),

  getters: {
    filteredTestCases: (state) => {
      let filtered = state.testCases;

      if (state.filters.search) {
        const search = state.filters.search.toLowerCase();
        filtered = filtered.filter(
          (tc) =>
            tc.title.toLowerCase().includes(search) ||
            tc.description?.toLowerCase().includes(search)
        );
      }

      if (state.filters.priority) {
        filtered = filtered.filter((tc) => tc.priority === state.filters.priority);
      }

      return filtered;
    },
  },

  actions: {
    async fetchTestCases(filters?: TestCaseFilters) {
      this.loading = true;
      this.error = null;
      try {
        const response = await testCaseService.getAllTestCases(filters);
        this.testCases = response.data;
        this.pagination = response.pagination;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to fetch test cases';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async loadMore() {
      if (!this.pagination?.hasMore || this.loading) return;
      
      const nextPage = (this.pagination.page || 1) + 1;
      this.loading = true;
      this.error = null;
      
      try {
        const response = await testCaseService.getAllTestCases({
          ...this.filters,
          page: nextPage,
        });
        this.testCases = [...this.testCases, ...response.data];
        this.pagination = response.pagination;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to load more test cases';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchTestCase(id: string) {
      this.loading = true;
      this.error = null;
      try {
        this.currentTestCase = await testCaseService.getTestCaseById(id);
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to fetch test case';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async createTestCase(data: CreateTestCaseDto) {
      this.loading = true;
      this.error = null;
      try {
        const testCase = await testCaseService.createTestCase(data);
        this.testCases.unshift(testCase);
        return testCase;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to create test case';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateTestCase(id: string, data: UpdateTestCaseDto) {
      this.loading = true;
      this.error = null;
      try {
        const testCase = await testCaseService.updateTestCase(id, data);
        const index = this.testCases.findIndex((tc) => tc.id === id);
        if (index !== -1) {
          this.testCases[index] = testCase;
        }
        if (this.currentTestCase?.id === id) {
          this.currentTestCase = testCase;
        }
        return testCase;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to update test case';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteTestCase(id: string) {
      this.loading = true;
      this.error = null;
      try {
        await testCaseService.deleteTestCase(id);
        this.testCases = this.testCases.filter((tc) => tc.id !== id);
        if (this.currentTestCase?.id === id) {
          this.currentTestCase = null;
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to delete test case';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchExecutionHistory(testCaseId: string) {
      this.loading = true;
      this.error = null;
      try {
        this.executionHistory = await testCaseService.getExecutionHistory(testCaseId);
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to fetch execution history';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchTestCaseStats(testCaseId: string) {
      this.loading = true;
      this.error = null;
      try {
        this.stats = await testCaseService.getTestCaseStats(testCaseId);
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to fetch test case stats';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateTestCaseTags(testCaseId: string, tagIds: string[]) {
      try {
        const testCase = await testCaseService.getTestCaseById(testCaseId);
        const currentTagIds = testCase.tags?.map((t) => t.tagId) || [];

        // Add new tags
        for (const tagId of tagIds) {
          if (!currentTagIds.includes(tagId)) {
            await testCaseService.addTagToTestCase(testCaseId, tagId);
          }
        }

        // Remove old tags
        for (const tagId of currentTagIds) {
          if (!tagIds.includes(tagId)) {
            await testCaseService.removeTagFromTestCase(testCaseId, tagId);
          }
        }

        // Refresh test case data
        await this.fetchTestCase(testCaseId);
      } catch (error: any) {
        this.error = error.message || 'Failed to update tags';
        throw error;
      }
    },

    setFilters(filters: TestCaseFilters) {
      this.filters = filters;
    },

    clearFilters() {
      this.filters = {};
    },
  },
});
