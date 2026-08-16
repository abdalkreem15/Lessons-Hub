<script lang="ts">
	import { goto } from '$app/navigation';
	import AuthForm from '$lib/components/AuthForm.svelte';
</script>

<svelte:head>
	<title>Create Account — LessonsHub</title>
	<meta name="description" content="Create your LessonsHub account to book private lessons or start teaching." />
</svelte:head>

<div class="w-full">
	<AuthForm
		mode="register"
		onToggleMode={() => goto('/auth/login')}
	/>
</div>
