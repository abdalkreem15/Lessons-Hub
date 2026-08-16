<script lang="ts">
	import { goto } from '$app/navigation';
	import AuthForm from '$lib/components/AuthForm.svelte';
</script>

<svelte:head>
	<title>Sign In — LessonsHub</title>
	<meta name="description" content="Sign in to your LessonsHub account to access your dashboard and bookings." />
</svelte:head>

<div class="w-full">
	<AuthForm
		mode="login"
		onToggleMode={() => goto('/auth/register')}
	/>
</div>
