<script lang="ts">
	import { onMount } from 'svelte';
	import { currentUser } from '$lib/stores/auth';
	import { goto } from '$app/navigation';

	let { children }: { children: () => any } = $props();

	// If user is already logged in, redirect to home
	let user: any = null;
	const unsubscribe = currentUser.subscribe((u) => (user = u));

	onMount(() => {
		if (user) {
			goto('/');
		}
		return () => unsubscribe();
	});
</script>

<div class="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4 transition-colors duration-200">
	<div class="w-full max-w-6xl mx-auto flex items-center justify-center">
		{@render children()}
	</div>
</div>
