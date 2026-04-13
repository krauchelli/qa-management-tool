import api from './api';

export const dataService = {
  /**
   * Export all data as JSON (triggers download)
   */
  async exportJSON(): Promise<void> {
    const response = await api.get('/data/export/json', {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.download = `qa-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },

  /**
   * Export all data as ZIP (triggers download)
   */
  async exportZIP(): Promise<void> {
    const response = await api.get('/data/export/zip', {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.download = `qa-export-${new Date().toISOString().split('T')[0]}.zip`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },

  /**
   * Import data from JSON file
   */
  async importJSON(
    data: any,
    mode: 'replace' | 'merge' = 'merge'
  ): Promise<{ success: boolean; imported: Record<string, number>; skipped: Record<string, number> }> {
    const response = await api.post(`/data/import?mode=${mode}`, data);
    return response.data;
  },

  /**
   * Get current data counts (preview before import)
   */
  async getPreview(): Promise<Record<string, number>> {
    const response = await api.get('/data/preview');
    return response.data;
  },
};
