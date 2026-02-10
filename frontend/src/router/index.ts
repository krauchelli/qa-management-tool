import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Dashboard',
      component: () => import('../views/DashboardView.vue'),
    },
    {
      path: '/tests',
      name: 'Tests',
      component: () => import('../views/TestsView.vue'),
    },
    {
      path: '/tests/new',
      name: 'NewTest',
      component: () => import('../views/TestFormView.vue'),
    },
    {
      path: '/tests/:id',
      name: 'TestDetail',
      component: () => import('../views/TestDetailView.vue'),
    },
    {
      path: '/tests/:id/edit',
      name: 'EditTest',
      component: () => import('../views/TestFormView.vue'),
    },
    {
      path: '/tags',
      name: 'Tags',
      component: () => import('../views/TagsView.vue'),
    },
    {
      path: '/test-cases',
      name: 'TestCaseLibrary',
      component: () => import('../views/TestCaseLibraryView.vue'),
    },
    {
      path: '/test-cases/new',
      name: 'NewTestCase',
      component: () => import('../views/TestCaseFormView.vue'),
    },
    {
      path: '/test-cases/:id',
      name: 'TestCaseDetail',
      component: () => import('../views/TestCaseDetailView.vue'),
    },
    {
      path: '/test-cases/:id/edit',
      name: 'EditTestCase',
      component: () => import('../views/TestCaseFormView.vue'),
    },
  ],
});

export default router;
