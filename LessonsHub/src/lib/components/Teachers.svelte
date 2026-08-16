<script lang="ts">
  import Icon from '$lib/components/Icon.svelte';
  let { teachers = [], selectedSubjectId = 'all', onSelectSubjectFilter, onSelectTeacher, currentUser } = $props();

  let availableSubjects = $derived(
    Array.from(new Set(teachers.map(t => t.subject || t.Subject).filter(Boolean)))
      .map(subjectName => ({
        id: String(subjectName).toLowerCase().replace(/\s+/g, '-'),
        name: subjectName
      }))
  );

  let filteredTeachers = $derived(
    selectedSubjectId === 'all'
      ? teachers
      : teachers.filter(t => {
          const sub = t.subject || t.Subject || '';
          return sub.toLowerCase().includes(selectedSubjectId.toLowerCase());
        })
  );
</script>

<div class="p-6">
  <div class="mb-6">
    <h2 class="section-heading">Available Teachers</h2>
    <p class="section-subheading">Find and book private tutors based on their expertise.</p>
  </div>

  {#if availableSubjects.length > 0}
    <div class="flex flex-wrap gap-2 mb-6 pb-5 border-b border-slate-200 dark:border-slate-700">
      <button
        class="px-4 py-1.5 rounded-full text-sm font-medium transition cursor-pointer {selectedSubjectId === 'all' ? 'bg-primary text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}"
        onclick={() => onSelectSubjectFilter('all')}
      >All Subjects</button>
      {#each availableSubjects as subject}
        <button
          class="px-4 py-1.5 rounded-full text-sm font-medium transition cursor-pointer {selectedSubjectId === subject.id ? 'bg-primary text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}"
          onclick={() => onSelectSubjectFilter(subject.id)}
        >
          <Icon name="bookOpen" size={14} class="inline mr-1" />
          {subject.name}
        </button>
      {/each}
    </div>
  {/if}

  {#if filteredTeachers.length === 0}
    <p class="text-slate-500 dark:text-slate-400 italic py-10 text-center">No teachers found for this subject.</p>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      {#each filteredTeachers as teacher}
        {@const tId = teacher.id || teacher.ID || teacher.Id}
        {@const tName = teacher.name || teacher.Name || 'Unnamed Teacher'}
        {@const tSubject = teacher.subject || teacher.Subject || 'General'}
        {@const tBio = teacher.bio || teacher.Bio || 'Experienced private tutor.'}
        {@const tImage = teacher.image || teacher.Image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'}
        {@const tPrice = teacher.price || teacher.Price || '150'}

        <button
          onclick={() => onSelectTeacher(teacher)}
          class="card card-hover p-5 text-left cursor-pointer w-full"
        >
          <div class="flex gap-4 items-start">
            <img src={tImage} alt={tName} class="w-16 h-16 rounded-xl object-cover bg-slate-200 dark:bg-slate-700 shadow-sm" />
            <div class="flex-1">
              <h3 class="font-bold text-lg text-slate-900 dark:text-slate-100">{tName}</h3>
              <p class="text-primary dark:text-accent text-sm font-medium mt-0.5">{tSubject}</p>
              <p class="text-slate-600 dark:text-slate-400 text-sm mt-1 line-clamp-2">{tBio}</p>
              <div class="mt-2 font-semibold text-green-600 dark:text-green-400 text-sm">{tPrice} EGP / hr</div>
            </div>
          </div>
          <div class="mt-4 text-right text-xs font-semibold text-primary dark:text-accent flex items-center justify-end gap-1">
            View Profile & Book Session
            <Icon name="arrowRightSm" size={14} />
          </div>
        </button>
      {/each}
    </div>
  {/if}
</div>
