export type RequestStatus = 'received' | 'acknowledged' | 'in_progress' | 'resolved'
export type Priority = 'high' | 'normal' | 'low'

export interface TimelineItem {
  at: string
  label: string
  detail: string
}

export interface PilotRequest {
  id: string
  trackingToken: string
  number: string
  venue: string
  venueSlug: string
  servicePoint: string
  feedbackType: 'issue' | 'service' | 'feedback'
  description: string
  guestName?: string
  contact?: string
  status: RequestStatus
  priority: Priority
  category: string
  department: string
  submittedAt: string
  timeline: TimelineItem[]
  resolutionRating?: number
}

export interface ServicePoint {
  code: string
  name: string
  venue: string
  venueSlug: string
}
