<script lang="ts">
	import { onMount } from 'svelte';
	import Icon from '$lib/components/Icon.svelte';
	import Home from '$lib/components/Home.svelte';
	import Teachers from '$lib/components/Teachers.svelte';
	import TeacherProfile from '$lib/components/TeacherProfile.svelte';
	import Courses from '$lib/components/Courses.svelte';
	import AddCourseModal from '$lib/components/AddCourseModal.svelte';
	import AddContentModal from '$lib/components/AddContentModal.svelte';
	import AddBookModal from '$lib/components/AddBookModal.svelte';
	import About from '$lib/components/About.svelte';
	import ContactUs from '$lib/components/ContactUs.svelte';
	import { currentUser } from '$lib/stores/auth';

	let currentView = $state('home');
	let activeSubjectFilter = $state('all');
	let isDarkMode = $state(false);
	let isMobileMenuOpen = $state(false);

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
		$currentUser?.id ? userPurchases.filter(p => p.userId === $currentUser!.id).map(p => p.courseId) : []
	);

	let selectedTeacher = $state<any>(null);
	let preselectedCourseId = $state<string | null>(null);

	onMount(() => {
		isDarkMode = document.documentElement.classList.contains('dark');

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

	function handleLogout() {
		currentUser.clearUser();
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
		if (!$currentUser) {
			alert('Please sign in to purchase this course.');
			return;
		}

		try {
			const res = await fetch('/api/data', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					type: 'purchase',
					userId: $currentUser.id,
					courseId: courseId
				})
			});

			const data = await res.json();
			if (data.success) {
				// Instantly update UI locally without needing to refresh
				userPurchases = [...userPurchases, {
					id: data.purchaseId,
					userId: $currentUser.id,
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

<div class="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200 font-sans">
	<!-- ===== Header / Navigation ===== -->
	<header class="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm sticky top-0 z-50 transition-colors duration-200">
		<nav class="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
			<button
				class="font-bold text-xl text-primary dark:text-accent flex items-center gap-2 cursor-pointer"
				onclick={() => { currentView = 'home'; isMobileMenuOpen = false; }}
			>
				<Icon name="graduationCap" size={24} class="text-primary dark:text-accent" />
				LessonsHub
			</button>

			<div class="hidden md:flex items-center gap-6">
				<button
					class="nav-link {currentView === 'home' ? 'active' : ''}"
					onclick={() => currentView = 'home'}
				>Home</button>
				<button
					class="nav-link {currentView === 'teachers' && activeSubjectFilter === 'all' ? 'active' : ''}"
					onclick={() => { activeSubjectFilter = 'all'; currentView = 'teachers'; }}
				>Teachers</button>
				<button
					class="nav-link {currentView === 'courses' ? 'active' : ''}"
					onclick={() => currentView = 'courses'}
				>Courses</button>
				<button
					class="nav-link {currentView === 'about' ? 'active' : ''}"
					onclick={() => currentView = 'about'}
				>About</button>
				<button
					class="nav-link {currentView === 'contact' ? 'active' : ''}"
					onclick={() => currentView = 'contact'}
				>Contact Us</button>

				<div class="flex items-center gap-3 border-l border-slate-200 dark:border-slate-700 pl-6">
					{#if $currentUser}
						<span class="text-xs font-medium bg-primary/10 dark:bg-accent/10 text-primary dark:text-accent px-3 py-1.5 rounded-lg">
							<Icon name="user" size={14} class="inline mr-1" />
							{$currentUser.name}
						</span>
						<button
							onclick={handleLogout}
							class="text-xs text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-accent px-3 py-1.5 rounded-lg transition font-medium cursor-pointer"
						>Sign Out</button>
					{:else}
						<a
							href="/auth/login"
							class="btn-primary text-xs px-4 py-2 inline-block"
						>Sign In / Register</a>
					{/if}
				</div>

				<button
					onclick={toggleTheme}
					class="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition cursor-pointer text-sm"
					aria-label="Toggle theme"
				>
					{#if isDarkMode}
						<Icon name="sun" size={18} class="text-slate-700 dark:text-slate-200" />
					{:else}
						<Icon name="moon" size={18} class="text-slate-700" />
					{/if}
				</button>
			</div>

			<div class="flex items-center gap-3 md:hidden">
				<button
					onclick={toggleTheme}
					class="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition cursor-pointer text-sm"
					aria-label="Toggle theme"
				>
					{#if isDarkMode}
						<Icon name="sun" size={18} class="text-slate-700 dark:text-slate-200" />
					{:else}
						<Icon name="moon" size={18} class="text-slate-700" />
					{/if}
				</button>
				<button
					onclick={() => isMobileMenuOpen = !isMobileMenuOpen}
					class="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition cursor-pointer text-slate-700 dark:text-slate-200 focus:outline-none"
					aria-label="Toggle menu"
				>
					{#if isMobileMenuOpen}
						<Icon name="close" size={20} />
					{:else}
						<Icon name="menu" size={20} />
					{/if}
				</button>
			</div>
		</nav>

		{#if isMobileMenuOpen}
			<div class="md:hidden bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 px-6 py-4 flex flex-col gap-3 shadow-xl transition-colors duration-200">
				<button class="nav-link-mobile {currentView === 'home' ? 'active' : ''}" onclick={() => { currentView = 'home'; isMobileMenuOpen = false; }}>Home</button>
				<button class="nav-link-mobile {currentView === 'teachers' && activeSubjectFilter === 'all' ? 'active' : ''}" onclick={() => { activeSubjectFilter = 'all'; currentView = 'teachers'; isMobileMenuOpen = false; }}>Teachers</button>
				<button class="nav-link-mobile {currentView === 'courses' ? 'active' : ''}" onclick={() => { currentView = 'courses'; isMobileMenuOpen = false; }}>Courses</button>
				<button class="nav-link-mobile {currentView === 'about' ? 'active' : ''}" onclick={() => { currentView = 'about'; isMobileMenuOpen = false; }}>About</button>
				<button class="nav-link-mobile {currentView === 'contact' ? 'active' : ''}" onclick={() => { currentView = 'contact'; isMobileMenuOpen = false; }}>Contact Us</button>

				<div class="pt-3 border-t border-slate-200 dark:border-slate-700 flex flex-col gap-2">
					{#if $currentUser}
						<div class="text-xs font-medium bg-primary/10 dark:bg-accent/10 text-primary dark:text-accent px-3 py-2 rounded-lg">
							<Icon name="user" size={14} class="inline mr-1" />
							{$currentUser.name}
						</div>
						<button onclick={() => { handleLogout(); isMobileMenuOpen = false; }} class="w-full text-center text-xs text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-accent py-2 rounded-lg transition font-medium">Sign Out</button>
					{:else}
						<a href="/auth/login" onclick={() => isMobileMenuOpen = false} class="w-full text-center btn-primary text-xs px-4 py-2.5 inline-block">Sign In / Register</a>
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
				currentUser={$currentUser}
			/>
		{:else if currentView === 'teacher-profile'}
			<TeacherProfile
				teacher={selectedTeacher}
				currentUser={$currentUser}
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
				currentUser={$currentUser}
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
			<ContactUs currentUser={$currentUser} />
		{/if}
	</main>

	<footer class="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 py-6 text-center text-slate-600 dark:text-slate-300 text-sm transition-colors">
		<div class="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row justify-center items-center gap-2">
			<span>&copy; 2026 LessonsHub. All rights reserved.</span>
			<span class="hidden sm:inline">•</span>
			<a
				href="https://github.com/abdalkreem15"
				target="_blank"
				rel="noopener noreferrer"
				class="text-primary dark:text-accent hover:text-accent dark:hover:text-accent-hover font-medium flex items-center gap-1 transition"
			>
				<Icon name="github" size={16} />
				GitHub
			</a>
		</div>
	</footer>
</div>

{#if isCourseModalOpen && $currentUser}
	<AddCourseModal isOpen={isCourseModalOpen} onClose={() => isCourseModalOpen = false} currentUser={$currentUser} onCourseAdded={handleCourseAdded} />
{/if}

{#if isContentModalOpen && activeCourseId && $currentUser}
	<AddContentModal isOpen={isContentModalOpen} onClose={() => isContentModalOpen = false} courseId={activeCourseId} onContentAdded={handleContentAdded} />
{/if}

{#if isBookModalOpen && $currentUser}
	<AddBookModal isOpen={isBookModalOpen} onClose={() => isBookModalOpen = false} currentUser={$currentUser} onBookAdded={handleBookAdded} />
{/if}

<style>
	@reference "./layout.css";

	.nav-link {
		@apply text-slate-600 dark:text-slate-200 hover:text-primary dark:hover:text-accent transition cursor-pointer font-medium text-sm;
	}
	.nav-link.active {
		@apply text-primary dark:text-accent font-semibold;
	}
	.nav-link-mobile {
		@apply text-left py-2 text-slate-600 dark:text-slate-200 hover:text-primary dark:hover:text-accent transition font-medium text-sm;
	}
	.nav-link-mobile.active {
		@apply text-primary dark:text-accent font-semibold;
	}
</style>
