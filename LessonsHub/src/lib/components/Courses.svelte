<script lang="ts">
  let { 
    courses = [], 
    teachers = [], 
    currentUser, 
    content = [], 
    purchasedCourseIds = [], // ✅ UPDATED: Now receives IDs derived from DB
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

  // ✅ Access Control (Logic remains the same, just referencing the new prop name)
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
    let html = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    html = html.replace(/### (.*)/g, '<h3 class="text-lg font-bold mt-4 mb-2 text-gray-900 dark:text-gray-100">$1</h3>');
    html = html.replace(/#### (.*)/g, '<h4 class="text-base font-bold mt-3 mb-1 text-gray-800 dark:text-gray-200">$1</h4>');
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

    <button onclick={() => selectedCourse = null} class="mb-6 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition cursor-pointer font-medium text-sm">
      ← Back to All Courses
    </button>

    <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm mb-8">
      <div class="flex items-start gap-4">
        <div class="w-16 h-16 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-2xl flex-shrink-0">📁</div>
        <div class="flex-1">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">{selectedCourse.title}</h1>
          <p class="text-blue-600 dark:text-blue-400 text-lg font-medium mt-1">By {getTeacherName(cTeacherId)}</p>
          <p class="text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">{selectedCourse.description}</p>
        </div>
      </div>
      <div class="mt-6 text-3xl font-bold text-green-600 dark:text-green-400">{selectedCourse.price} EGP</div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      <!-- LEFT: Course Content -->
      <div class="lg:col-span-2">
        <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 border-b border-gray-200 dark:border-gray-800 pb-2">📑 Course Material</h2>
        
        {#if hasAccess}
          {#if courseContent.length > 0}
            <div class="space-y-4">
              {#each courseContent as item}
                <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
                  {#if item.type === 'text'}
                    <div class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{@html renderMarkdown(item.content)}</div>
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
            <div class="bg-gray-50 dark:bg-gray-800/50 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-10 text-center">
              <p class="text-gray-500 dark:text-gray-400 italic">No content added yet.</p>
            </div>
          {/if}
        {:else}
          <!-- LOCKED STATE -->
          <div class="space-y-4">
            {#each [1, 2, 3] as i}
              <div class="bg-gray-100 dark:bg-gray-800 rounded-xl h-40 flex items-center justify-center blur-sm select-none">
                <span class="text-gray-400 text-4xl">🔒</span>
              </div>
            {/each}
            <div class="text-center py-4">
              <p class="text-gray-600 dark:text-gray-400 font-medium">Purchase this course to unlock all materials.</p>
            </div>
          </div>
        {/if}
      </div>

      <!-- RIGHT: Actions & Sidebar -->
      <div class="space-y-6">
        <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 shadow-sm sticky top-24">
          {#if isOwner}
            <button onclick={() => onAddContent(cId)} class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition cursor-pointer text-sm shadow-sm mb-3">
              + Add Course Content
            </button>
            <p class="text-xs text-center text-gray-400">You own this course. Content is visible to you.</p>
          {:else if hasAccess}
            <div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 text-center">
              <p class="text-green-600 dark:text-green-400 font-bold text-sm">✅ Course Unlocked</p>
              <p class="text-green-500 dark:text-green-500 text-xs mt-1">You have access to all materials.</p>
            </div>
          {:else}
            <button onclick={() => onPurchase(cId)} class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl transition cursor-pointer text-lg shadow-sm">
              Buy for {selectedCourse.price} EGP
            </button>
            <p class="text-xs text-center text-gray-400 mt-2">One-time purchase. Instant access.</p>
          {/if}
        </div>
      </div>
    </div>

  {:else}
    <!-- DEFAULT GRID VIEW -->
    <div class="mb-4">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Available Courses</h2>
      <p class="text-gray-600 dark:text-gray-400 text-sm mt-1">Browse course materials and lessons created by our teachers.</p>
    </div>
    
    {#if availableTeachers.length > 0}
      <div class="flex flex-wrap gap-2 mb-6 pb-5 border-b border-gray-100 dark:border-gray-800">
        <button class="px-4 py-1.5 rounded-full text-sm font-medium transition cursor-pointer {selectedTeacherId === 'all' ? 'bg-blue-600 text-white shadow-sm' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}" onclick={() => selectedTeacherId = 'all'}>All Teachers</button>
        
        {#each availableTeachers as teacher}
          <button class="px-4 py-1.5 rounded-full text-sm font-medium transition cursor-pointer {selectedTeacherId === teacher.id ? 'bg-blue-600 text-white shadow-sm' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}" onclick={() => selectedTeacherId = teacher.id}>📚 {teacher.name}</button>
        {/each}

        {#if currentUser && currentUser.role === 'teacher'}
          <button onclick={onAddCourse} class="ml-auto px-4 py-1.5 rounded-full text-sm font-medium transition cursor-pointer bg-green-600 hover:bg-green-700 text-white shadow-sm">+ Add Course</button>
        {/if}
      </div>
    {:else if currentUser && currentUser.role === 'teacher'}
      <div class="mb-6 flex justify-end">
        <button onclick={onAddCourse} class="px-4 py-1.5 rounded-full text-sm font-medium transition cursor-pointer bg-green-600 hover:bg-green-700 text-white shadow-sm">+ Add Course</button>
      </div>
    {/if}

    {#if filteredCourses.length === 0}
      <p class="text-gray-500 dark:text-gray-400 italic py-10 text-center">
        {selectedTeacherId === 'all' ? 'No courses have been created yet.' : 'No courses found for this teacher.'}
      </p>
    {:else}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        {#each filteredCourses as course}
          {@const cId = course.id || course.ID}
          {@const cTeacherId = course.teacherId || course.teacherID}
          
          <button 
            onclick={() => openCourse(course)}
            class="border border-gray-200 dark:border-gray-800 p-5 rounded-xl bg-white dark:bg-gray-900 shadow-sm flex flex-col justify-between transition-all hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-700 cursor-pointer w-full text-left"
          >
            <div>
              <div class="flex gap-4 items-start">
                <div class="w-16 h-16 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-2xl flex-shrink-0">📁</div>
                <div class="flex-1">
                  <h3 class="font-bold text-lg text-gray-900 dark:text-gray-100 leading-tight">{course.title}</h3>
                  <p class="text-blue-600 dark:text-blue-400 text-sm font-medium mt-1">By {getTeacherName(cTeacherId)}</p>
                  <p class="text-gray-600 dark:text-gray-400 text-sm mt-2 line-clamp-2">{course.description}</p>
                </div>
              </div>
            </div>
            <div class="mt-4 flex justify-between items-center">
              <div class="font-semibold text-green-600 dark:text-green-400 text-sm">{course.price} EGP</div>
              
              {#if currentUser && currentUser.role === 'teacher' && currentUser.id === cTeacherId}
                <div class="text-xs font-semibold text-blue-600 dark:text-blue-400">Manage →</div>
              {:else if purchasedCourseIds.includes(cId)}
                <div class="text-xs font-semibold text-green-600 dark:text-green-400">✅ Unlocked</div>
              {:else}
                <div class="text-xs font-semibold text-blue-600 dark:text-blue-400">View Course →</div>
              {/if}
            </div>
          </button>
        {/each}
      </div>
    {/if}
  {/if}
</div>
