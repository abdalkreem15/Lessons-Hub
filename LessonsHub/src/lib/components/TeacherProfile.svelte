<script lang="ts">
  let { teacher, currentUser, onBack } = $props();

  let existingBookings = $state<any[]>([]);
  let bookingStatus = $state<string>('');
  let loadingSlots = $state<string | null>(null); // Tracks which slot is currently processing

  // Parse the slot string e.g. "10:00 AM (Mon, Thu)" into { time: "10:00 AM", days: ["Mon", "Thu"] }
  function parseSlot(slotString: string) {
    const match = slotString.match(/(.*?)(?:\s*\((.*?)\))?$/);
    const time = (match ? match[1] : slotString).trim();
    const daysStr = match && match[2] ? match[2].trim() : null;
    
    let days = ['Any Day']; // Fallback if teacher didn't specify days
    if (daysStr) {
      days = daysStr.split(',').map(d => d.trim());
    }
    return { time, days };
  }

  // Get raw slots array
  let rawSlots = $derived(
    (teacher.slots || teacher.Slots || '10:00 AM').split(',').map((s: string) => s.trim()).filter(Boolean)
  );

  // Fetch bookings ONLY for this teacher
  $effect(() => {
    if (!teacher) return;
    fetch('/api/data?type=bookings')
      .then(res => res.json())
      .then(data => { 
        if (data.bookings) {
          existingBookings = data.bookings.filter((b: any) => b.teacherId === (teacher.id || teacher.ID));
        }
      })
      .catch(() => {});
  });

  async function bookSlot(time: string, day: string) {
    if (!currentUser) { alert('Please sign in to book a session.'); return; }
    
    // The exact slot string saved to Google Sheets (e.g., "10:00 AM - Monday")
    const finalSlotString = `${time} - ${day}`; 
    
    if (existingBookings.some(b => b.slot === finalSlotString)) {
      bookingStatus = `Sorry, ${finalSlotString} is already booked by someone else.`;
      return;
    }

    loadingSlots = finalSlotString;
    bookingStatus = '';

    try {
      const response = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          type: 'book', 
          booking: { 
            teacherId: teacher.id || teacher.ID, 
            userId: currentUser.id, 
            userName: currentUser.name, 
            slot: finalSlotString, 
            createdAt: new Date().toISOString() 
          } 
        })
      });

      const result = await response.json();
      if (result.success) {
        existingBookings = [...existingBookings, result.booking];
        bookingStatus = `Successfully booked: ${finalSlotString}!`;
      } else {
        bookingStatus = result.message || 'Booking failed.';
      }
    } catch (err) {
      bookingStatus = 'Network error. Try again.';
    } finally {
      loadingSlots = null;
    }
  }
</script>

<div class="max-w-4xl mx-auto">
  <!-- Back Button -->
  <button onclick={onBack} class="mb-6 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition cursor-pointer font-medium text-sm">
    ← Back to All Teachers
  </button>

  {#if teacher}
    <!-- Teacher Header Card -->
    <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm mb-8 flex flex-col md:flex-row gap-6 items-start">
      <img src={teacher.image || teacher.Image} alt={teacher.name} class="w-28 h-28 rounded-2xl object-cover bg-gray-200 dark:bg-gray-800 shadow-md" />
      <div class="flex-1">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">{teacher.name || teacher.Name}</h1>
        <p class="text-blue-600 dark:text-blue-400 text-lg font-medium mt-1">{teacher.subject || teacher.Subject}</p>
        <p class="text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">{teacher.bio || teacher.Bio}</p>
        <div class="mt-4 text-2xl font-bold text-green-600 dark:text-green-400">{teacher.price || teacher.Price} EGP <span class="text-sm font-normal text-gray-500">/ hour</span></div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      <!-- LEFT COLUMN: Available Slots -->
      <div class="lg:col-span-2">
        <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 border-b border-gray-200 dark:border-gray-800 pb-2">📅 Book a Private Session</h2>
        
        <div class="space-y-4">
          {#each rawSlots as rawSlot}
            {@const parsed = parseSlot(rawSlot)}
            <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
              <h3 class="font-semibold text-gray-800 dark:text-gray-200 mb-3 text-base">🕐 {parsed.time}</h3>
              
              <div class="flex flex-wrap gap-2">
                {#each parsed.days as day}
                  {@const finalSlotString = `${parsed.time} - ${day}`}
                  {@const isTaken = existingBookings.some(b => b.slot === finalSlotString)}
                  {@const isLoading = loadingSlots === finalSlotString}
                  
                  <button 
                    disabled={isTaken || isLoading}
                    onclick={() => bookSlot(parsed.time, day)}
                    class="px-4 py-2 rounded-lg text-sm font-medium transition border
                      {isTaken 
                        ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed line-through border-gray-200 dark:border-gray-700' 
                        : isLoading 
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 cursor-wait border-blue-300' 
                          : 'bg-gray-50 dark:bg-gray-800 hover:bg-blue-600 hover:text-white hover:border-blue-600 text-gray-700 dark:text-gray-300 cursor-pointer border-gray-300 dark:border-gray-600'
                      }"
                  >
                    {isTaken ? '✕ ' + day + ' (Booked)' : isLoading ? 'Booking...' : '✔ ' + day}
                  </button>
                {/each}
              </div>
            </div>
          {/each}
        </div>

        {#if bookingStatus}
          <div class="mt-4 p-3 rounded-xl text-sm font-medium {bookingStatus.includes('Successfully') ? 'bg-green-50 dark:bg-green-950/50 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'}">
            {bookingStatus}
          </div>
        {/if}
      </div>

      <!-- RIGHT COLUMN: Courses & Books Placeholders -->
      <div class="space-y-8">
        <!-- Courses Section -->
        <div>
          <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 border-b border-gray-200 dark:border-gray-800 pb-2">📁 Courses</h2>
          <div class="bg-gray-50 dark:bg-gray-800/50 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-6 text-center">
            <p class="text-gray-500 dark:text-gray-400 text-sm italic">Courses created by this teacher will appear here.</p>
            {#if currentUser && currentUser.role === 'teacher' && (currentUser.id === teacher.id)}
              <button class="mt-3 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 px-3 py-1.5 rounded-lg font-semibold">+ Add Course</button>
            {/if}
          </div>
        </div>

        <!-- Books Section -->
        <div>
          <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 border-b border-gray-200 dark:border-gray-800 pb-2">📘 Books & Resources</h2>
          <div class="bg-gray-50 dark:bg-gray-800/50 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-6 text-center">
            <p class="text-gray-500 dark:text-gray-400 text-sm italic">Recommended books by this teacher will appear here.</p>
            {#if currentUser && currentUser.role === 'teacher' && (currentUser.id === teacher.id)}
              <button class="mt-3 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 px-3 py-1.5 rounded-lg font-semibold">+ Add Book</button>
            {/if}
          </div>
        </div>
      </div>

    </div>
  {/if}
</div>