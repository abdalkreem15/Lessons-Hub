<script lang="ts">
  import { onMount } from 'svelte';
  import Home from '$lib/components/Home.svelte';
  import Teachers from '$lib/components/Teachers.svelte';
  import TeacherProfile from '$lib/components/TeacherProfile.svelte';
  import Courses from '$lib/components/Courses.svelte';
  import AddCourseModal from '$lib/components/AddCourseModal.svelte';
  import AddContentModal from '$lib/components/AddContentModal.svelte';
  import AddBookModal from '$lib/components/AddBookModal.svelte';
  import About from '$lib/components/About.svelte';
  import ContactUs from '$lib/components/ContactUs.svelte';
  import AuthModal from '$lib/components/AuthModal.svelte';

  let currentView = $state('home');
  let activeSubjectFilter = $state('all');
  let isDarkMode = $state(false);
  let isMobileMenuOpen = $state(false);
  
  let currentUser = $state<{ id: string; name: string; email: string; role?: string } | null>(null);
  let isSignupModalOpen = $state(false);
  let isCourseModalOpen = $state(false);
  let isContentModalOpen = $state(false);
  let isBookModalOpen = $state(false);
  let activeCourseId = $state<string | null>(null);

  let teachersData = $state<any[]>([]);
  let coursesData = $state<any[]>([]);
  let booksData = $state<any[]>([]);
  let contentData = $state<any[]>([]);
  
  // ✅ UPDATED: Now tracks raw purchase objects from the database
  let userPurchases = $state<any[]>([]);
  
  // ✅ NEW: A fast derived array of just the IDs the current user bought
  let purchasedCourseIds = $derived(
    currentUser?.id ? userPurchases.filter(p => p.userId === currentUser!.id).map(p => p.courseId) : []
  );

  let selectedTeacher = $state<any>(null);
  let preselectedCourseId = $state<string | null>(null);

  onMount(() => {
    isDarkMode = document.documentElement.classList.contains('dark');
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      currentUser = JSON.parse(savedUser);
    }

    // ✅ UPDATED: Added 'purchases' to the fetch request
    fetch('/api/data?type=teachers,courses,books,content,purchases')
      .then(res => res.json())
      .then(data => {
        if (data.teachers) teachersData = data.teachers;
        if (data.courses) coursesData = data.courses;
        if (data.books) booksData = data.books;
        if (data.content) contentData = data.content;
        if (data.purchases) userPurchases = data.purchases; // ✅ Save DB purchases
      })
      .catch(err => console.error("Failed to load sheet data:", err));
  });

  function toggleTheme() {
    isDarkMode = !isDarkMode;
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }

  function handleLoginSuccess(user: any) {
    currentUser = user;
    localStorage.setItem('user', JSON.stringify(user));
  }

  function handleLogout() {
    currentUser = null;
    localStorage.removeItem('user');
  }

  function handleSelectSubject(subjectId: string) {
    activeSubjectFilter = subjectId;
    currentView = 'teachers';
  }

  function handleSelectTeacher(teacher: any) {
    selectedTeacher = teacher;
    currentView = 'teacher-profile';
    window.scrollTo(0, 0);
  }

  function handleCourseAdded(newCourse: any) {
    coursesData = [...coursesData, newCourse];
  }

  function handleContentAdded(newContent: any) {
    contentData = [...contentData, newContent];
  }

  function handleViewCourseFromTeacher(courseId: string) {
    preselectedCourseId = courseId;
    currentView = 'courses';
    window.scrollTo(0, 0);
  }

  function handleBookAdded(newBook: any) {
    booksData = [...booksData, newBook];
  }

  // ✅ UPDATED: Now saves permanently to Google Sheets backend
  async function handlePurchase(courseId: string) {
    if (!currentUser) {
      alert('Please sign in to purchase this course.');
      return;
    }
    
    try {
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          type: 'purchase', 
          userId: currentUser.id, 
          courseId: courseId 
        })
      });

      const data = await res.json();
      if (data.success) {
        // Instantly update UI locally without needing to refresh
        userPurchases = [...userPurchases, { 
          id: data.purchaseId, 
          userId: currentUser.id, 
          courseId: courseId 
        }];
      } else {
        alert(data.message || "Purchase failed.");
      }
    } catch (err) {
      alert("Network error. Try again.");
    }
  }
</script>

