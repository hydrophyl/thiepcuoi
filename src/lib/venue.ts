// src/lib/venue.ts
// Single source of truth for each reception: dates, times, addresses, map links
// and the RSVP city value the Google Sheet expects.
import type { Locale } from './locales'

export type VenueId = 'hn' | 'sg'
// 'all' = both receptions (default invitation pages)
export type Venue = 'all' | VenueId

export type VenueCard = {
  id: VenueId
  city: string
  // Local start of the reception — countdown target for this city's pages
  startDate: string
  dateLabel: (locale: Locale) => string
  time: string
  address: string
  mapUrl: string
  mapAriaLabel: (locale: Locale) => string
  accent: 'blue' | 'lilac'
  // Must match the values RSVP already submits to the Apps Script sheet
  rsvpCity: string
}

// Saigon first: it is the earlier reception, so `venueStart('all')` counts to it
export const VENUES: VenueCard[] = [
  {
    id: 'sg',
    city: 'Hồ Chí Minh',
    startDate: '2026-12-27T10:30:00',
    dateLabel: (locale) => locale.hcmDate,
    time: '10:30 AM – 2:00 PM',
    address:
      'Riverside Palace, 360D Bến Vân Đồn, Phường Vĩnh Hội, Quận 4, TP. Hồ Chí Minh',
    mapUrl:
      'https://www.google.com/maps/search/360D+B%E1%BA%BFn+V%C3%A2n+%C4%90%E1%BB%93n+V%C4%A9nh+H%E1%BB%99i+H%E1%BB%93+Ch%C3%AD+Minh',
    mapAriaLabel: (locale) => locale.hcmMapAriaLabel,
    accent: 'blue',
    rsvpCity: 'Ho Chi Minh',
  },
  {
    id: 'hn',
    city: 'Hà Nội',
    startDate: '2027-01-05T17:00:00',
    dateLabel: (locale) => locale.hanoiDate,
    time: '5:00 PM – 8:00 PM',
    address: 'Trống Đồng Palace, 65 P. Quán Sứ, Trần Hưng Đạo, Cửa Nam, Hà Nội',
    mapUrl:
      'https://www.google.com/maps/search/Tr%E1%BB%91ng+%C4%90%E1%BB%93ng+Palace+65+Qu%C3%A1n+S%E1%BB%A9+H%C3%A0+N%E1%BB%99i',
    mapAriaLabel: (locale) => locale.hanoiMapAriaLabel,
    accent: 'lilac',
    rsvpCity: 'Hanoi',
  },
]

export function venueCards(venue: Venue): VenueCard[] {
  return venue === 'all' ? VENUES : VENUES.filter((v) => v.id === venue)
}

export function venueStart(venue: Venue): Date {
  return new Date(venueCards(venue)[0].startDate)
}
