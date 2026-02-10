<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <h1 class="text-2xl font-bold text-gray-900">
              📊 QA Management Tool
            </h1>
            <nav class="flex gap-4">
              <router-link
                to="/"
                class="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100"
                active-class="bg-gray-100"
              >
                Dashboard
              </router-link>
              <router-link
                to="/tests"
                class="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100"
                active-class="bg-gray-100"
              >
                Tests
              </router-link>
              <router-link
                to="/test-cases"
                class="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100"
                active-class="bg-gray-100"
              >
                Test Cases
              </router-link>
              <router-link
                to="/tags"
                class="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100"
                active-class="bg-gray-100"
              >
                Tags
              </router-link>
            </nav>
          </div>
          <div class="flex items-center gap-4">
            <router-link
              to="/tests/new"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
            >
              + Add Test
            </router-link>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
// App component
</script>
