<script lang="ts">
  import Icon from '$lib/components/Icon.svelte';
  let { isOpen, onClose, courseId, onContentAdded } = $props();

  let contentType = $state<'text' | 'video' | 'image'>('text');
  let contentValue = $state('');
  let error = $state('');
  let loading = $state(false);

  // Simple function to inject markdown formatting into the textarea
  function insertFormat(prefix: string, suffix: string) {
    const textarea = document.getElementById('content-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = contentValue.substring(start, end);
    const replacement = `${prefix}${selectedText || 'Your text here'}${suffix}`;

    contentValue = contentValue.substring(0, start) + replacement + contentValue.substring(end);

    // Refocus textarea
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + (selectedText.length || 'Your text here'.length));
    }, 0);
  }

  async function handleSubmit(e: Event) {
    e.preventDefault();
    if (!contentValue.trim()) { error = 'Content cannot be empty.'; return; }

    loading = true;
    error = '';

    try {
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'addContent',
          content: {
            courseId: courseId,
            type: contentType,
            content: contentValue
          }
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Failed to add.');

      onContentAdded({
        id: data.contentId,
        courseId: courseId,
        type: contentType,
        content: contentValue
      });

      contentValue = '';
      contentType = 'text';
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
    <div class="card w-full max-w-full sm:max-w-[50vw] p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
      <button onclick={onClose} class="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer text-lg font-bold p-1" aria-label="Close modal">
        <Icon name="close" size={20} />
      </button>

      <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">Add Course Content</h2>
      <p class="text-slate-600 dark:text-slate-400 text-sm mb-6">Add text lessons, videos, or images.</p>

      {#if error}
        <div class="mb-4 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 p-3 rounded-xl text-xs flex items-start gap-2">
          <Icon name="xCircle" size={16} class="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          {error}
        </div>
      {/if}

      <form onsubmit={handleSubmit} class="space-y-4">
        <!-- Type Selector -->
        <div class="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <button type="button" onclick={() => contentType = 'text'} class="flex-1 py-2 text-sm font-medium rounded-md transition {contentType === 'text' ? 'bg-white dark:bg-slate-900 shadow-sm text-primary dark:text-accent' : 'text-slate-600 dark:text-slate-400'} cursor-pointer">
            <Icon name="documentText" size={16} class="inline mr-1" />
            Text / Formatting
          </button>
          <button type="button" onclick={() => contentType = 'video'} class="flex-1 py-2 text-sm font-medium rounded-md transition {contentType === 'video' ? 'bg-white dark:bg-slate-900 shadow-sm text-primary dark:text-accent' : 'text-slate-600 dark:text-slate-400'} cursor-pointer">
            <Icon name="video" size={16} class="inline mr-1" />
            Video URL
          </button>
          <button type="button" onclick={() => contentType = 'image'} class="flex-1 py-2 text-sm font-medium rounded-md transition {contentType === 'image' ? 'bg-white dark:bg-slate-900 shadow-sm text-primary dark:text-accent' : 'text-slate-600 dark:text-slate-400'} cursor-pointer">
            <Icon name="image" size={16} class="inline mr-1" />
            Image URL
          </button>
        </div>

        {#if contentType === 'text'}
          <!-- Formatting Toolbar -->
          <div class="flex gap-1 border border-slate-300 dark:border-slate-700 rounded-t-lg p-2 bg-slate-50 dark:bg-slate-800/50">
            <button type="button" onclick={() => insertFormat('**', '**')} class="px-2 py-1 text-xs font-bold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer">
              <Icon name="bold" size={14} />
            </button>
            <button type="button" onclick={() => insertFormat('*', '*')} class="px-2 py-1 text-xs italic bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer">
              <Icon name="italic" size={14} />
            </button>
            <button type="button" onclick={() => insertFormat('### ', '')} class="px-2 py-1 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer">
              <Icon name="heading1" size={14} />
            </button>
            <button type="button" onclick={() => insertFormat('#### ', '')} class="px-2 py-1 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer">
              <Icon name="heading2" size={14} />
            </button>
            <button type="button" onclick={() => insertFormat('- ', '')} class="px-2 py-1 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer">
              <Icon name="list" size={14} />
            </button>
          </div>
          <textarea
            id="content-textarea"
            bind:value={contentValue}
            rows="8"
            required
            class="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-b-xl rounded-t-none px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none font-mono"
            placeholder="Write your lesson here. Use the toolbar above to format."
          ></textarea>
        {:else}
          <!-- URL Input for Video/Image -->
          <div>
            <label class="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1" for="content-url">
              {contentType === 'video' ? 'YouTube / Video URL' : 'Image URL (e.g. Imgur)'}
            </label>
            <input
              id="content-url"
              type="url"
              bind:value={contentValue}
              required
              class="input-base"
              placeholder={contentType === 'video' ? 'https://www.youtube.com/watch?v=...' : 'https://i.imgur.com/...'}
            />
            <p class="text-[10px] text-slate-400 mt-1">
              {contentType === 'video' ? 'Paste a direct YouTube or Vimeo link.' : 'Upload your image to Imgur or similar, then paste the direct link here.'}
            </p>
          </div>
        {/if}

        <button type="submit" disabled={loading} class="btn-primary w-full {loading ? 'opacity-70 cursor-not-allowed' : ''}">
          {loading ? 'Saving...' : 'Add to Course'}
        </button>
      </form>
    </div>
  </div>
{/if}
