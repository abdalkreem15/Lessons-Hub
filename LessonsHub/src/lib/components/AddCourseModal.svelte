<script lang="ts">
  let { isOpen, onClose, currentUser, onCourseAdded } = $props();

  let title = $state('');
  let description = $state('');
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
          type: 'addCourse',
          course: {
            teacherId: currentUser.id,
            title: title,
            description: description,
            price: String(price)
          }
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to add course.');
      }

      onCourseAdded({
        id: data.courseId,
        teacherId: currentUser.id,
        title: title,
        description: description,
        price: String(price)
      });

      title = ''; description = ''; price = '0';
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
    <div class="bg-orange-50 dark:bg-slate-900 border border-orange-200 dark:border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
      <button onclick={onClose} class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition cursor-pointer text-lg font-bold p-1">✕</button>

      <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Add New Course</h2>
      <p class="text-gray-600 dark:text-gray-400 text-sm mb-6">Create a course material for your students.</p>

      {#if error}
        <div class="mb-4 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 p-3 rounded-xl text-xs">{error}</div>
      {/if}

      <form onsubmit={handleSubmit} class="space-y-4">
        <div>
          <label for="course-title" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Course Title</label>
          <input type="text" id="course-title" bind:value={title} required class="w-full border border-orange-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none" placeholder="e.g., Algebra Basics" />
        </div>

        <div>
          <label for="course-desc" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
          <textarea id="course-desc" bind:value={description} rows="3" required class="w-full border border-orange-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none resize-none" placeholder="What will students learn?"></textarea>
        </div>

        <div>
          <label for="course-price" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Price (EGP)</label>
          <input type="text" inputmode="numeric" id="course-price" bind:value={price} required class="w-full border border-orange-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none" placeholder="150" />
        </div>

        <button type="submit" disabled={loading} class="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white font-semibold py-2.5 rounded-xl transition cursor-pointer text-sm shadow-sm">
          {loading ? 'Saving...' : 'Publish Course'}
        </button>
      </form>
    </div>
  </div>
{/if}
