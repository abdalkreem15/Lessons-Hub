<script lang="ts">
  import { teachers, subjects } from '$lib/data';

  let { selectedSubjectId = 'all', onSelectSubjectFilter, currentUser } = $props();

  let filteredTeachers = $derived(
    selectedSubjectId === 'all' 
      ? teachers 
      : teachers.filter(t => t.subjectIds.includes(selectedSubjectId))
  );

  let bookingStatus = $state<{ [key: string]: string }>({});
  let existingBookings = $state<any[]>([]);

  // Fetch current bookings from Google Sheets on load
  $effect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(data => {
        if (data.bookings) existingBookings = data.bookings;
      })
      .catch(() => {});
  });

  async function bookSlot(teacherId: string, slot: string) {
    if (!currentUser) {
      alert('Please sign in or register first to book a session.');
      return;
    }

    // Check if slot is already booked
    const isBooked = existingBookings.some(b => b.teacherId === teacherId && b.slot === slot);
    if (isBooked) {
      bookingStatus[teacherId] = 'This slot is already booked!';
      return;
    }

    const response = await fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'book',
        booking: {
          teacherId,
          userId: currentUser.id,
          userName: currentUser.name,
          slot,
          createdAt: new Date().toISOString()
        }
      })
    });

    const result = await response.json();
    if (result.success) {
      existingBookings = [...existingBookings, result.booking];
      bookingStatus[teacherId] = `Successfully booked: ${slot}! Check your Google Sheet.`;
    } else {
      bookingStatus[teacherId] = 'Booking failed. Try again.';
    }
  }
</script>

<div class="p-6">
  <div class="flex justify-between items-center mb-6">
    <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Available Teachers</h2>
    {#if selectedSubjectId !== 'all'}
      <button 
        class="text-sm bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition cursor-pointer"
        onclick={() => onSelectSubjectFilter('all')}
      >
        Clear Filter
      </button>
    {/if}
  </div>
  
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    {#each filteredTeachers as teacher}
      {@const teacherBookings = existingBookings.filter(b => b.teacherId === teacher.id)}
      <div class="border border-gray-200 dark:border-gray-800 p-5 rounded-xl bg-white dark:bg-gray-900 shadow-sm flex flex-col justify-between transition-colors">
        <div>
          <div class="flex gap-4 items-start">
            <img src={teacher.avatar} alt={teacher.name} class="w-16 h-16 rounded-full object-cover" />
            <div class="flex-1">
              <h3 class="font-bold text-lg text-gray-900 dark:text-gray-100">{teacher.name}</h3>
              <p class="text-gray-600 dark:text-gray-400 text-sm mt-1">{teacher.bio}</p>
              <div class="mt-2 font-semibold text-green-600 dark:text-green-400 text-sm">{teacher.price} EGP / hr</div>
            </div>
          </div>

          <!-- Time Slots Selection -->
          <div class="mt-4 border-t border-gray-100 dark:border-gray-800 pt-3">
            <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">Available Time Slots:</p>
            <div class="flex flex-wrap gap-2">
              {#each teacher.availableSlots as slot}
                {@const isTaken = teacherBookings.some(b => b.slot === slot)}
                <button 
                  disabled={isTaken}
                  onclick={() => bookSlot(teacher.id, slot)}
                  class="text-xs px-3 py-1.5 rounded-lg transition font-medium {isTaken ? 'bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed line-through' : 'bg-gray-100 dark:bg-gray-800 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 text-gray-700 dark:text-gray-300 cursor-pointer'}"
                >
                  📅 {slot} {isTaken ? '(Booked)' : ''}
                </button>
              {/each}
            </div>
            {#if bookingStatus[teacher.id]}
              <p class="text-xs text-green-600 dark:text-green-400 mt-2 font-medium">{bookingStatus[teacher.id]}</p>
            {/if}
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>