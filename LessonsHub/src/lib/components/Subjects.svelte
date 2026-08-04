<script lang="ts">
  // Props passed down from the parent page containing the live data
  let { subjects = [], teachers = [], onSelectSubject } = $props();

  // If static subjects aren't passed, dynamically extract unique subjects from your live teachers data
  let availableSubjects = $derived(
    subjects.length > 0 
      ? subjects 
      : Array.from(new Set(teachers.map(t => t.subject).filter(Boolean))).map(subjectName => ({
          id: subjectName.toLowerCase().replace(/\s+/g, '-'),
          name: subjectName,
          icon: '📚' // Default icon for dynamic subjects
        }))
  );
</script>

<div class="p-6">
  <div class="mb-6">
    <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Explore Subjects</h2>
    <p class="text-gray-600 dark:text-gray-400 text-sm mt-1">Select a subject to view available private tutors.</p>
  </div>
  
  {#if availableSubjects.length === 0}
    <p class="text-gray-500 dark:text-gray-400 italic">No subjects available yet.</p>
  {:else}
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {#each availableSubjects as subject}
        <button 
          class="p-5 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-blue-500 dark:hover:border-blue-500 text-left bg-white dark:bg-gray-900 shadow-sm transition flex flex-col justify-between cursor-pointer group"
          onclick={() => onSelectSubject(subject.id || subject.name)}
        >
          <div>
            <span class="text-3xl mb-3 block">{subject.icon || '📚'}</span>
            <h3 class="font-semibold text-lg text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">{subject.name}</h3>
          </div>
          <span class="text-xs text-blue-600 dark:text-blue-400 mt-4 font-medium flex items-center gap-1">
            View Teachers &rarr;
          </span>
        </button>
      {/each}
    </div>
  {/if}
</div>