<script setup lang="ts">
import type { PilotRequest } from '~/types/pilot'

const route = useRoute()
const router = useRouter()
const { findPoint, submitRequest } = usePilotData()
const venueSlug = String(route.params.venueSlug)
const qrCode = String(route.params.qrCode)
const point = computed(() => findPoint(venueSlug, qrCode))
const language = ref<'en' | 'ml'>('en')
const feedbackType = ref<PilotRequest['feedbackType']>('issue')
const description = ref('')
const guestName = ref('')
const contact = ref('')
const submitted = ref(false)
const error = ref('')
const created = ref<PilotRequest | null>(null)

const words = computed(() => language.value === 'en' ? {
  greeting: 'How can we help?', sub: 'Tell us what happened. The venue team will see your request.', issue: 'Report an issue', service: 'Request service', feedback: 'Share feedback', description: 'What would you like to tell us?', name: 'Your name (optional)', contact: 'Phone or email (optional)', privacy: 'This is a private service request. Please do not include payment details.', submit: 'Send request'
} : {
  greeting: 'ഞങ്ങൾക്ക് എങ്ങനെ സഹായിക്കാം?', sub: 'എന്താണ് സംഭവിച്ചതെന്ന് പറയുക. വേദിയിലെ ടീം നിങ്ങളുടെ അഭ്യർത്ഥന കാണും.', issue: 'ഒരു പ്രശ്നം അറിയിക്കുക', service: 'സേവനം അഭ്യർത്ഥിക്കുക', feedback: 'അഭിപ്രായം പങ്കിടുക', description: 'നിങ്ങൾ എന്താണ് അറിയിക്കാൻ ആഗ്രഹിക്കുന്നത്?', name: 'നിങ്ങളുടെ പേര് (ഐച്ഛികം)', contact: 'ഫോൺ അല്ലെങ്കിൽ ഇമെയിൽ (ഐച്ഛികം)', privacy: 'ഇത് ഒരു സ്വകാര്യ സേവന അഭ്യർത്ഥനയാണ്. പണമിടപാട് വിവരങ്ങൾ നൽകരുത്.', submit: 'അഭ്യർത്ഥന അയയ്ക്കുക'
})

const send = () => {
  error.value = ''
  if (!point.value || description.value.trim().length < 8) { error.value = 'Please add at least 8 characters so the team can understand the request.'; return }
  created.value = submitRequest({ venue: point.value.venue, venueSlug: point.value.venueSlug, servicePoint: point.value.name, feedbackType: feedbackType.value, description: description.value.trim(), guestName: guestName.value.trim() || undefined, contact: contact.value.trim() || undefined })
  submitted.value = true
}

const continueToTracking = () => created.value && router.push(`/track/${created.value.trackingToken}`)
</script>

<template>
  <main v-if="point" class="guest-page">
    <div class="demo-badge">Demo data</div>
    <section v-if="!submitted" class="guest-card">
      <NuxtLink class="back-link" to="/">← ResolveAI pilot</NuxtLink>
      <div class="venue-mark">H</div><p class="soft-label">{{ point.name }}</p><h1>{{ words.greeting }}</h1><p class="muted">{{ words.sub }}</p>
      <div class="language-toggle"><button :class="{ selected: language === 'en' }" @click="language = 'en'">English</button><button :class="{ selected: language === 'ml' }" @click="language = 'ml'">മലയാളം</button></div>
      <form @submit.prevent="send">
        <div class="type-grid"><button v-for="item in [{ key: 'issue', icon: '!', text: words.issue }, { key: 'service', icon: '+', text: words.service }, { key: 'feedback', icon: '♥', text: words.feedback }]" :key="item.key" type="button" :class="['type-card', { selected: feedbackType === item.key }]" @click="feedbackType = item.key as PilotRequest['feedbackType']"><span>{{ item.icon }}</span>{{ item.text }}</button></div>
        <label>{{ words.description }}<textarea v-model="description" rows="5" maxlength="800" :placeholder="language === 'en' ? 'Example: The air conditioner is on, but the room is still warm.' : 'ഉദാഹരണം: എയർ കണ്ടീഷണർ പ്രവർത്തിക്കുന്നുണ്ട്, പക്ഷേ മുറി ചൂടാണ്.'" /></label>
        <label>{{ words.name }}<input v-model="guestName" autocomplete="name" /></label><label>{{ words.contact }}<input v-model="contact" autocomplete="email" /></label>
        <p class="privacy">⌾ {{ words.privacy }}</p><p v-if="error" class="form-error">{{ error }}</p><button class="button primary full" type="submit">{{ words.submit }} →</button>
      </form>
    </section>
    <section v-else class="guest-card confirmation">
      <div class="success-icon">✓</div><p class="eyebrow">Request sent</p><h1>We’ve shared this with the team.</h1><p class="muted">Your private request number is <b>{{ created?.number }}</b>. Keep the tracking link to see public updates.</p>
      <button class="button primary full" @click="continueToTracking">View request status →</button><NuxtLink class="text-link" to="/">Back to pilot home</NuxtLink>
    </section>
  </main>
  <main v-else class="guest-page"><section class="guest-card"><h1>This QR code is not active.</h1><p class="muted">Use the pilot examples from the home page.</p><NuxtLink class="button primary" to="/">Open pilot</NuxtLink></section></main>
</template>
