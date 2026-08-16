<script lang="ts">
	import { goto } from '$app/navigation';
	import Icon from '$lib/components/Icon.svelte';
	import { currentUser } from '$lib/stores/auth';

	let {
		mode = 'login',
		onToggleMode,
	}: {
		mode?: 'login' | 'register';
		onToggleMode?: () => void;
	} = $props();

	// Form fields
	let name = $state('');
	let email = $state('');
	let password = $state('');
	let confirmPassword = $state('');
	let isTeacher = $state(false);
	let subject = $state('');
	let bio = $state('');
	let imageUrl = $state('');
	let price = $state('150');
	let timeSlots = $state('10:00 AM (Mon, Wed), 02:00 PM (Sat), 06:00 PM (Thu)');

	// UI state
	let error = $state('');
	let loading = $state(false);
	let showPassword = $state(false);
	let showConfirmPassword = $state(false);

	// Validation
	let fieldErrors = $state<Record<string, string>>({});

	function validate(): boolean {
		fieldErrors = {};
		let valid = true;

		if (mode === 'register' && !name.trim()) {
			fieldErrors.name = 'Full name is required';
			valid = false;
		}

		if (!email.trim()) {
			fieldErrors.email = 'Email is required';
			valid = false;
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			fieldErrors.email = 'Please enter a valid email address';
			valid = false;
		}

		if (!password) {
			fieldErrors.password = 'Password is required';
			valid = false;
		} else if (password.length < 6) {
			fieldErrors.password = 'Password must be at least 6 characters';
			valid = false;
		}

		if (mode === 'register') {
			if (!confirmPassword) {
				fieldErrors.confirmPassword = 'Please confirm your password';
				valid = false;
			} else if (password !== confirmPassword) {
				fieldErrors.confirmPassword = 'Passwords do not match';
				valid = false;
			}
		}

		if (isTeacher) {
			if (!subject.trim()) {
				fieldErrors.subject = 'Subject is required for teachers';
				valid = false;
			}
		}

		return valid;
	}

	// Password strength calculation
	let passwordStrength = $derived.by(() => {
		if (!password) return { level: 0, label: '', color: '' };
		let score = 0;
		if (password.length >= 8) score++;
		if (/[A-Z]/.test(password)) score++;
		if (/[0-9]/.test(password)) score++;
		if (/[^A-Za-z0-9]/.test(password)) score++;

		const levels = [
			{ label: 'Weak', color: 'bg-red-400' },
			{ label: 'Fair', color: 'bg-orange-400' },
			{ label: 'Good', color: 'bg-yellow-400' },
			{ label: 'Strong', color: 'bg-green-400' },
		];
		const idx = Math.min(score, 3);
		return { level: score, label: levels[idx].label, color: levels[idx].color };
	});

	async function handleSubmit(e: Event) {
		e.preventDefault();
		error = '';
		fieldErrors = {};

		if (!validate()) return;

		loading = true;

		try {
			const endpoint = '/api/data';

			const payload = mode === 'register'
				? {
						type: 'register',
						name, email, password, isTeacher, subject, bio,
						image: imageUrl,
						price: String(price),
						slots: String(timeSlots)
					}
				: {
						type: 'login',
						email,
						password
					};

			const res = await fetch(endpoint, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload)
			});

			const data = await res.json();

			if (!res.ok || !data.success || data.error) {
				throw new Error(data.message || data.error || 'Authentication failed');
			}

			// Save user to the shared auth store
			currentUser.setUser(data.user);

			// Redirect to home
			goto('/');
		} catch (err: any) {
			error = err.message;
		} finally {
			loading = false;
		}
	}

	function handleToggleMode() {
		if (onToggleMode) {
			onToggleMode();
		}
	}
</script>

