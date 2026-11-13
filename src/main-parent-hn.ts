import { mount } from 'svelte'
import './app.css'
import AppParent from './AppParent.svelte'

const app = mount(AppParent, {
  target: document.getElementById('app')!,
  props: { venue: 'hn' },
})

export default app
