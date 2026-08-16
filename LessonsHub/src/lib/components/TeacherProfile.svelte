<script lang="ts">
  import Icon from '$lib/components/Icon.svelte';
  // ✅ Added books and onAddBook to props
  let { teacher, currentUser, onBack, courses = [], books = [], onAddCourse, onViewCourse, onAddBook } = $props();

  let existingBookings = $state<any[]>([]);
  let bookingStatus = $state<string>('');
  let loadingSlots = $state<string | null>(null);

  // Filter data specifically for this teacher
  let teacherCourses = $derived(courses.filter(c => c.teacherId === (teacher.id || teacher.ID)));
  let teacherBooks = $derived(books.filter(b => (b.teacherId || b.teacherID) === (teacher.id || teacher.ID)));

  function parseSlot(slotString: string) {
    const match = slotString.match(/(.*?)(?:\s*\((.*?)\))?$/);
    const time = (match ? match[1] : slotString).trim();
    const daysStr = match && match[2] ? match[2].trim() : null;
    let days = ['Any Day'];
    if (daysStr) {
      days = daysStr.split(',').map(d => d.trim());
    }
    return { time, days };
  }

  let rawSlots = $derived.by(() => {
    const slotString = teacher.slots || teacher.Slots || '10:00 AM';
    const matches = slotString.split(/,\s*(?![^(]*\))/).map((s: string) => s.trim()).filter(Boolean);
    return matches.length > 0 ? matches : [slotString];
  });

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
      if (result.success) { existingBookings = [...existingBookings, result.booking]; bookingStatus = `Successfully booked: ${finalSlotString}!`; }
      else { bookingStatus = result.message || 'Booking failed.'; }
    } catch (err) { bookingStatus = 'Network error. Try again.'; }
    finally { loadingSlots = null; }
  }
</script>