<div class="min-h-screen bg-orange-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100 flex flex-col transition-colors duration-200">
  <header class="{isDarkMode ? 'bg-teal-700 text-white border-teal-800' : 'bg-orange-50 text-teal-800 border-orange-200'} shadow-md border-b sticky top-0 z-50 transition-colors duration-200">
    <nav class="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
      <button class="font-bold text-xl text-left cursor-pointer" onclick={() => { currentView = 'home'; isMobileMenuOpen = false; }}>
        🎓 LessonsHub
      </button>
      
      <div class="hidden md:flex items-center gap-6">
        <button class="{isDarkMode ? 'hover:text-orange-300' : 'hover:text-orange-600'} transition cursor-pointer {currentView === 'home' ? (isDarkMode ? 'text-orange-300' : 'text-orange-600') + ' font-semibold' : ''}" onclick={() => currentView = 'home'}>Home</button>
        <button class="{isDarkMode ? 'hover:text-orange-300' : 'hover:text-orange-600'} transition cursor-pointer {currentView === 'teachers' && activeSubjectFilter === 'all' ? (isDarkMode ? 'text-orange-300' : 'text-orange-600') + ' font-semibold' : ''}" onclick={() => { activeSubjectFilter = 'all'; currentView = 'teachers'; }}>Teachers</button>
        <button class="{isDarkMode ? 'hover:text-orange-300' : 'hover:text-orange-600'} transition cursor-pointer {currentView === 'courses' ? (isDarkMode ? 'text-orange-300' : 'text-orange-600') + ' font-semibold' : ''}" onclick={() => currentView = 'courses'}>Courses</button>
        <button class="{isDarkMode ? 'hover:text-orange-300' : 'hover:text-orange-600'} transition cursor-pointer {currentView === 'about' ? (isDarkMode ? 'text-orange-300' : 'text-orange-600') + ' font-semibold' : ''}" onclick={() => currentView = 'about'}>About</button>
        <button class="{isDarkMode ? 'hover:text-orange-300' : 'hover:text-orange-600'} transition cursor-pointer {currentView === 'contact' ? (isDarkMode ? 'text-orange-300' : 'text-orange-600') + ' font-semibold' : ''}" onclick={() => currentView = 'contact'}>Contact Us</button>

        <div class="flex items-center gap-3 {isDarkMode ? 'border-teal-600' : 'border-orange-300'} border-l pl-6">
          {#if currentUser}
            <span class="text-xs font-medium {isDarkMode ? 'bg-teal-600 text-orange-200' : 'bg-teal-100 text-teal-700'} px-3 py-1.5 rounded-lg">👤 {currentUser.name}</span>
            <button onclick={handleLogout} class="text-xs {isDarkMode ? 'bg-red-600/20 hover:bg-red-600/40 text-red-200' : 'bg-red-100 hover:bg-red-200 text-red-600'} px-3 py-1.5 rounded-lg transition cursor-pointer font-medium">Sign Out</button>
          {:else}
            <button onclick={() => isSignupModalOpen = true} class="text-xs bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition cursor-pointer font-medium">Sign In / Register</button>
          {/if}
        </div>

        <button onclick={toggleTheme} class="p-2 rounded-lg {isDarkMode ? 'bg-teal-600 hover:bg-teal-600/80' : 'bg-white hover:bg-gray-100 border border-orange-300'} transition cursor-pointer text-sm" aria-label="Toggle theme">
          {#if isDarkMode}☀️{:else}🌙{/if}
        </button>
      </div>

      <div class="flex items-center gap-3 md:hidden">
        <button onclick={toggleTheme} class="p-2 rounded-lg {isDarkMode ? 'bg-teal-600 hover:bg-teal-600/80' : 'bg-white hover:bg-gray-100 border border-orange-300'} transition cursor-pointer text-sm" aria-label="Toggle theme">
          {#if isDarkMode}☀️{:else}🌙{/if}
        </button>
        <button onclick={() => isMobileMenuOpen = !isMobileMenuOpen} class="p-2 rounded-lg {isDarkMode ? 'bg-teal-600 hover:bg-teal-600/80 text-white' : 'bg-white hover:bg-gray-100 text-teal-700 border border-orange-300'} transition cursor-pointer focus:outline-none" aria-label="Toggle menu">
          {#if isMobileMenuOpen}✕{:else}☰{/if}
        </button>
      </div>
    </nav>

    {#if isMobileMenuOpen}
      <div class="md:hidden {isDarkMode ? 'bg-teal-700 border-teal-600' : 'bg-orange-100 border-orange-300'} border-t px-6 py-4 flex flex-col gap-3 shadow-xl transition-colors duration-200">
        <button class="text-left py-2 {isDarkMode ? 'hover:text-orange-300' : 'hover:text-orange-600'} transition {currentView === 'home' ? (isDarkMode ? 'text-orange-300' : 'text-orange-600') + ' font-semibold' : ''}" onclick={() => { currentView = 'home'; isMobileMenuOpen = false; }}>Home</button>
        <button class="text-left py-2 {isDarkMode ? 'hover:text-orange-300' : 'hover:text-orange-600'} transition {currentView === 'teachers' && activeSubjectFilter === 'all' ? (isDarkMode ? 'text-orange-300' : 'text-orange-600') + ' font-semibold' : ''}" onclick={() => { activeSubjectFilter = 'all'; currentView = 'teachers'; isMobileMenuOpen = false; }}>Teachers</button>
        <button class="text-left py-2 {isDarkMode ? 'hover:text-orange-300' : 'hover:text-orange-600'} transition {currentView === 'courses' ? (isDarkMode ? 'text-orange-300' : 'text-orange-600') + ' font-semibold' : ''}" onclick={() => { currentView = 'courses'; isMobileMenuOpen = false; }}>Courses</button>
        <button class="text-left py-2 {isDarkMode ? 'hover:text-orange-300' : 'hover:text-orange-600'} transition {currentView === 'about' ? (isDarkMode ? 'text-orange-300' : 'text-orange-600') + ' font-semibold' : ''}" onclick={() => { currentView = 'about'; isMobileMenuOpen = false; }}>About</button>
        <button class="text-left py-2 {isDarkMode ? 'hover:text-orange-300' : 'hover:text-orange-600'} transition {currentView === 'contact' ? (isDarkMode ? 'text-orange-300' : 'text-orange-600') + ' font-semibold' : ''}" onclick={() => { currentView = 'contact'; isMobileMenuOpen = false; }}>Contact Us</button>

        <div class="pt-3 {isDarkMode ? 'border-teal-600' : 'border-orange-300'} border-t flex flex-col gap-2">
          {#if currentUser}
            <div class="text-xs font-medium {isDarkMode ? 'bg-teal-600 text-orange-200' : 'bg-teal-100 text-teal-700'} px-3 py-2 rounded-lg">👤 {currentUser.name}</div>
            <button onclick={() => { handleLogout(); isMobileMenuOpen = false; }} class="w-full text-center text-xs {isDarkMode ? 'bg-red-600/20 hover:bg-red-600/40 text-red-200' : 'bg-red-100 hover:bg-red-200 text-red-600'} py-2 rounded-lg transition font-medium">Sign Out</button>
          {:else}
            <button onclick={() => { isSignupModalOpen = true; isMobileMenuOpen = false; }} class="w-full text-center text-xs bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-lg transition font-medium">Sign In / Register</button>
          {/if}
        </div>
      </div>
    {/if}
  </header>

  <main class="flex-1 max-w-6xl w-full mx-auto p-6">
    {#if currentView === 'home'}
      <Home onNavigate={(view: string) => currentView = view} />
    {:else if currentView === 'teachers'}
      <Teachers 
        teachers={teachersData} 
        selectedSubjectId={activeSubjectFilter} 
        onSelectSubjectFilter={(id: string) => activeSubjectFilter = id} 
        onSelectTeacher={handleSelectTeacher}
        {currentUser} 
      />
    {:else if currentView === 'teacher-profile'}
      <TeacherProfile 
        teacher={selectedTeacher} 
        {currentUser} 
        courses={coursesData}
        books={booksData}
        onBack={() => currentView = 'teachers'} 
        onAddCourse={() => isCourseModalOpen = true}
        onViewCourse={handleViewCourseFromTeacher}
        onAddBook={() => isBookModalOpen = true}
      />
    {:else if currentView === 'courses'}
      <Courses 
        courses={coursesData} 
        teachers={teachersData} 
        {currentUser}
        content={contentData}
        purchasedCourseIds={purchasedCourseIds}
        preselectedCourseId={preselectedCourseId}
        onClearPreselected={() => preselectedCourseId = null}
        onPurchase={handlePurchase}
        onAddCourse={() => isCourseModalOpen = true}
        onAddContent={(id: string) => { activeCourseId = id; isContentModalOpen = true; }}
        onContentAdded={handleContentAdded}
      />
    {:else if currentView === 'about'}
      <About />
    {:else if currentView === 'contact'}
      <ContactUs {currentUser} />
    {/if}
  </main>

  <footer class="bg-orange-100 dark:bg-slate-800 border-t dark:border-slate-700 py-4 text-center text-gray-600 dark:text-gray-300 text-sm transition-colors flex flex-col sm:flex-row justify-center items-center gap-2 px-6">
    <span>&copy; 2026 Private Lessons Platform. All rights reserved.</span>
    <span class="hidden sm:inline">•</span>
    <a href="https://github.com/abdalkreem15" target="_blank" rel="noopener noreferrer" class="text-teal-700 dark:text-orange-400 hover:underline font-medium">GitHub</a>
  </footer>
</div>

<AuthModal isOpen={isSignupModalOpen} onClose={() => isSignupModalOpen = false} onLoginSuccess={handleLoginSuccess} />

{#if isCourseModalOpen && currentUser}
  <AddCourseModal isOpen={isCourseModalOpen} onClose={() => isCourseModalOpen = false} {currentUser} onCourseAdded={handleCourseAdded} />
{/if}

{#if isContentModalOpen && activeCourseId && currentUser}
  <AddContentModal isOpen={isContentModalOpen} onClose={() => isContentModalOpen = false} courseId={activeCourseId} onContentAdded={handleContentAdded} />
{/if}

{#if isBookModalOpen && currentUser}
  <AddBookModal isOpen={isBookModalOpen} onClose={() => isBookModalOpen = false} {currentUser} onBookAdded={handleBookAdded} />
{/if}
