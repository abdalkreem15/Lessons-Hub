<script lang="ts">
  import Icon from '$lib/components/Icon.svelte';
  let {
    courses = [],
    teachers = [],
    currentUser,
    content = [],
    purchasedCourseIds = [],
    preselectedCourseId = null,
    onClearPreselected,
    onPurchase,
    onAddCourse,
    onAddContent,
    onContentAdded
  } = $props();

  let selectedTeacherId = $state('all');
  let selectedCourse = $state<any>(null);

  let localContent = $derived.by(() => [...(content || [])]);

  // Auto-open course if linked from Teacher Profile
  $effect(() => {
    if (preselectedCourseId) {
      const courseToOpen = courses.find(c => (c.id || c.ID) === preselectedCourseId);
      if (courseToOpen) {
        openCourse(courseToOpen);
        onClearPreselected();
      }
    }
  });

  let availableTeachers = $derived(
    Array.from(new Set(courses.map(c => c.teacherId || c.teacherID).filter(Boolean)))
      .map(teacherId => {
        const teacher = teachers.find(t => (t.id || t.ID) === teacherId);
        return {
          id: teacherId,
          name: teacher ? (teacher.name || teacher.Name) : 'Unknown Teacher'
        };
      })
  );

  let filteredCourses = $derived(
    selectedTeacherId === 'all' ? courses : courses.filter(c => (c.teacherId || c.teacherID) === selectedTeacherId)
  );

  function getTeacherName(teacherId: string) {
    const teacher = teachers.find(t => (t.id || t.ID) === teacherId);
    return teacher ? (teacher.name || teacher.Name) : 'Unknown Teacher';
  }

  function openCourse(course: any) {
    selectedCourse = course;
    window.scrollTo(0, 0);
  }

  // ✅ Access Control
  function canViewContent(course: any) {
    const cId = course.id || course.ID;
    const cTeacherId = course.teacherId || course.teacherID;
    if (!currentUser) return false;
    if (currentUser.role === 'teacher' && currentUser.id === cTeacherId) return true;
    if (purchasedCourseIds.includes(cId)) return true;
    return false;
  }

  // Markdown & Embed Helpers
  function renderMarkdown(text: string) {
    if (!text) return '';
    let html = text.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>');
    html = html.replace(/### (.*)/g, '<h3 class="text-lg font-bold mt-4 mb-2 text-slate-900 dark:text-slate-100">$1</h3>');
    html = html.replace(/#### (.*)/g, '<h4 class="text-base font-bold mt-3 mb-1 text-slate-800 dark:text-slate-200">$1</h4>');
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    html = html.replace(/^- (.*)/gm, '<li class="ml-4 list-disc">$1</li>');
    html = html.replace(/\n/g, '<br>');
    return html;
  }

  function getVideoEmbed(url: string) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) return `https://www.youtube.com/embed/${match[2]}`;
    return url;
  }

  function handleLocalContentAdded(newContent: any) {
    localContent = [...localContent, newContent];
    onContentAdded(newContent);
  }
</script>

