<script lang="ts">
  import Icon from '$lib/components/Icon.svelte';
  let { onNavigate } = $props();
</script>

<div class="space-y-10 p-6">
  <!-- Hero Section -->
  <section class="relative rounded-3xl p-8 md:p-12 text-white shadow-xl overflow-hidden hero-bg">
    <div class="absolute inset-0 bg-gradient-to-r from-primary to-primary-hover rounded-3xl"></div>
    <div class="absolute inset-0 opacity-30 pointer-events-none hero-pattern"></div>
    <div class="relative z-10">
      <div class="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-medium mb-4">
        <Icon name="sparkles" size={14} class="text-accent" />
        Trusted by 500+ students
      </div>
      <h1 class="text-3xl md:text-5xl font-extrabold mb-4 leading-tight">Find Expert Private Tutors Today</h1>
      <p class="text-slate-200 mb-8 text-sm md:text-base leading-relaxed">
        Connect with top-rated educators for personalized private lessons tailored to your educational goals.
      </p>
      <div class="flex flex-col sm:flex-row gap-3">
        <button
          onclick={() => onNavigate('teachers')}
          class="btn-primary bg-white text-primary hover:bg-slate-50 shadow-lg hover:shadow-xl"
        >
          Explore Teachers
        </button>
        <button
          onclick={() => onNavigate('about')}
          class="btn-secondary border-white/30 text-white hover:bg-white/10"
        >
          Learn More
        </button>
      </div>
    </div>
  </section>

  <!-- Stats Section -->
  <section class="grid grid-cols-2 md:grid-cols-4 gap-4">
    <div class="card p-6 text-center card-hover">
      <div class="text-3xl font-extrabold text-primary dark:text-accent mb-1">500+</div>
      <div class="text-xs text-slate-600 dark:text-slate-400 font-medium">Expert Tutors</div>
    </div>
    <div class="card p-6 text-center card-hover">
      <div class="text-3xl font-extrabold text-primary dark:text-accent mb-1">50+</div>
      <div class="text-xs text-slate-600 dark:text-slate-400 font-medium">Subjects</div>
    </div>
    <div class="card p-6 text-center card-hover">
      <div class="text-3xl font-extrabold text-primary dark:text-accent mb-1">1.2K+</div>
      <div class="text-xs text-slate-600 dark:text-slate-400 font-medium">Happy Students</div>
    </div>
    <div class="card p-6 text-center card-hover">
      <div class="text-3xl font-extrabold text-primary dark:text-accent mb-1">4.9</div>
      <div class="text-xs text-slate-600 dark:text-slate-400 font-medium">Avg. Rating</div>
    </div>
  </section>

  <!-- Features Grid -->
  <section>
    <div class="text-center mb-8">
      <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Why Choose LessonsHub?</h2>
      <p class="text-slate-600 dark:text-slate-400 text-sm">Everything you need to succeed in your studies.</p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="card card-hover p-6 text-center">
        <div class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Icon name="star" size={24} class="text-primary" />
        </div>
        <h3 class="font-bold text-lg mb-2 text-slate-900 dark:text-slate-100">Top-Rated Tutors</h3>
        <p class="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Learn from experienced educators vetted for quality and communication.</p>
      </div>

      <div class="card card-hover p-6 text-center">
        <div class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Icon name="target" size={24} class="text-primary" />
        </div>
        <h3 class="font-bold text-lg mb-2 text-slate-900 dark:text-slate-100">Targeted Subjects</h3>
        <p class="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Filter easily by specific subjects to find the exact help you need.</p>
      </div>

      <div class="card card-hover p-6 text-center">
        <div class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Icon name="chatBubble" size={24} class="text-primary" />
        </div>
        <h3 class="font-bold text-lg mb-2 text-slate-900 dark:text-slate-100">Direct Support</h3>
        <p class="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Have questions? Reach out easily through our dedicated contact form.</p>
      </div>
    </div>
  </section>

  <!-- Call to Action -->
  <section class="card p-8 md:p-10 text-center card-hover">
    <div class="max-w-3xl mx-auto">
      <h2 class="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-3">Ready to Start Learning?</h2>
      <p class="text-slate-600 dark:text-slate-400 text-sm md:text-base mb-6">Join thousands of students who have already found their perfect tutor on LessonsHub.</p>
      <button
        onclick={() => onNavigate('teachers')}
        class="btn-primary"
      >
        Get Started Now
      </button>
    </div>
  </section>
</div>

<style>
  @reference "../../routes/layout.css";

  .hero-bg {
    background: radial circle at 50% 50%, #ffffff10 0%, transparent 70%;
  }

  .hero-pattern {
    background-image: radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.15) 1px, transparent 0);
    background-size: 20px 20px;
  }
</style>
