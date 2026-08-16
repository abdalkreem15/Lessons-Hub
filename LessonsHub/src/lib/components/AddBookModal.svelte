<script lang="ts">
  import Icon from '$lib/components/Icon.svelte';
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
  <div class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div class="card w-full max-w-md p-6 shadow-2xl relative">
      <button onclick={onClose} class="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer text-lg font-bold p-1" aria-label="Close modal">
        <Icon name="close" size={20} />
      </button>

      <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">Recommend a Book</h2>
      <p class="text-slate-600 dark:text-slate-400 text-sm mb-6">Add a helpful resource for your students.</p>

      {#if error}
        <div class="mb-4 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 p-3 rounded-xl text-xs flex items-start gap-2">
          <Icon name="xCircle" size={16} class="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          {error}
        </div>
      {/if}

      <form onsubmit={handleSubmit} class="space-y-4">
        <div>
          <label for="book-title" class="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Book Title *</label>
          <input id="book-title" type="text" bind:value={title} required class="input-base" placeholder="e.g., The Art of Problem Solving" />
        </div>

        <div>
          <label for="book-description" class="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Short Description</label>
          <textarea id="book-description" bind:value={description} rows="2" class="input-base" placeholder="Why do you recommend this?"></textarea>
        </div>

        <div>
          <label for="book-link" class="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Purchase / View Link *</label>
          <input id="book-link" type="url" bind:value={link} required class="input-base" placeholder="https://amazon.com/dp/..." />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label for="book-image" class="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Cover Image URL</label>
            <input id="book-image" type="url" bind:value={image} class="input-base" placeholder="https://..." />
          </div>
          <div>
            <label for="book-price" class="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Price (EGP) <span class="text-slate-400 font-normal">(0 if free)</span></label>
            <input id="book-price" type="text" inputmode="numeric" bind:value={price} class="input-base" placeholder="0" />
          </div>
        </div>

        <button type="submit" disabled={loading} class="btn-primary w-full {loading ? 'opacity-70 cursor-not-allowed' : ''}">
          {loading ? 'Saving...' : 'Add Book'}
        </button>
      </form>
    </div>
  </div>
{/if}
