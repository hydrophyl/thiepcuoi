<script lang="ts">
  import type { Locale } from './locales';

  export let guestName = '';
  export let appellation = 'chúng tôi';
  export let salutation = '';
  export let locale: Locale;

  let name = '';
  $: if (!name && guestName) name = guestName;
  let guests = 1;
  let city = 'Ho Chi Minh';
  let attendance = 'yes';
  let confirmBy = '';
  let submitted = false;
  let loading = false;

  // --- Validation ---
  let errors = { name: '', guests: '', confirmBy: '' };

  function validate() {
    errors = { name: '', guests: '', confirmBy: '' };
    let valid = true;

    if (!name.trim()) {
      errors.name = locale.nameError;
      valid = false;
    } else if (name.trim().length > 100) {
      errors.name = locale.nameTooLong;
      valid = false;
    }

    if (attendance !== 'no') {
      if (!Number.isInteger(guests) || guests < 1 || guests > 20) {
        errors.guests = locale.guestsError;
        valid = false;
      }
    }

    if (attendance === 'maybe' && !confirmBy) {
      errors.confirmBy = locale.confirmByError({salutation});
      valid = false;
    }

    return valid;
  }

  const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzZYJcMRxgHgTP1MFbeQTLAJp_iHkG-y12U-Idv4PkmkfReLEwjfvvYcXYS0I05oDjK/exec';

  async function handleSubmit() {
    if (!validate()) return;
    loading = true;
    try {
      await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), guests, city, attendance, confirmBy }),
      });
    } catch (e) {
      console.error('Error submitting RSVP:', e);
    }
    loading = false;
    submitted = true;
  }
</script>

<section class="py-24 bg-white relative overflow-hidden">
  <div class="absolute -top-12.5 -right-12.5 w-64 h-64 bg-pastelLila/10 rounded-full blur-3xl"></div>
  <div class="absolute -bottom-12.5 -left-12.5 w-64 h-64 bg-pastelBlue/10 rounded-full blur-3xl"></div>
  
  <div class="max-w-2xl mx-auto px-4 relative z-10">
    <div class="bg-white/70 backdrop-blur-md border border-gray-100 p-8 md:p-12 rounded-3xl shadow-xl">
      <h2 class="text-4xl md:text-6xl font-script text-center text-gray-800 mb-4">{locale.rsvpTitle}</h2>
      <p class="text-center text-gray-500 mb-8">{locale.rsvpSubtitle({ salutation, appellation })}</p>
      
      {#if submitted}
        <div class="text-center py-10 animate-fade-in-up">
            <svg class="w-16 h-16 text-pastelLila mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
            <h3 class="text-2xl font-semibold mb-2">{locale.rsvpThankYouTitle({ salutation })}</h3>
            <p class="text-gray-600">{locale.rsvpThankYouMsg({ salutation, appellation })}</p>
        </div>
      {:else}
        <form on:submit|preventDefault={handleSubmit} class="space-y-6">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-1">{locale.nameLabel}</label>
            <input 
              type="text" 
              id="name" 
              bind:value={name}
              class="w-full px-4 py-3 rounded-lg border transition-all outline-none focus:ring-2 focus:ring-pastelBlue focus:border-transparent
                {errors.name ? 'border-red-400 bg-red-50' : 'border-gray-300'}"
              placeholder={locale.namePlaceholder}
            />
            {#if errors.name}<p class="mt-1 text-xs text-red-500">{errors.name}</p>{/if}
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="attendance" class="block text-sm font-medium text-gray-700 mb-1">{locale.attendanceLabel}</label>
              <select 
                id="attendance" 
                bind:value={attendance}
                class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pastelBlue focus:border-transparent outline-none transition-all"
              >
                <option value="yes">{locale.attendanceYes({ salutation })}</option>
                <option value="no">{locale.attendanceNo({ salutation })}</option>
                <option value="maybe">{locale.attendanceMaybe({ salutation })}</option>
              </select>
            </div>
            
            <div>
              <label for="guests" class="block text-sm font-medium text-gray-700 mb-1">{locale.guestsLabel}</label>
              <input 
                type="number" 
                id="guests" 
                min="1" 
                max="20"
                bind:value={guests}
                disabled={attendance === 'no'}
                class="w-full px-4 py-3 rounded-lg border transition-all outline-none focus:ring-2 focus:ring-pastelBlue focus:border-transparent
                  disabled:bg-gray-100 disabled:text-gray-400
                  {errors.guests ? 'border-red-400 bg-red-50' : 'border-gray-300'}"
              />
              {#if errors.guests}<p class="mt-1 text-xs text-red-500">{errors.guests}</p>{/if}
            </div>

            <div class="md:col-span-2">
              <label for="city" class="block text-sm font-medium text-gray-700 mb-1">{locale.cityLabel({ salutation })}</label>
              <select 
                id="city" 
                bind:value={city}
                disabled={attendance === 'no'}
                class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pastelBlue focus:border-transparent outline-none transition-all disabled:bg-gray-100 disabled:text-gray-400"
              >
                <option value="Ho Chi Minh">{locale.cityHCM}</option>
                <option value="Hanoi">{locale.cityHanoi}</option>
                <option value="Both">{locale.cityBoth}</option>
              </select>
            </div>

            {#if attendance === 'maybe'}
            <div class="md:col-span-2">
              <label for="confirmBy" class="block text-sm font-medium text-gray-700 mb-1">{locale.confirmByLabel({ salutation })}</label>
              <input
                type="date"
                id="confirmBy"
                bind:value={confirmBy}
                class="w-full px-4 py-3 rounded-lg border transition-all outline-none focus:ring-2 focus:ring-pastelBlue focus:border-transparent
                  {errors.confirmBy ? 'border-red-400 bg-red-50' : 'border-gray-300'}"
              />
              {#if errors.confirmBy}<p class="mt-1 text-xs text-red-500">{errors.confirmBy}</p>{/if}
            </div>
            {/if}
          </div>

          <button 
            type="submit"
            disabled={loading}
            class="w-full py-4 mt-4 bg-gray-800 text-white font-semibold rounded-lg hover:bg-black transition-colors focus:ring-4 focus:ring-gray-200 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? locale.submittingBtn : locale.submitBtn}
          </button>
        </form>
      {/if}
    </div>
  </div>
</section>
