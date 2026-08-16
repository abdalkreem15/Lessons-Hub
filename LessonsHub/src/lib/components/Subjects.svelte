<script lang="ts">
  import Icon from '$lib/components/Icon.svelte';
  // Props passed down from the parent page containing the live data
  let { subjects = [], teachers = [], onSelectSubject } = $props();

  // If static subjects aren't passed, dynamically extract unique subjects from your live teachers data
  let availableSubjects = $derived(
    subjects.length > 0
      ? subjects
      : Array.from(new Set(teachers.map(t => t.subject).filter(Boolean))).map(subjectName => ({
          id: subjectName.toLowerCase().replace(/\s+/g, '-'),
          name: subjectName,
          icon: 'bookOpen' // Default icon for dynamic subjects
        }))
  );
</script>

<div class="p-6">
  <div class="mb-6">
    <h2 class="section-heading">Explore Subjects</h2>
    <p class="section-subheading">Select a subject to view available private tutors.</p>
  </div>

  {#if availableSubjects.length === 0}
    <p class="text-slate-500 dark:text-slate-400 italic">No subjects available yet.</p>
  {:else}
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {#each availableSubjects as subject}
        <button
          class="card card-hover p-5 cursor-pointer group"
          onclick={() => onSelectSubject(subject.id || subject.name)}
        >
          <div>
            <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
              <Icon name={subject.icon || 'bookOpen'} size={20} class="text-primary" />
            </div>
            <h3 class="font-semibold text-lg text-slate-900 dark:text-slate-100 group-hover:text-primary dark:group-hover:text-accent transition">{subject.name}</h3>
          </div>
          <div class="mt-4 text-xs font-medium text-primary dark:text-accent flex items-center gap-1">
            View Teachers
            <Icon name="arrowRightSm" size={14} />
          </div>
        </button>
      {/each}
    </div>
  {/if}
</div>
