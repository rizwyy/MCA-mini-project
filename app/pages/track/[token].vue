<script setup lang="ts">
const route = useRoute()
const { findRequest, rateResolution } = usePilotData()
const token = String(route.params.token)
const request = computed(() => findRequest(token))
const rated = ref(false)
const statusText = { received: 'Received', acknowledged: 'Acknowledged', in_progress: 'Being handled', resolved: 'Resolved' }
const submitRating = (rating: number) => { rateResolution(token, rating); rated.value = true }
</script>

<template>
  <main class="guest-page">
    <div class="demo-badge">Demo data</div>
    <section v-if="request" class="guest-card track-card">
      <NuxtLink class="back-link" to="/">← ResolveAI pilot</NuxtLink><p class="soft-label">{{ request.number }} · {{ request.servicePoint }}</p><h1>{{ statusText[request.status] }}</h1>
      <p class="muted">{{ request.venue }} is handling your request through {{ request.department }}.</p>
      <div class="progress"><span v-for="step in ['received', 'acknowledged', 'in_progress', 'resolved']" :key="step" :class="{ active: ['received', 'acknowledged', 'in_progress', 'resolved'].indexOf(request.status) >= ['received', 'acknowledged', 'in_progress', 'resolved'].indexOf(step) }"></span></div>
      <div class="timeline"><article v-for="item in request.timeline" :key="`${item.at}-${item.label}`"><time>{{ item.at }}</time><div><b>{{ item.label }}</b><p>{{ item.detail }}</p></div></article></div>
      <section v-if="request.status === 'resolved'" class="rating"><p>Was this handled well?</p><div v-if="!rated"><button v-for="rating in 5" :key="rating" @click="submitRating(rating)">★</button></div><b v-else>Thank you for your feedback.</b></section>
      <p v-else class="private-note">Only public updates appear here. Your details and internal staff notes stay private.</p>
    </section>
    <section v-else class="guest-card"><h1>This tracking link is unavailable.</h1><p class="muted">The link may be invalid or the request may have been removed from this prototype.</p><NuxtLink class="button primary" to="/">Open pilot</NuxtLink></section>
  </main>
</template>
