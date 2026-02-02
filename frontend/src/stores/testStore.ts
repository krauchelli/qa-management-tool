import { defineStore } from 'pinia';
import { testService } from '../services/testService';
import type { Test, CreateTestDto, UpdateTestDto, TestFilters, PaginationMeta } from '../types';

interface TestState {
  tests: Test[];
  currentTest: Test | null;
  loading: boolean;
  error: string | null;
  filters: TestFilters;
  pagination: PaginationMeta | null;
}

export const useTestStore = defineStore('test', {
  state: (): TestState => ({
    tests: [],
    currentTest: null,
    loading: false,
    error: null,
    filters: {},
    pagination: null,
  }),

  getters: {
    activeTests: (state) =>
      state.tests.filter((t) => t.status !== 'PASSED'),
    
    completedTests: (state) =>
      state.tests.filter((t) => t.status === 'PASSED'),
    
    filteredTests: (state) => {
      let filtered = state.tests;

      if (state.filters.status) {
        filtered = filtered.filter((t) => t.status === state.filters.status);
      }

      if (state.filters.env) {
        filtered = filtered.filter((t) => t.env === state.filters.env);
      }

      if (state.filters.search) {
        const search = state.filters.search.toLowerCase();
        filtered = filtered.filter(
          (t) =>
            t.feature.toLowerCase().includes(search) ||
            t.jira?.toLowerCase().includes(search) ||
            t.notes?.toLowerCase().includes(search)
        );
      }

      return filtered;
    },
  },

  actions: {
    async fetchTests(filters?: TestFilters) {
      this.loading = true;
      this.error = null;
      try {
        const response = await testService.getAllTests(filters);
        this.tests = response.data;
        this.pagination = response.pagination;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to fetch tests';
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
        const response = await testService.getAllTests({
          ...this.filters,
          page: nextPage,
        });
        this.tests = [...this.tests, ...response.data];
        this.pagination = response.pagination;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to load more tests';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchTest(id: string) {
      this.loading = true;
      this.error = null;
      try {
        this.currentTest = await testService.getTestById(id);
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to fetch test';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async createTest(data: CreateTestDto) {
      this.loading = true;
      this.error = null;
      try {
        const test = await testService.createTest(data);
        this.tests.unshift(test);
        return test;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to create test';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateTest(id: string, data: UpdateTestDto) {
      this.loading = true;
      this.error = null;
      try {
        const test = await testService.updateTest(id, data);
        const index = this.tests.findIndex((t) => t.id === id);
        if (index !== -1) {
          this.tests[index] = test;
        }
        if (this.currentTest?.id === id) {
          this.currentTest = test;
        }
        return test;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to update test';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteTest(id: string) {
      this.loading = true;
      this.error = null;
      try {
        await testService.deleteTest(id);
        this.tests = this.tests.filter((t) => t.id !== id);
        if (this.currentTest?.id === id) {
          this.currentTest = null;
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to delete test';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    setFilters(filters: TestFilters) {
      this.filters = filters;
    },

    clearFilters() {
      this.filters = {};
    },
  },
});
