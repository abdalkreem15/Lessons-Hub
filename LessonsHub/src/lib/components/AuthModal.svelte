<script lang="ts">
  import Icon from '$lib/components/Icon.svelte';
  let { isOpen, onClose, onLoginSuccess } = $props();

  let isRegistering = $state(false);
  let name = $state('');
  let email = $state('');
  let password = $state('');

  let isTeacher = $state(false);
  let subject = $state('');
  let bio = $state('');
  let imageUrl = $state('');
  let price = $state('150');
  // ✅ UPDATED: Default value now includes days
  let timeSlots = $state('10:00 AM (Mon, Wed), 02:00 PM (Sat), 06:00 PM (Thu)');

  let error = $state('');
  let loading = $state(false);

  async function handleSubmit(e: Event) {
    e.preventDefault();
    error = '';
    loading = true;

    try {
      const endpoint = '/api/data';

      const payload = isRegistering
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

      onLoginSuccess(data.user);
      onClose();

      // ✅ UPDATED: Reset form with the new day format
      name = ''; email = ''; password = ''; isTeacher = false;
      subject = ''; bio = ''; imageUrl = ''; price = '150';
      timeSlots = '10:00 AM (Mon, Wed), 02:00 PM (Sat), 06:00 PM (Thu)';
    } catch (err: any) {
      error = err.message;
    } finally {
      loading = false;
    }
  }

  function toggleMode() {
    isRegistering = !isRegistering;
    error = '';
  }
</script>

{#if isOpen}
  <div class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
    <div class="card w-full max-w-md p-6 shadow-2xl relative box-border my-auto">

      <button onclick={onClose} class="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer text-lg font-bold p-1" aria-label="Close modal">
        <Icon name="close" size={20} />
      </button>

      <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">
        {isRegistering ? 'Create an Account' : 'Welcome Back'}
      </h2>
      <p class="text-slate-600 dark:text-slate-400 text-sm mb-6">
        {isRegistering ? 'Sign up to book private lessons or teach your subject.' : 'Sign in to access your dashboard and bookings.'}
      </p>

      {#if error}
        <div class="mb-4 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 p-3 rounded-xl text-xs flex items-start gap-2">
          <Icon name="xCircle" size={16} class="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          {error}
        </div>
      {/if}

      <form onsubmit={handleSubmit} class="space-y-4">
        {#if isRegistering}
          <div>
            <label for="auth-name" class="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
            <input type="text" id="auth-name" bind:value={name} required class="input-base" placeholder="Abdalkreem" />
          </div>
        {/if}

        <div>
          <label for="auth-email" class="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
          <input type="email" id="auth-email" bind:value={email} required class="input-base" placeholder="you@example.com" />
        </div>

        <div>
          <label for="auth-password" class="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label>
          <input type="password" id="auth-password" bind:value={password} required class="input-base" placeholder="••••••••" />
        </div>

        {#if isRegistering}
          <div class="pt-2 border-t border-slate-200 dark:border-slate-700">
            <label class="flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox" bind:checked={isTeacher} class="rounded border-slate-300 text-primary focus:ring-primary w-4 h-4" />
              <span class="text-xs font-semibold text-slate-800 dark:text-slate-200">Register as a Teacher</span>
            </label>
          </div>

          {#if isTeacher}
            <div class="space-y-3 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
              <div>
                <label for="auth-subject" class="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Teaching Subject</label>
                <input type="text" id="auth-subject" bind:value={subject} required={isTeacher} class="input-base" placeholder="e.g., Mathematics" />
              </div>

              <div>
                <label for="auth-bio" class="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Short Bio / Experience</label>
                <textarea id="auth-bio" bind:value={bio} rows="2" class="input-base" placeholder="Tell students about your background..."></textarea>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label for="auth-price" class="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Price / hr (EGP)</label>
                  <input type="text" inputmode="numeric" id="auth-price" bind:value={price} class="input-base" placeholder="150" />
                </div>
                <div>
                  <label for="auth-image" class="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Image URL <span class="text-slate-400 font-normal">(Opt)</span></label>
                  <input type="url" id="auth-image" bind:value={imageUrl} class="input-base" placeholder="https://..." />
                </div>
              </div>

              <div>
                <label for="auth-slots" class="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Available Time Slots & Days</label>
                <input type="text" id="auth-slots" bind:value={timeSlots} class="input-base" placeholder="10:00 AM (Mon, Wed), 02:00 PM (Sat)" />
                <p class="text-[10px] text-slate-400 mt-1">Format: Time (Days). Separate slots with a comma. E.g., 05:00 PM (Tue, Thu)</p>
              </div>
            </div>
          {/if}
        {/if}

        <button type="submit" disabled={loading} class="btn-primary w-full {loading ? 'opacity-70 cursor-not-allowed' : ''}">
          {loading ? 'Please wait...' : (isRegistering ? 'Register Account' : 'Sign In')}
        </button>
      </form>

      <div class="mt-5 text-center text-xs text-slate-600 dark:text-slate-400">
        {#if isRegistering}
          Already have an account? <button onclick={toggleMode} class="text-primary dark:text-accent font-semibold hover:underline ml-1 cursor-pointer">Sign In</button>
        {:else}
          Don't have an account yet? <button onclick={toggleMode} class="text-primary dark:text-accent font-semibold hover:underline ml-1 cursor-pointer">Register</button>
        {/if}
      </div>
    </div>
  </div>
{/if}
