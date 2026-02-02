import api from './api';
import type { Stats } from '../types';

export const statsService = {
  /**
   * Get test statistics
   */
  async getStats(): Promise<Stats> {
    const response = await api.get<Stats>('/stats');
    return response.data;
  },
};