<div class="max-w-4xl mx-auto">
  <button onclick={onBack} class="mb-6 flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-accent transition cursor-pointer font-medium text-sm">
    <Icon name="arrowLeft" size={16} />
    Back to All Teachers
  </button>

  {#if teacher}
    <!-- Teacher Header -->
    <div class="card p-6 mb-8 flex flex-col md:flex-row gap-6 items-start">
      <img src={teacher.image || teacher.Image} alt={teacher.name} class="w-28 h-28 rounded-2xl object-cover bg-slate-200 dark:bg-slate-700 shadow-md" />
      <div class="flex-1">
        <h1 class="text-3xl font-bold text-slate-900 dark:text-slate-100">{teacher.name || teacher.Name}</h1>
        <p class="text-primary dark:text-accent text-lg font-medium mt-1">{teacher.subject || teacher.Subject}</p>
        <p class="text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">{teacher.bio || teacher.Bio}</p>
        <div class="mt-4 text-2xl font-bold text-green-600 dark:text-green-400">{teacher.price || teacher.Price} EGP <span class="text-sm font-normal text-slate-500 dark:text-slate-400">/ hour</span></div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

      <!-- LEFT COLUMN: Booking Slots -->
      <div class="lg:col-span-2">
        <h2 class="section-heading mb-4">
          <Icon name="calendar" size={20} class="inline mr-2 text-primary" />
          Book a Private Session
        </h2>

        <div class="space-y-4">
          {#each rawSlots as rawSlot}
            {@const parsed = parseSlot(rawSlot)}
            <div class="card p-4">
              <h3 class="font-semibold text-slate-800 dark:text-slate-200 mb-3 text-base flex items-center gap-2">
                <Icon name="clock" size={16} class="text-primary" />
                {parsed.time}
              </h3>
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
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed line-through border-slate-200 dark:border-slate-700'
                        : isLoading
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 cursor-wait border-blue-300'
                          : 'bg-slate-50 dark:bg-slate-800 hover:bg-primary hover:text-white hover:border-primary text-slate-700 dark:text-slate-300 cursor-pointer border-slate-300 dark:border-slate-600'
                      }"
                  >
                    {#if isTaken}
                      <Icon name="xCircle" size={14} class="inline mr-1" />
                      {day} (Booked)
                    {:else if isLoading}
                      <div class="inline-block w-3.5 h-3.5 mr-1 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Booking...
                    {:else}
                      <Icon name="check" size={14} class="inline mr-1" />
                      {day}
                    {/if}
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

      <!-- RIGHT COLUMN: Courses & Books -->
      <div class="space-y-8">

        <!-- Courses Section -->
        <div>
          <div class="flex justify-between items-center mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">
            <h2 class="section-heading">
              <Icon name="folder" size={20} class="inline mr-2 text-primary" />
              Courses
            </h2>
            {#if currentUser && currentUser.role === 'teacher' && (currentUser.id === (teacher.id || teacher.ID))}
              <button onclick={onAddCourse} class="text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-lg font-semibold hover:bg-primary hover:text-white transition cursor-pointer">
                <Icon name="plus" size={14} class="inline mr-1" />
                New
              </button>
            {/if}
          </div>

          {#if teacherCourses.length > 0}
            <div class="space-y-3">
              {#each teacherCourses as course}
                <div class="card p-4 flex justify-between items-center">
                  <div>
                    <h3 class="font-bold text-sm text-slate-900 dark:text-slate-100">{course.title}</h3>
                    <p class="text-green-600 dark:text-green-400 text-xs font-bold">{course.price} EGP</p>
                  </div>
                  <button
                    onclick={() => onViewCourse(course.id || course.ID)}
                    class="text-xs bg-slate-100 dark:bg-slate-700 text-primary dark:text-accent px-3 py-1.5 rounded-lg font-semibold hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white transition cursor-pointer"
                  >
                    View
                    <Icon name="arrowRightSm" size={14} class="inline ml-1" />
                  </button>
                </div>
              {/each}
            </div>
          {:else}
            <div class="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-6 text-center">
              <p class="text-slate-500 dark:text-slate-400 text-sm italic">No courses available yet.</p>
            </div>
          {/if}
        </div>

        <!-- ✅ NEW: Recommended Books Section -->
        <div>
          <div class="flex justify-between items-center mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">
            <h2 class="section-heading">
              <Icon name="book" size={20} class="inline mr-2 text-primary" />
              Recommended Books
            </h2>
            {#if currentUser && currentUser.role === 'teacher' && (currentUser.id === (teacher.id || teacher.ID))}
              <button onclick={onAddBook} class="text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-lg font-semibold hover:bg-primary hover:text-white transition cursor-pointer">
                <Icon name="plus" size={14} class="inline mr-1" />
                Add
              </button>
            {/if}
          </div>

          {#if teacherBooks.length > 0}
            <div class="space-y-3">
              {#each teacherBooks as book}
                <a href={book.link || book.Link} target="_blank" rel="noopener noreferrer" class="block card card-hover p-3 group">
                  <div class="flex gap-3">
                    <img src={book.image || book.Image || 'https://placehold.co/60x80/e2e8f0/64748b?text=Book'} alt={book.title} class="w-12 h-16 rounded-md object-cover bg-slate-200 dark:bg-slate-700 flex-shrink-0" />
                    <div class="flex-1 min-w-0">
                      <h4 class="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-primary dark:group-hover:text-accent transition truncate">{book.title || book.Title}</h4>
                      {#if book.description || book.Description}
                        <p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">{book.description || book.Description}</p>
                      {/if}
                      <div class="flex items-center gap-2 mt-1">
                        <span class="text-green-600 dark:text-green-400 text-xs font-bold">
                          {(book.price === '0' || book.Price === '0') ? 'Free' : `${book.price || book.Price} EGP`}
                        </span>
                        <Icon name="externalLink" size={12} class="text-slate-400" />
                      </div>
                    </div>
                  </div>
                </a>
              {/each}
            </div>
          {:else}
            <div class="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-6 text-center">
              <p class="text-slate-500 dark:text-slate-400 text-sm italic">No books recommended yet.</p>
            </div>
          {/if}
        </div>

      </div>
    </div>
  {/if}
</div>
