import test from 'node:test'
import assert from 'node:assert/strict'
import { VENUES, rsvpCity, venueCards, venueStart } from '../src/lib/venue.ts'

test('two venues, Saigon first', () => {
  assert.deepEqual(VENUES.map((v) => v.id), ['sg', 'hn'])
})

test('canonical start times', () => {
  assert.equal(VENUES[0].startDate, '2026-12-27T10:30:00')
  assert.equal(VENUES[1].startDate, '2027-01-05T17:00:00')
  assert.equal(venueStart('sg').getTime(), new Date('2026-12-27T10:30:00').getTime())
  assert.equal(venueStart('hn').getTime(), new Date('2027-01-05T17:00:00').getTime())
  assert.equal(venueStart('all').getTime(), new Date('2026-12-27T10:30:00').getTime())
})

test('RSVP city values match the sheet', () => {
  assert.equal(VENUES[0].rsvpCity, 'Ho Chi Minh')
  assert.equal(VENUES[1].rsvpCity, 'Hanoi')
})

test('venueCards filters or returns everything', () => {
  assert.deepEqual(venueCards('all').map((v) => v.id), ['sg', 'hn'])
  assert.deepEqual(venueCards('hn').map((v) => v.id), ['hn'])
  assert.deepEqual(venueCards('sg').map((v) => v.id), ['sg'])
})

test('rsvpCity follows the linked city and defaults to Ho Chi Minh', () => {
  assert.equal(rsvpCity('all'), 'Ho Chi Minh')
  assert.equal(rsvpCity('sg'), 'Ho Chi Minh')
  assert.equal(rsvpCity('hn'), 'Hanoi')
})
