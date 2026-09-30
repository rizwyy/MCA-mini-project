<script setup lang="ts">
const examples = [
  { title: 'Hotel room', copy: 'Guest reports a room issue and receives a private tracking link.', to: '/feedback/harbor-house/RM204', cta: 'Try Room 204' },
  { title: 'Restaurant table', copy: 'Guest flags a service delay without downloading an app.', to: '/feedback/cove-kitchen/T12', cta: 'Try Table 12' }
]
</script>

<template>
  <main class="landing">
    <section class="hero-shell">
      <nav class="nav"><NuxtLink to="/" class="brand">Resolve<span>AI</span></NuxtLink><NuxtLink to="/ops" class="nav-link">Pilot console →</NuxtLink></nav>
      <div class="hero-grid">
        <div>
          <p class="eyebrow">Hospitality pilot prototype</p>
          <h1>Resolve guest issues <em>before</em> they become bad reviews.</h1>
          <p class="hero-copy">A deliberately small test: QR feedback, a private update link, and one simple manager queue.</p>
          <div class="hero-actions"><NuxtLink class="button primary" to="/feedback/harbor-house/RM204">Open guest flow</NuxtLink><NuxtLink class="button ghost" to="/ops">View manager queue</NuxtLink></div>
        </div>
        <div class="hero-card">
          <div class="phone-top"><span></span><b>Harbor House</b><span class="live-dot"></span></div>
          <p class="soft-label">ROOM 204</p><h3>How can we help?</h3>
          <div class="mini-option"><span>☀</span><b>The room is too warm</b></div>
          <div class="mini-option"><span>⌁</span><b>I need a service request</b></div>
          <div class="mini-track"><span>Request received</span><span>●</span></div>
        </div>
      </div>
    </section>
    <section class="proof-section">
      <p class="eyebrow">Test the real behavior, not the pitch</p>
      <h2>Two flows. One question: do guests use it and does staff respond faster?</h2>
      <div class="example-grid"><NuxtLink v-for="example in examples" :key="example.title" :to="example.to" class="example-card"><p>{{ example.title }}</p><h3>{{ example.copy }}</h3><b>{{ example.cta }} →</b></NuxtLink></div>
      <p class="demo-note">All requests in this prototype are fictional demo data. It has no live AI, authentication, database, or notification service.</p>
    </section>
  </main>
</template>