<div class="w-full mx-auto">
	<!-- Back to Home -->
	<div class="mb-4">
		<button
			type="button"
			onclick={() => goto('/')}
			class="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border-2 border-primary dark:border-accent rounded-xl shadow-md text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-primary hover:text-white dark:hover:bg-accent dark:hover:border-accent dark:hover:text-white transition-all duration-200 group"
			aria-label="Back to home"
		>
			<Icon name="arrowLeft" size={18} class="group-hover:-translate-x-1 transition-transform duration-200" />
			<span>Back to Home</span>
		</button>
	</div>

	<div class="card p-8 shadow-2xl">
		<!-- Header -->
		<div class="text-center mb-8">
			<div class="w-16 h-16 rounded-full bg-primary/10 dark:bg-accent/10 flex items-center justify-center mx-auto mb-3">
				<Icon name={mode === 'register' ? 'userPlus' : 'lock'} size={28} class="text-primary dark:text-accent" />
			</div>
			<h2 class="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">
				{mode === 'register' ? 'Create Your Account' : 'Welcome Back'}
			</h2>
			<p class="text-slate-600 dark:text-slate-400 text-sm">
				{mode === 'register'
					? 'Sign up to book private lessons or teach your subject.'
					: 'Sign in to access your dashboard and bookings.'}
			</p>
		</div>

		<!-- Error Banner -->
		{#if error}
			<div class="mb-4 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 p-3 rounded-xl text-xs flex items-start gap-2">
				<Icon name="xCircle" size={16} class="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
				{error}
			</div>
		{/if}

		<form onsubmit={handleSubmit} class="space-y-4">
			<!-- Name (register only) -->
			{#if mode === 'register'}
				<div>
					<label for="auth-name" class="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
					<div class="relative">
						<Icon name="user" size={18} class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
						<input
							type="text"
							id="auth-name"
							bind:value={name}
							required
							class="input-base pl-10"
							placeholder="Abdalkreem"
						/>
					</div>
					{#if fieldErrors.name}
						<p class="text-xs text-red-600 dark:text-red-400 mt-1">{fieldErrors.name}</p>
					{/if}
				</div>
			{/if}

			<!-- Email -->
			<div>
				<label for="auth-email" class="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
				<div class="relative">
					<Icon name="mail" size={18} class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
					<input
						type="email"
						id="auth-email"
						bind:value={email}
						required
						class="input-base pl-10"
						placeholder="you@example.com"
					/>
				</div>
				{#if fieldErrors.email}
					<p class="text-xs text-red-600 dark:text-red-400 mt-1">{fieldErrors.email}</p>
				{/if}
			</div>

			<!-- Password -->
			<div>
				<label for="auth-password" class="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label>
				<div class="relative">
					<Icon name="key" size={18} class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
					<input
						type={showPassword ? 'text' : 'password'}
						id="auth-password"
						bind:value={password}
						required
						class="input-base pl-10 pr-12"
						placeholder="••••••••"
					/>
					<button
						type="button"
						onclick={() => showPassword = !showPassword}
						class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition"
						aria-label={showPassword ? 'Hide password' : 'Show password'}
					>
						<Icon name={showPassword ? 'eyeSlash' : 'eye'} size={18} />
					</button>
				</div>
				{#if fieldErrors.password}
					<p class="text-xs text-red-600 dark:text-red-400 mt-1">{fieldErrors.password}</p>
				{/if}

				<!-- Password Strength (register only) -->
				{#if mode === 'register' && password}
					<div class="mt-2">
						<div class="flex items-center justify-between mb-1">
							<span class="text-xs text-slate-500 dark:text-slate-400">Password Strength</span>
							<span class={`text-xs font-medium ${passwordStrength.color.replace('bg-', 'text-').replace('-400', '-500')}`}>{passwordStrength.label}</span>
						</div>
						<div class="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
							<div class={`h-full transition-all duration-300 ${passwordStrength.color}`} style={`width: ${(passwordStrength.level / 4) * 100}%`}></div>
						</div>
					</div>
				{/if}
			</div>

			<!-- Confirm Password (register only) -->
			{#if mode === 'register'}
				<div>
					<label for="auth-confirm-password" class="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Confirm Password</label>
					<div class="relative">
						<Icon name="key" size={18} class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
						<input
							type={showConfirmPassword ? 'text' : 'password'}
							id="auth-confirm-password"
							bind:value={confirmPassword}
							required
							class="input-base pl-10 pr-12"
							placeholder="••••••••"
						/>
						<button
							type="button"
							onclick={() => showConfirmPassword = !showConfirmPassword}
							class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition"
							aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
						>
							<Icon name={showConfirmPassword ? 'eyeSlash' : 'eye'} size={18} />
						</button>
					</div>
					{#if fieldErrors.confirmPassword}
						<p class="text-xs text-red-600 dark:text-red-400 mt-1">{fieldErrors.confirmPassword}</p>
					{/if}
				</div>
			{/if}

			<!-- Teacher Registration Fields -->
			{#if mode === 'register'}
				<div class="pt-2 border-t border-slate-200 dark:border-slate-700">
					<label class="flex items-center gap-2 cursor-pointer select-none">
						<input
							type="checkbox"
							bind:checked={isTeacher}
							class="rounded border-slate-300 dark:border-slate-600 text-primary dark:text-accent focus:ring-primary dark:focus:ring-accent w-4 h-4"
						/>
						<span class="text-xs font-semibold text-slate-800 dark:text-slate-200">Register as a Teacher</span>
					</label>
				</div>

				{#if isTeacher}
					<div class="space-y-3 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
						<!-- Subject -->
						<div>
							<label for="auth-subject" class="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Teaching Subject</label>
							<div class="relative">
								<Icon name="bookOpen" size={18} class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
								<input
									type="text"
									id="auth-subject"
									bind:value={subject}
									required={isTeacher}
									class="input-base pl-10"
									placeholder="e.g., Mathematics"
								/>
							</div>
							{#if fieldErrors.subject}
								<p class="text-xs text-red-600 dark:text-red-400 mt-1">{fieldErrors.subject}</p>
							{/if}
						</div>

						<!-- Bio -->
						<div>
							<label for="auth-bio" class="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Short Bio / Experience</label>
							<textarea
								id="auth-bio"
								bind:value={bio}
								rows="2"
								class="input-base"
								placeholder="Tell students about your background..."
							></textarea>
						</div>

						<!-- Price & Image -->
						<div class="grid grid-cols-2 gap-3">
							<div>
								<label for="auth-price" class="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Price / hr (EGP)</label>
								<input
									type="text"
									inputmode="numeric"
									id="auth-price"
									bind:value={price}
									class="input-base"
									placeholder="150"
								/>
							</div>
							<div>
								<label for="auth-image" class="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Image URL <span class="text-slate-400 font-normal">(Opt)</span></label>
								<input
									type="url"
									id="auth-image"
									bind:value={imageUrl}
									class="input-base"
									placeholder="https://..."
								/>
							</div>
						</div>

						<!-- Time Slots -->
						<div>
							<label for="auth-slots" class="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Available Time Slots & Days</label>
							<input
								type="text"
								id="auth-slots"
								bind:value={timeSlots}
								class="input-base"
								placeholder="10:00 AM (Mon, Wed), 02:00 PM (Sat)"
							/>
							<p class="text-[10px] text-slate-400 mt-1">Format: Time (Days). Separate slots with a comma. E.g., 05:00 PM (Tue, Thu)</p>
						</div>
					</div>
				{/if}
			{/if}

			<!-- Submit Button -->
			<button type="submit" disabled={loading} class="btn-primary w-full mt-2">
				{#if loading}
					<span class="flex items-center justify-center gap-2">
						<svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
							<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
							<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
						</svg>
						{mode === 'register' ? 'Creating Account...' : 'Signing In...'}
					</span>
				{:else}
					{mode === 'register' ? 'Create Account' : 'Sign In'}
				{/if}
			</button>
		</form>

		<!-- Toggle Mode -->
		<div class="mt-5 text-center text-sm text-slate-600 dark:text-slate-400">
			{#if mode === 'register'}
				Already have an account?
				<button
					onclick={handleToggleMode}
					class="text-primary dark:text-accent font-semibold hover:underline ml-1 cursor-pointer"
				>
					Sign In
				</button>
			{:else}
				Don't have an account yet?
				<button
					onclick={handleToggleMode}
					class="text-primary dark:text-accent font-semibold hover:underline ml-1 cursor-pointer"
				>
					Register
				</button>
			{/if}
		</div>
	</div>
</div>
