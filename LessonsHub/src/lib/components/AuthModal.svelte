<script lang="ts">
  let { isOpen, onClose, onLoginSuccess } = $props();

  let isRegistering = $state(false);
  let name = $state('');
  let email = $state('');
  let password = $state('');
  let error = $state('');
  let loading = $state(false);

  async function handleSubmit(e: Event) {
    e.preventDefault();
    error = '';
    loading = true;

    try {
      const endpoint = isRegistering ? '/api/data?action=register' : '/api/data?action=login';
      const payload = isRegistering ? { name, email, password } : { email, password };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || 'Authentication failed');
      }

      onLoginSuccess(data.user);
      onClose();
      // Reset form
      name = '';
      email = '';
      password = '';
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
  <!-- Outer Backdrop with responsive padding -->
  <div class="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
    
    <!-- Modal Content Box (constrained max-w-md with 100% responsive width) -->
    <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative transition-colors box-border my-auto">
      
      <!-- Close Button -->
      <button 
        onclick={onClose} 
        class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition cursor-pointer text-lg font-bold p-1"
        aria-label="Close modal"
      >
        ✕
      </button>

      <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
        {isRegistering ? 'Create an Account' : 'Welcome Back'}
      </h2>
      <p class="text-gray-600 dark:text-gray-400 text-sm mb-6">
        {isRegistering ? 'Sign up to book private lessons and send messages.' : 'Sign in to access your dashboard and bookings.'}
      </p>

      {#if error}
        <div class="mb-4 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 p-3 rounded-xl text-xs">
          {error}
        </div>
      {/if}

      <form onsubmit={handleSubmit} class="space-y-4">
        {#if isRegistering}
          <div>
            <label for="auth-name" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
            <input 
              type="text" 
              id="auth-name"
              bind:value={name} 
              required 
              class="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Abdalkreem"
            />
          </div>
        {/if}

        <div>
          <label for="auth-email" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
          <input 
            type="email" 
            id="auth-email"
            bind:value={email} 
            required 
            class="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label for="auth-password" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
          <input 
            type="password" 
            id="auth-password"
            bind:value={password} 
            required 
            class="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="••••••••"
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2.5 rounded-xl transition cursor-pointer text-sm shadow-sm"
        >
          {loading ? 'Please wait...' : (isRegistering ? 'Register Account' : 'Sign In')}
        </button>
      </form>

      <div class="mt-5 text-center text-xs text-gray-600 dark:text-gray-400">
        {#if isRegistering}
          Already have an account? 
          <button onclick={toggleMode} class="text-blue-600 dark:text-blue-400 font-semibold hover:underline ml-1 cursor-pointer">Sign In</button>
        {:else}
          Don't have an account yet? 
          <button onclick={toggleMode} class="text-blue-600 dark:text-blue-400 font-semibold hover:underline ml-1 cursor-pointer">Register</button>
        {/if}
      </div>

    </div>
  </div>
{/if}
