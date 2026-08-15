<script lang="ts">
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
  <div class="mb-4">
    <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Available Teachers</h2>
    <p class="text-gray-600 dark:text-gray-400 text-sm mt-1">Find and book private tutors based on their expertise.</p>
  </div>
  
  {#if availableSubjects.length > 0}
    <div class="flex flex-wrap gap-2 mb-6 pb-5 border-b border-gray-100 dark:border-gray-800">
      <button class="px-4 py-1.5 rounded-full text-sm font-medium transition cursor-pointer {selectedSubjectId === 'all' ? 'bg-blue-600 text-white shadow-sm' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}" onclick={() => onSelectSubjectFilter('all')}>All Subjects</button>
      {#each availableSubjects as subject}
        <button class="px-4 py-1.5 rounded-full text-sm font-medium transition cursor-pointer {selectedSubjectId === subject.id ? 'bg-blue-600 text-white shadow-sm' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}" onclick={() => onSelectSubjectFilter(subject.id)}>📚 {subject.name}</button>
      {/each}
    </div>
  {/if}

  {#if filteredTeachers.length === 0}
    <p class="text-gray-500 dark:text-gray-400 italic py-10 text-center">No teachers found for this subject.</p>
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
          class="border border-gray-200 dark:border-gray-800 p-5 rounded-xl bg-white dark:bg-gray-900 shadow-sm text-left transition-all hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-700 cursor-pointer w-full"
        >
          <div class="flex gap-4 items-start">
            <img src={tImage} alt={tName} class="w-16 h-16 rounded-full object-cover bg-gray-200 dark:bg-gray-800" />
            <div class="flex-1">
              <h3 class="font-bold text-lg text-gray-900 dark:text-gray-100">{tName}</h3>
              <p class="text-blue-600 dark:text-blue-400 text-sm font-medium mt-0.5">{tSubject}</p>
              <p class="text-gray-600 dark:text-gray-400 text-sm mt-1 line-clamp-2">{tBio}</p>
              <div class="mt-2 font-semibold text-green-600 dark:text-green-400 text-sm">{tPrice} EGP / hr</div>
            </div>
          </div>
          <div class="mt-4 text-right text-xs font-semibold text-blue-600 dark:text-blue-400">
            View Profile & Book Session →
          </div>
        </button>
      {/each}
    </div>
  {/if}
</div>