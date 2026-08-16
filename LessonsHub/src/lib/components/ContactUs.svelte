<script lang="ts">
  import Icon from '$lib/components/Icon.svelte';
  let { currentUser } = $props();

  let name = $state('');
  let email = $state('');
  let message = $state('');
  let submitted = $state(false);

  function handleSubmit(e: Event) {
    e.preventDefault();

    // 1. Grab the info
    const senderName = currentUser ? currentUser.name : name;
    const senderEmail = currentUser ? currentUser.email : email;

    const yourEmail = "abdalkareemalkafoury@gmail.com";

    // 2. Format the subject and body for the email
    const subject = encodeURIComponent(`New message from LessonsHub by ${senderName}`);
    const body = encodeURIComponent(`Name: ${senderName}\nEmail: ${senderEmail}\n\nMessage:\n${message}`);

    // 3. Open the user's default email app (Gmail, Thunderbird, Outlook, etc.)
    window.location.href = `mailto:${yourEmail}?subject=${subject}&body=${body}`;

    // 4. Show the success message on your website
    submitted = true;
  }
</script>

<div class="max-w-6xl mx-auto p-6">
  <div class="card p-8">
    <div class="flex items-center gap-3 mb-6">
      <div class="w-10 h-10 rounded-xl bg-primary/10 dark:bg-accent/10 flex items-center justify-center flex-shrink-0">
        <Icon name="chatBubble" size={22} class="text-primary dark:text-accent" />
      </div>
      <div>
        <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-100">Contact Us</h2>
        <p class="text-slate-600 dark:text-slate-400 text-sm">Have questions or need support? Reach out to us directly.</p>
      </div>
    </div>

    {#if submitted}
      <div class="bg-green-50 dark:bg-green-950/50 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 p-5 rounded-xl text-sm flex items-start gap-3">
        <Icon name="checkCircle" size={20} class="text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
        <span>Thank you, <strong>{currentUser ? currentUser.name : name}</strong>! Your email client has been opened with the message ready to send.</span>
      </div>
    {:else}
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Contact Info -->
        <div class="lg:col-span-1 space-y-6">
          <div class="flex items-start gap-3">
            <div class="w-8 h-8 rounded-lg bg-primary/10 dark:bg-accent/10 flex items-center justify-center flex-shrink-0">
              <Icon name="chatBubble" size={16} class="text-primary dark:text-accent" />
            </div>
            <div>
              <h3 class="font-semibold text-slate-900 dark:text-slate-100 text-sm mb-1">Email Support</h3>
              <p class="text-slate-600 dark:text-slate-400 text-xs">abdalkareemalkafoury@gmail.com</p>
            </div>
          </div>

          <div class="flex items-start gap-3">
            <div class="w-8 h-8 rounded-lg bg-primary/10 dark:bg-accent/10 flex items-center justify-center flex-shrink-0">
              <Icon name="clock" size={16} class="text-primary dark:text-accent" />
            </div>
            <div>
              <h3 class="font-semibold text-slate-900 dark:text-slate-100 text-sm mb-1">Response Time</h3>
              <p class="text-slate-600 dark:text-slate-400 text-xs">We typically respond within 24 hours.</p>
            </div>
          </div>

          <div class="flex items-start gap-3">
            <div class="w-8 h-8 rounded-lg bg-primary/10 dark:bg-accent/10 flex items-center justify-center flex-shrink-0">
              <Icon name="user" size={16} class="text-primary dark:text-accent" />
            </div>
            <div>
              <h3 class="font-semibold text-slate-900 dark:text-slate-100 text-sm mb-1">Student & Teacher Support</h3>
              <p class="text-slate-600 dark:text-slate-400 text-xs">We're here to help with any questions about tutoring or courses.</p>
            </div>
          </div>
        </div>

        <!-- Contact Form -->
        <div class="lg:col-span-2">
          <form onsubmit={handleSubmit} class="space-y-4">
            <div>
              <label for="contact-name" class="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Your Name</label>
              <input
                type="text"
                id="contact-name"
                value={currentUser ? currentUser.name : name}
                oninput={(e) => name = e.currentTarget.value}
                disabled={!!currentUser}
                required
                class="input-base {currentUser ? 'bg-slate-100 dark:bg-slate-800/50 opacity-75' : ''}"
                placeholder="Your Name"
              />
            </div>

            <div>
              <label for="contact-email" class="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                id="contact-email"
                value={currentUser ? currentUser.email : email}
                oninput={(e) => email = e.currentTarget.value}
                disabled={!!currentUser}
                required
                class="input-base {currentUser ? 'bg-slate-100 dark:bg-slate-800/50 opacity-75' : ''}"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label for="contact-message" class="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Message</label>
              <textarea
                id="contact-message"
                bind:value={message}
                rows="5"
                required
                class="input-base"
                placeholder="How can we help you?"
              ></textarea>
            </div>

            <button
              type="submit"
              class="btn-primary w-full"
            >
              Open Email App
            </button>
          </form>
        </div>
      </div>
    {/if}
  </div>
</div>
