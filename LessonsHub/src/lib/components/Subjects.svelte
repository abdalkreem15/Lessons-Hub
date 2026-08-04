<script lang="ts">
  import { subjects } from '$lib/data';

  let { onSelectSubject } = $props();
</script>

<div class="p-6">
  <div class="mb-6">
    <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Explore Subjects</h2>
    <p class="text-gray-600 dark:text-gray-400 text-sm mt-1">Select a subject to view available private tutors.</p>
  </div>
  
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
    {#each subjects as subject}
      <button 
        class="p-5 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-blue-500 dark:hover:border-blue-500 text-left bg-white dark:bg-gray-900 shadow-sm transition flex flex-col justify-between cursor-pointer group"
        onclick={() => onSelectSubject(subject.id)}
      >
        <div>
          <span class="text-3xl mb-3 block">{subject.icon}</span>
          <h3 class="font-semibold text-lg text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">{subject.name}</h3>
        </div>
        <span class="text-xs text-blue-600 dark:text-blue-400 mt-4 font-medium flex items-center gap-1">
          View Teachers &rarr;
        </span>
      </button>
    {/each}
  </div>
</div>
