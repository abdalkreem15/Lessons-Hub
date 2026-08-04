<script lang="ts">
  let { isOpen, onClose, onLoginSuccess } = $props();

  let isRegistering = $state(false);
  let name = $state('');
  let email = $state('');
  let password = $state('');
  let errorMessage = $state('');

  async function handleSubmit(e: Event) {
    e.preventDefault();
    errorMessage = '';

    const type = isRegistering ? 'register' : 'login';
    const response = await fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, name, email, password })
    });

    const result = await response.json();
    if (result.success) {
      onLoginSuccess(result.user);
      onClose();
    } else {
      errorMessage = result.message || 'An error occurred.';
    }
  }
</script>

{#if isOpen}
  <div class="fixed inset-0 bg-black/50 backdrop-blur-xs flex justify-center items-center z-50 p-4">
    <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 w-full max-w-md shadow-xl transition-colors">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-bold text-gray-900 dark:text-gray-100">
          {isRegistering ? 'Create an Account' : 'Sign In'}
        </h3>
        <button onclick={onClose} class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer">✕</button>
      </div>

      {#if errorMessage}
        <div class="bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 p-3 rounded-xl text-xs mb-4">
          {errorMessage}
        </div>
      {/if}

      <form onsubmit={handleSubmit} class="space-y-4">
        {#if isRegistering}
          <div>
            <label for="modal-name" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
            <input 
              type="text" 
              id="modal-name"
              bind:value={name} 
              required 
              class="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Your Name"
            />
          </div>
        {/if}

        <div>
          <label for="modal-email" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
          <input 
            type="email" 
            id="modal-email"
            bind:value={email} 
            required 
            class="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label for="modal-password" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
          <input 
            type="password" 
            id="modal-password"
            bind:value={password} 
            required 
            class="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="••••••••"
          />
        </div>

        <button 
          type="submit" 
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl transition cursor-pointer text-sm shadow-sm"
        >
          {isRegistering ? 'Register' : 'Sign In'}
        </button>
      </form>

      <div class="mt-4 text-center text-xs text-gray-600 dark:text-gray-400">
        {#if isRegistering}
          Already have an account? 
          <button onclick={() => isRegistering = false} class="text-blue-600 dark:text-blue-400 font-medium hover:underline cursor-pointer">Sign In</button>
        {:else}
          Don't have an account? 
          <button onclick={() => isRegistering = true} class="text-blue-600 dark:text-blue-400 font-medium hover:underline cursor-pointer">Register</button>
        {/if}
      </div>
    </div>
  </div>
{/if}