<div class="p-6">
  {#if selectedCourse}
    <!-- COURSE PROFILE VIEW -->
    {@const cId = selectedCourse.id || selectedCourse.ID}
    {@const cTeacherId = selectedCourse.teacherId || selectedCourse.teacherID}
    {@const isOwner = currentUser && currentUser.role === 'teacher' && currentUser.id === cTeacherId}
    {@const hasAccess = canViewContent(selectedCourse)}
    {@const courseContent = localContent.filter(c => c.courseId === cId)}

    <button onclick={() => selectedCourse = null} class="mb-6 flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-accent transition cursor-pointer font-medium text-sm">
      <Icon name="arrowLeft" size={16} />
      Back to All Courses
    </button>

    <div class="card p-6 mb-8">
      <div class="flex items-start gap-4">
        <div class="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center text-2xl flex-shrink-0">
          <Icon name="folder" size={28} class="text-primary" />
        </div>
        <div class="flex-1">
          <h1 class="text-3xl font-bold text-slate-900 dark:text-slate-100">{selectedCourse.title}</h1>
          <p class="text-primary dark:text-accent text-lg font-medium mt-1">By {getTeacherName(cTeacherId)}</p>
          <p class="text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">{selectedCourse.description}</p>
        </div>
      </div>
      <div class="mt-6 text-3xl font-bold text-green-600 dark:text-green-400">{selectedCourse.price} EGP</div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

      <!-- LEFT: Course Content -->
      <div class="lg:col-span-2">
        <h2 class="section-heading mb-4">
          <Icon name="documentText" size={20} class="inline mr-2 text-primary" />
          Course Material
        </h2>

        {#if hasAccess}
          {#if courseContent.length > 0}
            <div class="space-y-4">
              {#each courseContent as item}
                <div class="card p-4">
                  {#if item.type === 'text'}
                    <div class="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{@html renderMarkdown(item.content)}</div>
                  {:else if item.type === 'video'}
                    <div class="aspect-video rounded-lg overflow-hidden bg-black">
                      <iframe src={getVideoEmbed(item.content)} title="Course video" class="w-full h-full" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    </div>
                  {:else if item.type === 'image'}
                    <img src={item.content} alt="Course content" class="w-full rounded-lg object-cover max-h-96" />
                  {/if}
                </div>
              {/each}
            </div>
          {:else}
            <div class="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-10 text-center">
              <p class="text-slate-500 dark:text-slate-400 italic">No content added yet.</p>
            </div>
          {/if}
        {:else}
          <!-- LOCKED STATE -->
          <div class="space-y-4">
            {#each [1, 2, 3] as i}
              <div class="bg-slate-100 dark:bg-slate-800 rounded-xl h-40 flex items-center justify-center blur-sm select-none">
                <Icon name="lock" size={32} class="text-slate-400" />
              </div>
            {/each}
            <div class="text-center py-4">
              <p class="text-slate-600 dark:text-slate-400 font-medium">Purchase this course to unlock all materials.</p>
            </div>
          </div>
        {/if}
      </div>

      <!-- RIGHT: Actions & Sidebar -->
      <div class="space-y-6">
        <div class="card p-5 sticky top-24">
          {#if isOwner}
            <button onclick={() => onAddContent(cId)} class="w-full btn-primary py-3 text-sm">
              <Icon name="plus" size={16} class="inline mr-1" />
              Add Course Content
            </button>
            <p class="text-xs text-center text-slate-500 dark:text-slate-400 mt-2">You own this course. Content is visible to you.</p>
          {:else if hasAccess}
            <div class="bg-green-50 dark:bg-green-950/50 border border-green-200 dark:border-green-800 rounded-xl p-4 text-center">
              <p class="text-green-600 dark:text-green-400 font-bold text-sm flex items-center justify-center gap-2">
                <Icon name="checkBadge" size={18} />
                Course Unlocked
              </p>
              <p class="text-green-500 dark:text-green-400 text-xs mt-1">You have access to all materials.</p>
            </div>
          {:else}
            <button onclick={() => onPurchase(cId)} class="w-full btn-primary py-4 text-lg">
              Buy for {selectedCourse.price} EGP
            </button>
            <p class="text-xs text-center text-slate-500 dark:text-slate-400 mt-2">One-time purchase. Instant access.</p>
          {/if}
        </div>
      </div>
    </div>

  {:else}
    <!-- DEFAULT GRID VIEW -->
    <div class="mb-6">
      <h2 class="section-heading">Available Courses</h2>
      <p class="section-subheading">Browse course materials and lessons created by our teachers.</p>
    </div>

    {#if availableTeachers.length > 0}
      <div class="flex flex-wrap gap-2 mb-6 pb-5 border-b border-slate-200 dark:border-slate-700">
        <button
          class="px-4 py-1.5 rounded-full text-sm font-medium transition cursor-pointer {selectedTeacherId === 'all' ? 'bg-primary text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}"
          onclick={() => selectedTeacherId = 'all'}
        >All Teachers</button>

        {#each availableTeachers as teacher}
          <button
            class="px-4 py-1.5 rounded-full text-sm font-medium transition cursor-pointer {selectedTeacherId === teacher.id ? 'bg-primary text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}"
            onclick={() => selectedTeacherId = teacher.id}
          >
            <Icon name="bookOpen" size={14} class="inline mr-1" />
            {teacher.name}
          </button>
        {/each}

        {#if currentUser && currentUser.role === 'teacher'}
          <button onclick={onAddCourse} class="ml-auto px-4 py-1.5 rounded-full text-sm font-medium transition cursor-pointer btn-primary text-xs">
            <Icon name="plus" size={14} class="inline mr-1" />
            Add Course
          </button>
        {/if}
      </div>
    {:else if currentUser && currentUser.role === 'teacher'}
      <div class="mb-6 flex justify-end">
        <button onclick={onAddCourse} class="btn-primary text-xs px-4 py-1.5">
          <Icon name="plus" size={14} class="inline mr-1" />
          Add Course
        </button>
      </div>
    {/if}

    {#if filteredCourses.length === 0}
      <p class="text-slate-500 dark:text-slate-400 italic py-10 text-center">
        {selectedTeacherId === 'all' ? 'No courses have been created yet.' : 'No courses found for this teacher.'}
      </p>
    {:else}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        {#each filteredCourses as course}
          {@const cId = course.id || course.ID}
          {@const cTeacherId = course.teacherId || course.teacherID}

          <button
            onclick={() => openCourse(course)}
            class="card card-hover p-5 cursor-pointer w-full text-left"
          >
            <div>
              <div class="flex gap-4 items-start">
                <div class="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center text-2xl flex-shrink-0">
                  <Icon name="folder" size={28} class="text-primary" />
                </div>
                <div class="flex-1">
                  <h3 class="font-bold text-lg text-slate-900 dark:text-slate-100 leading-tight">{course.title}</h3>
                  <p class="text-primary dark:text-accent text-sm font-medium mt-1">By {getTeacherName(cTeacherId)}</p>
                  <p class="text-slate-600 dark:text-slate-400 text-sm mt-2 line-clamp-2">{course.description}</p>
                </div>
              </div>
            </div>
            <div class="mt-4 flex justify-between items-center">
              <div class="font-semibold text-green-600 dark:text-green-400 text-sm">{course.price} EGP</div>

              {#if currentUser && currentUser.role === 'teacher' && currentUser.id === cTeacherId}
                <div class="text-xs font-semibold text-primary dark:text-accent flex items-center gap-1">
                  Manage
                  <Icon name="arrowRightSm" size={14} />
                </div>
              {:else if purchasedCourseIds.includes(cId)}
                <div class="text-xs font-semibold text-green-600 dark:text-green-400 flex items-center gap-1">
                  <Icon name="checkBadge" size={14} />
                  Unlocked
                </div>
              {:else}
                <div class="text-xs font-semibold text-primary dark:text-accent flex items-center gap-1">
                  View Course
                  <Icon name="arrowRightSm" size={14} />
                </div>
              {/if}
            </div>
          </button>
        {/each}
      </div>
    {/if}
  {/if}
</div>
