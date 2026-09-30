<script setup lang="ts">
import QRCode from 'qrcode'
import type { Priority, RequestStatus } from '~/types/pilot'

const { requests, servicePoints, updateStatus } = usePilotData()
const priority = ref<'all' | Priority>('all')
const status = ref<'all' | RequestStatus>('all')
const selectedId = ref(requests.value[0]?.id ?? '')
const selected = computed(() => requests.value.find((item) => item.id === selectedId.value) ?? requests.value[0])
const filtered = computed(() => requests.value.filter((item) => (priority.value === 'all' || item.priority === priority.value) && (status.value === 'all' || item.status === status.value)))
const qrSource = ref('')
const isQrOpen = ref(false)
const completedCount = computed(() => requests.value.filter((item) => item.status === 'resolved').length)
const openQr = async () => {
  const point = servicePoints.value[0]
  if (!point) return
  const feedbackUrl = `${window.location.origin}/feedback/${point.venueSlug}/${point.code}`
  qrSource.value = await QRCode.toDataURL(feedbackUrl, { width: 260, margin: 1, color: { dark: '#18221e', light: '#fbfaf6' } })
  isQrOpen.value = true
}
const nextStatus = () => {
  if (!selected.value) return
  const stages: RequestStatus[] = ['received', 'acknowledged', 'in_progress', 'resolved']
  const index = stages.indexOf(selected.value.status)
  const next = stages[Math.min(index + 1, stages.length - 1)]
  if (next) updateStatus(selected.value.id, next)
}
</script>

<template>
  <main class="ops-page">
    <aside class="sidebar"><NuxtLink to="/" class="brand">Resolve<span>AI</span></NuxtLink><p class="sidebar-label">PILOT CONSOLE</p><NuxtLink class="side-link active" to="/ops">Overview</NuxtLink><a class="side-link" href="#queue">Request queue <span>{{ requests.length }}</span></a><button class="side-link" @click="openQr">QR cards</button><div class="sidebar-bottom"><b>Fictional demo</b><p>Not connected to a database, staff accounts, AI, or notifications.</p></div></aside>
    <section class="ops-content">
      <header class="ops-header"><div><p class="eyebrow">Harbor House Hotel</p><h1>Today’s guest requests</h1><p class="muted">Use this console to test whether staff respond to QR submissions.</p></div><button class="button primary" @click="openQr">Generate test QR</button></header>
      <div class="metric-grid"><div class="metric"><p>Open requests</p><b>{{ requests.filter((item) => item.status !== 'resolved').length }}</b><span>Needs attention</span></div><div class="metric"><p>High priority</p><b>{{ requests.filter((item) => item.priority === 'high' && item.status !== 'resolved').length }}</b><span>Review first</span></div><div class="metric"><p>Resolved</p><b>{{ completedCount }}</b><span>Demo only</span></div><div class="metric"><p>What to measure</p><b>Response time</b><span>Not vanity metrics</span></div></div>
      <div id="queue" class="queue-layout"><section class="queue-panel"><div class="panel-head"><div><h2>Request queue</h2><p>{{ filtered.length }} fictional requests</p></div><div class="filters"><select v-model="priority"><option value="all">All priorities</option><option value="high">High priority</option><option value="normal">Normal</option><option value="low">Low</option></select><select v-model="status"><option value="all">All statuses</option><option value="received">Received</option><option value="acknowledged">Acknowledged</option><option value="in_progress">In progress</option><option value="resolved">Resolved</option></select></div></div>
        <button v-for="request in filtered" :key="request.id" :class="['request-row', { selected: selected?.id === request.id }]" @click="selectedId = request.id"><span :class="['priority-dot', request.priority]"></span><span class="request-row-main"><b>{{ request.servicePoint }}</b><small>{{ request.category }} · {{ request.submittedAt }}</small><span>{{ request.description }}</span></span><span :class="['status-pill', request.status]">{{ request.status.replace('_', ' ') }}</span></button>
      </section>
      <aside v-if="selected" class="detail-panel"><div class="detail-top"><p class="soft-label">{{ selected.number }} · {{ selected.venue }}</p><span :class="['status-pill', selected.status]">{{ selected.status.replace('_', ' ') }}</span></div><h2>{{ selected.servicePoint }}</h2><p class="detail-description">“{{ selected.description }}”</p><dl><div><dt>Priority</dt><dd><span :class="['priority-dot', selected.priority]"></span>{{ selected.priority }}</dd></div><div><dt>Suggested category</dt><dd>{{ selected.category }}</dd></div><div><dt>Route</dt><dd>{{ selected.department }}</dd></div></dl><div class="operator-note"><b>Manual pilot rule</b><p>Staff decide routing and priority. No AI recommendation is running.</p></div><button v-if="selected.status !== 'resolved'" class="button primary full" @click="nextStatus">Advance to next status →</button><button v-else class="button muted-button full" disabled>Request resolved</button><NuxtLink class="text-link" :to="`/track/${selected.trackingToken}`">Preview guest tracking link →</NuxtLink></aside>
    </div></section>
    <div v-if="isQrOpen" class="modal-backdrop" @click.self="isQrOpen = false"><section class="qr-modal"><button class="close" @click="isQrOpen = false">×</button><p class="eyebrow">Pilot QR card</p><h2>Room 204</h2><img v-if="qrSource" :src="qrSource" alt="QR code for Room 204 feedback form"><p class="muted">Print this only after a hotel agrees to a time-bound pilot. It currently opens local demo data.</p></section></div>
  </main>
</template>
