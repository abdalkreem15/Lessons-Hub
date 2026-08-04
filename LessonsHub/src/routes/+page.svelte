<script lang="ts">
  import { onMount } from 'svelte';
  import Home from '$lib/components/Home.svelte';
  import Teachers from '$lib/components/Teachers.svelte';
  import Subjects from '$lib/components/Subjects.svelte';
  import About from '$lib/components/About.svelte';
  import ContactUs from '$lib/components/ContactUs.svelte';
  import AuthModal from '$lib/components/AuthModal.svelte';

  let currentView = $state('home');
  let activeSubjectFilter = $state('all');
  let isDarkMode = $state(false);
  let isMobileMenuOpen = $state(false);
  
  let currentUser = $state<{ id: string; name: string; email: string } | null>(null);
  let isSignupModalOpen = $state(false);

  onMount(() => {
    isDarkMode = document.documentElement.classList.contains('dark');
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      currentUser = JSON.parse(savedUser);
    }
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
</script>

<div class="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex flex-col transition-colors duration-200">
  <header class="bg-gray-900 text-white shadow-md border-b border-gray-800 relative z-50">
    <nav class="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
      <button class="font-bold text-xl text-left cursor-pointer" onclick={() => { currentView = 'home'; isMobileMenuOpen = false; }}>
        🎓 LessonsHub
      </button>
      
      <!-- Desktop Navigation Links -->
      <div class="hidden md:flex items-center gap-6">
        <button class="hover:text-blue-400 transition cursor-pointer {currentView === 'home' ? 'text-blue-400 font-semibold' : ''}" onclick={() => currentView = 'home'}>Home</button>
        <button class="hover:text-blue-400 transition cursor-pointer {currentView === 'teachers' && activeSubjectFilter === 'all' ? 'text-blue-400 font-semibold' : ''}" onclick={() => { activeSubjectFilter = 'all'; currentView = 'teachers'; }}>Teachers</button>
        <button class="hover:text-blue-400 transition cursor-pointer {currentView === 'subjects' ? 'text-blue-400 font-semibold' : ''}" onclick={() => currentView = 'subjects'}>Subjects</button>
        <button class="hover:text-blue-400 transition cursor-pointer {currentView === 'about' ? 'text-blue-400 font-semibold' : ''}" onclick={() => currentView = 'about'}>About</button>
        <button class="hover:text-blue-400 transition cursor-pointer {currentView === 'contact' ? 'text-blue-400 font-semibold' : ''}" onclick={() => currentView = 'contact'}>Contact Us</button>

        <!-- Desktop Navbar Auth Button -->
        <div class="flex items-center gap-3 border-l border-gray-700 pl-6">
          {#if currentUser}
            <span class="text-xs font-medium bg-gray-800 px-3 py-1.5 rounded-lg text-blue-300">👤 {currentUser.name}</span>
            <button onclick={handleLogout} class="text-xs bg-red-600/20 hover:bg-red-600/40 text-red-400 px-3 py-1.5 rounded-lg transition cursor-pointer font-medium">Sign Out</button>
          {:else}
            <button onclick={() => isSignupModalOpen = true} class="text-xs bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition cursor-pointer font-medium">Sign In / Register</button>
          {/if}
        </div>

        <button onclick={toggleTheme} class="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition cursor-pointer text-sm" aria-label="Toggle theme">
          {#if isDarkMode}☀️{:else}🌙{/if}
        </button>
      </div>

      <!-- Mobile Right Controls (Theme Toggle & Burger Button) -->
      <div class="flex items-center gap-3 md:hidden">
        <button onclick={toggleTheme} class="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition cursor-pointer text-sm" aria-label="Toggle theme">
          {#if isDarkMode}☀️{:else}🌙{/if}
        </button>
        <button 
          onclick={() => isMobileMenuOpen = !isMobileMenuOpen} 
          class="p-2 rounded-lg bg-gray-800 text-gray-200 hover:bg-gray-700 transition cursor-pointer focus:outline-none"
          aria-label="Toggle menu"
        >
          {#if isMobileMenuOpen}
            ✕
          {:else}
            ☰
          {/if}
        </button>
      </div>
    </nav>

    <!-- Mobile Dropdown Menu -->
    {#if isMobileMenuOpen}
      <div class="md:hidden bg-gray-900 border-t border-gray-800 px-6 py-4 flex flex-col gap-3 shadow-xl">
        <button class="text-left py-2 hover:text-blue-400 transition {currentView === 'home' ? 'text-blue-400 font-semibold' : ''}" onclick={() => { currentView = 'home'; isMobileMenuOpen = false; }}>Home</button>
        <button class="text-left py-2 hover:text-blue-400 transition {currentView === 'teachers' && activeSubjectFilter === 'all' ? 'text-blue-400 font-semibold' : ''}" onclick={() => { activeSubjectFilter = 'all'; currentView = 'teachers'; isMobileMenuOpen = false; }}>Teachers</button>
        <button class="text-left py-2 hover:text-blue-400 transition {currentView === 'subjects' ? 'text-blue-400 font-semibold' : ''}" onclick={() => { currentView = 'subjects'; isMobileMenuOpen = false; }}>Subjects</button>
        <button class="text-left py-2 hover:text-blue-400 transition {currentView === 'about' ? 'text-blue-400 font-semibold' : ''}" onclick={() => { currentView = 'about'; isMobileMenuOpen = false; }}>About</button>
        <button class="text-left py-2 hover:text-blue-400 transition {currentView === 'contact' ? 'text-blue-400 font-semibold' : ''}" onclick={() => { currentView = 'contact'; isMobileMenuOpen = false; }}>Contact Us</button>

        <div class="pt-3 border-t border-gray-800 flex flex-col gap-2">
          {#if currentUser}
            <div class="text-xs font-medium bg-gray-800 px-3 py-2 rounded-lg text-blue-300">👤 {currentUser.name}</div>
            <button onclick={() => { handleLogout(); isMobileMenuOpen = false; }} class="w-full text-center text-xs bg-red-600/20 hover:bg-red-600/40 text-red-400 py-2 rounded-lg transition font-medium">Sign Out</button>
          {:else}
            <button onclick={() => { isSignupModalOpen = true; isMobileMenuOpen = false; }} class="w-full text-center text-xs bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg transition font-medium">Sign In / Register</button>
          {/if}
        </div>
      </div>
    {/if}
  </header>

  <main class="flex-1 max-w-6xl w-full mx-auto p-6">
    {#if currentView === 'home'}
      <Home onNavigate={(view: string) => currentView = view} />
    {:else if currentView === 'teachers'}
      <Teachers selectedSubjectId={activeSubjectFilter} onSelectSubjectFilter={(id: string) => activeSubjectFilter = id} {currentUser} />
    {:else if currentView === 'subjects'}
      <Subjects onSelectSubject={handleSelectSubject} />
    {:else if currentView === 'about'}
      <About />
    {:else if currentView === 'contact'}
      <ContactUs {currentUser} />
    {/if}
  </main>

  <footer class="bg-white dark:bg-gray-900 border-t dark:border-gray-800 py-4 text-center text-gray-500 text-sm transition-colors flex flex-col sm:flex-row justify-center items-center gap-2 px-6">
    <span>&copy; 2026 Private Lessons Platform. All rights reserved.</span>
    <span class="hidden sm:inline">•</span>
    <a href="https://github.com/abdalkreem15" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:underline font-medium">GitHub</a>
  </footer>
</div>

<AuthModal isOpen={isSignupModalOpen} onClose={() => isSignupModalOpen = false} onLoginSuccess={handleLoginSuccess} />
