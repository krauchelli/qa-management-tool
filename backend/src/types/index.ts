// Type definitions for QA Management Tool

export interface Test {
  id: string;
  date: string;
  feature: string;
  jira?: string | null;
  jiraUrl?: string | null;
  status: TestStatus;
  env: TestEnv;
  notes?: string | null;
  detailFile?: string | null;
  createdAt: Date;
  updatedAt: Date;
  evidence?: Evidence[];
  detail?: Detail | null;
  tags?: TestTag[];
}

export interface Tag {
  id: string;
  name: string;
  color: string;
  category?: string | null;
  createdAt: Date;
}

export interface TestTag {
  id: string;
  testId: string;
  tagId: string;
  createdAt: Date;
  tag?: Tag;
}

export interface Evidence {
  id: string;
  testId: string;
  type: string;
  url: string;
  description?: string | null;
}

export interface Detail {
  id: string;
  testId: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export type TestStatus = 'PASSED' | 'FAILED' | 'IN_PROGRESS' | 'NEED_CONFIRMATION';
export type TestEnv = 'DEV' | 'STAGING' | 'PROD';

// DTOs (Data Transfer Objects)
export interface CreateTestDto {
  date: string;
  feature: string;
  jira?: string;
  jiraUrl?: string;
  status: TestStatus;
  env: TestEnv;
  notes?: string;
  evidence?: Array<{
    type: string;
    url: string;
    description?: string;
  }>;
}

export interface UpdateTestDto {
  date?: string;
  feature?: string;
  jira?: string;
  jiraUrl?: string;
  status?: TestStatus;
  env?: TestEnv;
  notes?: string;
  detailFile?: string;
}

export interface CreateDetailDto {
  testId: string;
  title: string;
  content: string;
}

export interface UpdateDetailDto {
  title?: string;
  content?: string;
}

export interface CreateTagDto {
  name: string;
  color?: string;
  category?: string;
}

export interface UpdateTagDto {
  name?: string;
  color?: string;
  category?: string;
}

export interface TestFilters {
  status?: TestStatus;
  env?: TestEnv;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: 'date' | 'feature' | 'status' | 'env' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

export interface Stats {
  total: number;
  passed: number;
  failed: number;
  inProgress: number;
  needConfirmation: number;
  byEnv: {
    dev: number;
    staging: number;
    prod: number;
  };
  recentTests: Test[];
}

export interface ApiError {
  error: string;
  code: string;
  details?: any;
}
