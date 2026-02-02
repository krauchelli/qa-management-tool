import { defineStore } from 'pinia';
import { statsService } from '../services/statsService';
import type { Stats } from '../types';

interface StatsState {
  stats: Stats | null;
  loading: boolean;
  error: string | null;
}

export const useStatsStore = defineStore('stats', {
  state: (): StatsState => ({
    stats: null,
    loading: false,
    error: null,
  }),

  actions: {
    async fetchStats() {
      this.loading = true;
      this.error = null;
      try {
        this.stats = await statsService.getStats();
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to fetch stats';
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});
