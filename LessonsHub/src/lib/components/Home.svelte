<script lang="ts">
  let { onNavigate } = $props();
</script>

<div class="space-y-8 p-6">
  <!-- Hero Section -->
  <div class="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 md:p-12 text-white shadow-md">
    <div class="max-w-xl">
      <h1 class="text-3xl md:text-4xl font-extrabold mb-3">Find Expert Private Tutors Today</h1>
      <p class="text-blue-100 mb-6 text-sm md:text-base leading-relaxed">
        Connect with top-rated educators for personalized private lessons tailored to your educational goals.
      </p>
      <div class="flex flex-wrap gap-3">
        <button 
          onclick={() => onNavigate('teachers')}
          class="bg-white text-blue-700 hover:bg-blue-50 font-bold px-6 py-2.5 rounded-xl transition cursor-pointer shadow-sm text-sm"
        >
          Explore Teachers
        </button>
      </div>
    </div>
  </div>

  <!-- Features Grid -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-xl shadow-sm transition-colors">
      <div class="text-3xl mb-3">⭐</div>
      <h3 class="font-bold text-lg mb-1 text-gray-900 dark:text-gray-100">Top-Rated Tutors</h3>
      <p class="text-gray-600 dark:text-gray-400 text-sm">Learn from experienced educators vetted for quality and communication.</p>
    </div>

    <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-xl shadow-sm transition-colors">
      <div class="text-3xl mb-3">🎯</div>
      <h3 class="font-bold text-lg mb-1 text-gray-900 dark:text-gray-100">Targeted Subjects</h3>
      <p class="text-gray-600 dark:text-gray-400 text-sm">Filter easily by specific subjects to find the exact help you need.</p>
    </div>

    <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-xl shadow-sm transition-colors">
      <div class="text-3xl mb-3">💬</div>
      <h3 class="font-bold text-lg mb-1 text-gray-900 dark:text-gray-100">Direct Support</h3>
      <p class="text-gray-600 dark:text-gray-400 text-sm">Have questions? Reach out easily through our dedicated contact form.</p>
    </div>
  </div>
</div>