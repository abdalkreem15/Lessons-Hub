<script lang="ts">
  let { isOpen, onClose, currentUser, onBookAdded } = $props();

  let title = $state('');
  let description = $state('');
  let link = $state('');
  let image = $state('');
  let price = $state('0');
  let error = $state('');
  let loading = $state(false);

  async function handleSubmit(e: Event) {
    e.preventDefault();
    loading = true;
    error = '';

    try {
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'addBook',
          book: {
            teacherId: currentUser.id,
            title: title,
            description: description,
            link: link,
            image: image,
            price: String(price)
          }
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to add book.');
      }

      onBookAdded({
        id: data.bookId,
        teacherId: currentUser.id,
        title: title,
        description: description,
        link: link,
        image: image,
        price: String(price)
      });

      // Reset
      title = ''; description = ''; link = ''; image = ''; price = '0';
      onClose();
    } catch (err: any) {
      error = err.message;
    } finally {
      loading = false;
    }
  }
</script>

{#if isOpen}
  <div class="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
    <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
      <button onclick={onClose} class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition cursor-pointer text-lg font-bold p-1">✕</button>

      <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Recommend a Book</h2>
      <p class="text-gray-600 dark:text-gray-400 text-sm mb-6">Add a helpful resource for your students.</p>

      {#if error}
        <div class="mb-4 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 p-3 rounded-xl text-xs">{error}</div>
      {/if}

      <form onsubmit={handleSubmit} class="space-y-4">
        <div>
          <label for="book-title" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Book Title *</label>
          <input id="book-title" type="text" bind:value={title} required class="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="e.g., The Art of Problem Solving" />
        </div>

        <div>
          <label for="book-description" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Short Description</label>
          <textarea id="book-description" bind:value={description} rows="2" class="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none" placeholder="Why do you recommend this?"></textarea>
        </div>

        <div>
          <label for="book-link" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Purchase / View Link *</label>
          <input id="book-link" type="url" bind:value={link} required class="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="https://amazon.com/dp/..." />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label for="book-image" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Cover Image URL</label>
            <input id="book-image" type="url" bind:value={image} class="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="https://..." />
          </div>
          <div>
            <label for="book-price" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Price (EGP) <span class="text-gray-400 font-normal">(0 if free)</span></label>
            <input id="book-price" type="text" inputmode="numeric" bind:value={price} class="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="0" />
          </div>
        </div>

        <button type="submit" disabled={loading} class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2.5 rounded-xl transition cursor-pointer text-sm shadow-sm">
          {loading ? 'Saving...' : 'Add Book'}
        </button>
      </form>
    </div>
  </div>
{/if}