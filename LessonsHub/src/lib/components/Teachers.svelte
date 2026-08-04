<script lang="ts">
  let { teachers = [], selectedSubjectId = 'all', onSelectSubjectFilter, currentUser } = $props();

  let availableSubjects = $derived(
    Array.from(new Set(teachers.map(t => t.subject || t.Subject).filter(Boolean)))
      .map(subjectName => ({
        id: String(subjectName).toLowerCase().replace(/\s+/g, '-'),
        name: subjectName
      }))
  );

  let filteredTeachers = $derived(
    selectedSubjectId === 'all' 
      ? teachers 
      : teachers.filter(t => {
          const sub = t.subject || t.Subject || '';
          return sub.toLowerCase().includes(selectedSubjectId.toLowerCase());
        })
  );

  let bookingStatus = $state<{ [key: string]: string }>({});
  let existingBookings = $state<any[]>([]);

  $effect(() => {
    // ✅ UPDATED: Only request bookings to speed up loading and prevent timeouts!
    fetch('/api/data?type=bookings')
      .then(res => res.json())
      .then(data => { if (data.bookings) existingBookings = data.bookings; })
      .catch(() => {});
  });

  async function bookSlot(teacherId: string, slot: string) {
    if (!currentUser) { alert('Please sign in or register first to book a session.'); return; }
    const isBooked = existingBookings.some(b => b.teacherId === teacherId && b.slot === slot);
    if (isBooked) { bookingStatus[teacherId] = 'This slot is already booked!'; return; }

    const response = await fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'book', booking: { teacherId, userId: currentUser.id, userName: currentUser.name, slot, createdAt: new Date().toISOString() } })
    });

    const result = await response.json();
    if (result.success) {
      existingBookings = [...existingBookings, result.booking];
      bookingStatus[teacherId] = `Successfully booked: ${slot}!`;
    } else { bookingStatus[teacherId] = 'Booking failed. Try again.'; }
  }
</script>

<div class="p-6">
  <div class="mb-4">
    <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Available Teachers</h2>
    <p class="text-gray-600 dark:text-gray-400 text-sm mt-1">Find and book private tutors based on their expertise.</p>
  </div>
  
  {#if availableSubjects.length > 0}
    <div class="flex flex-wrap gap-2 mb-6 pb-5 border-b border-gray-100 dark:border-gray-800">
      <button class="px-4 py-1.5 rounded-full text-sm font-medium transition cursor-pointer {selectedSubjectId === 'all' ? 'bg-blue-600 text-white shadow-sm' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}" onclick={() => onSelectSubjectFilter('all')}>All Subjects</button>
      {#each availableSubjects as subject}
        <button class="px-4 py-1.5 rounded-full text-sm font-medium transition cursor-pointer {selectedSubjectId === subject.id ? 'bg-blue-600 text-white shadow-sm' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}" onclick={() => onSelectSubjectFilter(subject.id)}>📚 {subject.name}</button>
      {/each}
    </div>
  {/if}

  {#if filteredTeachers.length === 0}
    <p class="text-gray-500 dark:text-gray-400 italic py-10 text-center">No teachers found for this subject.</p>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      {#each filteredTeachers as teacher}
        {@const tId = teacher.id || teacher.ID || teacher.Id}
        {@const tName = teacher.name || teacher.Name || 'Unnamed Teacher'}
        {@const tSubject = teacher.subject || teacher.Subject || 'General'}
        {@const tBio = teacher.bio || teacher.Bio || 'Experienced private tutor.'}
        {@const tImage = teacher.image || teacher.Image || teacher.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'}
        {@const tPrice = teacher.price || teacher.Price || '150'}
        {@const teacherBookings = existingBookings.filter(b => b.teacherId === tId)}
        
        <!-- DYNAMIC SLOTS: Split the comma-separated string into an array -->
        {@const teacherSlots = (teacher.slots || teacher.Slots || '10:00 AM, 02:00 PM, 06:00 PM').split(',').map((s: string) => s.trim()).filter(Boolean)}

        <div class="border border-gray-200 dark:border-gray-800 p-5 rounded-xl bg-white dark:bg-gray-900 shadow-sm flex flex-col justify-between transition-colors">
          <div>
            <div class="flex gap-4 items-start">
              <img src={tImage} alt={tName} class="w-16 h-16 rounded-full object-cover bg-gray-200 dark:bg-gray-800" />
              <div class="flex-1">
                <h3 class="font-bold text-lg text-gray-900 dark:text-gray-100">{tName}</h3>
                <p class="text-blue-600 dark:text-blue-400 text-sm font-medium mt-0.5">{tSubject}</p>
                <p class="text-gray-600 dark:text-gray-400 text-sm mt-1">{tBio}</p>
                <div class="mt-2 font-semibold text-green-600 dark:text-green-400 text-sm">{tPrice} EGP / hr</div>
              </div>
            </div>

            <div class="mt-4 border-t border-gray-100 dark:border-gray-800 pt-3">
              <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">Available Time Slots:</p>
              <div class="flex flex-wrap gap-2">
                <!-- Loop over the DYNAMIC teacherSlots array instead of hardcoded ones -->
                {#each teacherSlots as slot}
                  {@const isTaken = teacherBookings.some(b => b.slot === slot)}
                  <button 
                    disabled={isTaken}
                    onclick={() => bookSlot(tId, slot)}
                    class="text-xs px-3 py-1.5 rounded-lg transition font-medium {isTaken ? 'bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed line-through' : 'bg-gray-100 dark:bg-gray-800 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 text-gray-700 dark:text-gray-300 cursor-pointer'}"
                  >
                    📅 {slot} {isTaken ? '(Booked)' : ''}
                  </button>
                {/each}
              </div>
              {#if bookingStatus[tId]}
                <p class="text-xs text-green-600 dark:text-green-400 mt-2 font-medium">{bookingStatus[tId]}</p>
              {/if}
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>