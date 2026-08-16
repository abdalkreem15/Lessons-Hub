<div class="max-w-4xl mx-auto p-6">
  <!-- Banner Header -->
  <section class="relative rounded-3xl p-8 md:p-12 text-white shadow-xl overflow-hidden mb-8">
    <div class="absolute inset-0 bg-gradient-to-r from-primary to-primary-hover rounded-3xl"></div>
    <div class="absolute inset-0 opacity-20 pointer-events-none">
      <div class="absolute top-4 right-8 w-2 h-2 bg-white/20 rounded-full"></div>
      <div class="absolute bottom-6 left-6 w-3 h-3 bg-white/15 rounded-full"></div>
      <div class="absolute top-1/2 right-1/4 w-1.5 h-1.5 bg-white/25 rounded-full"></div>
    </div>
    <div class="relative z-10">
      <h1 class="text-3xl md:text-4xl font-extrabold mb-3">About LessonsHub</h1>
      <p class="text-slate-200 text-sm md:text-base">
        Your trusted platform for finding expert private tutors tailored to your exact learning needs.
      </p>
    </div>
  </section>

  <!-- Mission & Vision Cards -->
  <section class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
    <div class="card card-hover p-6">
      <div class="flex items-start gap-4">
        <div class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Icon name="target" size={24} class="text-primary" />
        </div>
        <div>
          <h3 class="font-bold text-lg text-slate-900 dark:text-slate-100 mb-1">Our Mission</h3>
          <p class="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
            To make quality education accessible, transparent, and simple to navigate. We connect students with qualified educators dedicated to academic success.
          </p>
        </div>
      </div>
    </div>

    <div class="card card-hover p-6">
      <div class="flex items-start gap-4">
        <div class="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
          <Icon name="sparkles" size={24} class="text-accent" />
        </div>
        <div>
          <h3 class="font-bold text-lg text-slate-900 dark:text-slate-100 mb-1">Our Vision</h3>
          <p class="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
            Empowering learners to reach their full potential, one session at a time, through personalized and effective tutoring.
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- Main Content -->
  <section class="card p-8">
    <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">How It Works</h2>

    <div class="space-y-6">
      <div class="flex gap-4">
        <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm flex-shrink-0">1</div>
        <div>
          <h3 class="font-semibold text-slate-900 dark:text-slate-100 mb-1">Browse Tutors</h3>
          <p class="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
            Search through our curated list of verified subject experts across dozens of disciplines.
          </p>
        </div>
      </div>

      <div class="flex gap-4">
        <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm flex-shrink-0">2</div>
        <div>
          <h3 class="font-semibold text-slate-900 dark:text-slate-100 mb-1">Filter & Select</h3>
          <p class="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
            Filter by subject, price, and availability to find the perfect match for your learning style.
          </p>
        </div>
      </div>

      <div class="flex gap-4">
        <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm flex-shrink-0">3</div>
        <div>
          <h3 class="font-semibold text-slate-900 dark:text-slate-100 mb-1">Book & Learn</h3>
          <p class="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
            Book private sessions directly with your chosen tutor and start achieving your academic goals.
          </p>
        </div>
      </div>
    </div>
  </section>
</div>

<script lang="ts">
  import Icon from '$lib/components/Icon.svelte';
</script>
