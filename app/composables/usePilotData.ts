import type { PilotRequest, RequestStatus, ServicePoint } from '~/types/pilot'

const defaultPoints: ServicePoint[] = [
  { code: 'RM204', name: 'Room 204', venue: 'Harbor House Hotel', venueSlug: 'harbor-house' },
  { code: 'LOBBY', name: 'Main Lobby', venue: 'Harbor House Hotel', venueSlug: 'harbor-house' },
  { code: 'T12', name: 'Table 12', venue: 'Cove Kitchen', venueSlug: 'cove-kitchen' }
]

const initialRequests: PilotRequest[] = [
  {
    id: 'req-101', trackingToken: 'demo-204', number: 'HH-2041', venue: 'Harbor House Hotel', venueSlug: 'harbor-house',
    servicePoint: 'Room 204', feedbackType: 'issue', description: 'The air conditioner is running but the room is still warm.',
    guestName: 'Ananya', status: 'acknowledged', priority: 'high', category: 'Air conditioning', department: 'Maintenance', submittedAt: 'Today, 10:14 AM',
    timeline: [
      { at: '10:14 AM', label: 'Received', detail: 'Your request was shared with the hotel team.' },
      { at: '10:19 AM', label: 'Acknowledged', detail: 'Maintenance has been notified and will check the room shortly.' }
    ]
  },
  {
    id: 'req-102', trackingToken: 'demo-lobby', number: 'HH-2042', venue: 'Harbor House Hotel', venueSlug: 'harbor-house',
    servicePoint: 'Main Lobby', feedbackType: 'feedback', description: 'The lobby is very clean. Thank you to the morning team.',
    status: 'received', priority: 'low', category: 'Guest feedback', department: 'Front desk', submittedAt: 'Today, 10:38 AM',
    timeline: [{ at: '10:38 AM', label: 'Received', detail: 'Your feedback was shared with the hotel team.' }]
  },
  {
    id: 'req-103', trackingToken: 'demo-table12', number: 'CK-071', venue: 'Cove Kitchen', venueSlug: 'cove-kitchen',
    servicePoint: 'Table 12', feedbackType: 'issue', description: 'We have been waiting more than 30 minutes for our order.',
    status: 'in_progress', priority: 'high', category: 'Food delay', department: 'Restaurant service', submittedAt: 'Today, 11:05 AM',
    timeline: [
      { at: '11:05 AM', label: 'Received', detail: 'Your request was shared with the restaurant team.' },
      { at: '11:08 AM', label: 'Being handled', detail: 'A manager is checking on your order now.' }
    ]
  }
]

export const usePilotData = () => {
  const requests = useState<PilotRequest[]>('pilot-requests', () => structuredClone(initialRequests))
  const servicePoints = useState<ServicePoint[]>('pilot-service-points', () => defaultPoints)

  const findPoint = (venueSlug: string, code: string) => servicePoints.value.find((point) => point.venueSlug === venueSlug && point.code === code.toUpperCase())
  const findRequest = (token: string) => requests.value.find((request) => request.trackingToken === token)

  const submitRequest = (input: Omit<PilotRequest, 'id' | 'trackingToken' | 'number' | 'status' | 'priority' | 'category' | 'department' | 'submittedAt' | 'timeline'>) => {
    const now = new Date()
    const token = `pilot-${crypto.randomUUID().slice(0, 8)}`
    const prefix = input.venueSlug === 'cove-kitchen' ? 'CK' : 'HH'
    const request: PilotRequest = {
      ...input,
      id: crypto.randomUUID(),
      trackingToken: token,
      number: `${prefix}-${Math.floor(1000 + Math.random() * 8999)}`,
      status: 'received',
      priority: input.feedbackType === 'issue' ? 'normal' : 'low',
      category: input.feedbackType === 'service' ? 'Service request' : input.feedbackType === 'feedback' ? 'Guest feedback' : 'Needs review',
      department: input.feedbackType === 'service' ? 'Front desk' : 'Manager review',
      submittedAt: `Today, ${now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`,
      timeline: [{ at: now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }), label: 'Received', detail: 'Your request was shared with the venue team.' }]
    }
    requests.value = [request, ...requests.value]
    return request
  }

  const updateStatus = (id: string, status: RequestStatus) => {
    const request = requests.value.find((item) => item.id === id)
    if (!request) return
    const labels: Record<RequestStatus, string> = { received: 'Received', acknowledged: 'Acknowledged', in_progress: 'Being handled', resolved: 'Resolved' }
    request.status = status
    request.timeline.push({ at: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }), label: labels[status], detail: status === 'resolved' ? 'The venue has marked this request resolved.' : 'The venue team updated your request.' })
  }

  const rateResolution = (token: string, rating: number) => {
    const request = findRequest(token)
    if (request) request.resolutionRating = rating
  }

  return { requests, servicePoints, findPoint, findRequest, submitRequest, updateStatus, rateResolution }
}
