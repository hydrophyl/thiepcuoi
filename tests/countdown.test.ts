import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const shells = ['src/App.svelte', 'src/AppParent.svelte']

test('app shells take their countdown from the venue config', () => {
  for (const file of shells) {
    const src = readFileSync(file, 'utf8')
    assert.ok(!/new Date\('20/.test(src), `${file} must use venueStart()`)
    assert.ok(src.includes('venueStart'), `${file} must use venueStart()`)
  }
})

test('no leftover HCMC countdown literals in the app shells', () => {
  for (const file of shells) {
    const src = readFileSync(file, 'utf8')
    assert.ok(!src.includes('T18:00'), `${file} still counts to 18:00`)
    assert.ok(!src.includes('T11:00'), `${file} still counts to 11:00`)
  }
})
