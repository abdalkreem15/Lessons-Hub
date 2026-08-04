<script lang="ts">
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

<div class="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm transition-colors">
  <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Contact Us</h2>
  <p class="text-gray-600 dark:text-gray-400 text-sm mb-6">Have questions or need support? Reach out to us directly.</p>

  {#if submitted}
    <div class="bg-green-50 dark:bg-green-950/50 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 p-4 rounded-xl text-sm">
      Thank you, <strong>{currentUser ? currentUser.name : name}</strong>! Your email client has been opened with the message ready to send.
    </div>
  {:else}
    <form onsubmit={handleSubmit} class="space-y-4">
      <div>
        <label for="contact-name" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Your Name</label>
        <input 
          type="text" 
          id="contact-name"
          value={currentUser ? currentUser.name : name}
          oninput={(e) => name = e.currentTarget.value}
          disabled={!!currentUser}
          required 
          class="w-full border border-gray-300 dark:border-gray-700 {currentUser ? 'bg-gray-50 dark:bg-gray-800/50 opacity-75' : 'bg-white dark:bg-gray-800'} text-gray-900 dark:text-gray-100 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="Your Name"
        />
      </div>

      <div>
        <label for="contact-email" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
        <input 
          type="email" 
          id="contact-email"
          value={currentUser ? currentUser.email : email}
          oninput={(e) => email = e.currentTarget.value}
          disabled={!!currentUser}
          required 
          class="w-full border border-gray-300 dark:border-gray-700 {currentUser ? 'bg-gray-50 dark:bg-gray-800/50 opacity-75' : 'bg-white dark:bg-gray-800'} text-gray-900 dark:text-gray-100 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label for="contact-message" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
        <textarea 
          id="contact-message"
          bind:value={message} 
          rows="4" 
          required 
          class="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="How can we help you?"
        ></textarea>
      </div>

      <button 
        type="submit" 
        class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl transition cursor-pointer text-sm shadow-sm"
      >
        Open Email App
      </button>
    </form>
  {/if}
</div>
