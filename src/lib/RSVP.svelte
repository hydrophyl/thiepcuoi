<script>
  export let guestName = '';
  export let appellation = 'tôi';
  export let salutation = '';
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
      errors.name = 'Vui lòng nhập tên của bạn.';
      valid = false;
    } else if (name.trim().length > 100) {
      errors.name = 'Tên quá dài (tối đa 100 ký tự).';
      valid = false;
    }

    if (attendance !== 'no') {
      if (!Number.isInteger(guests) || guests < 1 || guests > 20) {
        errors.guests = 'Số người phải từ 1 đến 20.';
        valid = false;
      }
    }

    if (attendance === 'maybe' && !confirmBy) {
      errors.confirmBy = 'Vui lòng chọn ngày bạn sẽ xác nhận.';
      valid = false;
    }

    return valid;
  }

  async function handleSubmit() {
    if (!validate()) return;
    loading = true;
    try {
      const res = await fetch('http://localhost:8000/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), guests, city, attendance, confirmBy }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const detail = data?.detail;
        if (Array.isArray(detail)) {
          detail.forEach((d) => {
            const field = d.loc?.[d.loc.length - 1];
            if (field === 'name') errors.name = d.msg;
            else if (field === 'guests') errors.guests = d.msg;
            else if (field === 'confirmBy') errors.confirmBy = d.msg;
          });
        }
        loading = false;
        return;
      }
    } catch (e) {
      console.error('Error submitting RSVP:', e);
    }
    loading = false;
    submitted = true;
  }
</script>

<section class="py-24 bg-white relative overflow-hidden">
  <div class="absolute top-[-50px] right-[-50px] w-64 h-64 bg-pastelLila/10 rounded-full blur-3xl"></div>
  <div class="absolute bottom-[-50px] left-[-50px] w-64 h-64 bg-pastelBlue/10 rounded-full blur-3xl"></div>
  
  <div class="max-w-2xl mx-auto px-4 relative z-10">
    <div class="bg-white/70 backdrop-blur-md border border-gray-100 p-8 md:p-12 rounded-3xl shadow-xl">
      <h2 class="text-4xl md:text-5xl font-script text-center text-gray-800 mb-4">Xác Nhận Tham Dự</h2>
      <p class="text-center text-gray-500 mb-8">Sự hiện diện của {salutation || 'bạn'} là niềm vinh hạnh cho gia đình chúng {appellation}</p>
      
      {#if submitted}
        <div class="text-center py-10 animate-fade-in-up">
            <svg class="w-16 h-16 text-pastelLila mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
            <h3 class="text-2xl font-semibold mb-2">Cảm ơn bạn!</h3>
            <p class="text-gray-600">Phản hồi của bạn đã được ghi nhận.</p>
        </div>
      {:else}
        <form on:submit|preventDefault={handleSubmit} class="space-y-6">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Họ và Tên</label>
            <input 
              type="text" 
              id="name" 
              bind:value={name}
              class="w-full px-4 py-3 rounded-lg border transition-all outline-none focus:ring-2 focus:ring-pastelBlue focus:border-transparent
                {errors.name ? 'border-red-400 bg-red-50' : 'border-gray-300'}"
              placeholder="Nhập tên của bạn..."
            />
            {#if errors.name}<p class="mt-1 text-xs text-red-500">{errors.name}</p>{/if}
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="attendance" class="block text-sm font-medium text-gray-700 mb-1">Tham dự</label>
              <select 
                id="attendance" 
                bind:value={attendance}
                class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pastelBlue focus:border-transparent outline-none transition-all"
              >
                <option value="yes">Chắc chắn rồi! 🎉</option>
                <option value="no">Rất tiếc, mình không thể đến</option>
                <option value="maybe">Chưa chắc, mình sẽ xác nhận sau</option>
              </select>
            </div>
            
            <div>
              <label for="guests" class="block text-sm font-medium text-gray-700 mb-1">Số lượng người</label>
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
              <label for="city" class="block text-sm font-medium text-gray-700 mb-1">Bạn sẽ tham dự tiệc ở thành phố nào?</label>
              <select 
                id="city" 
                bind:value={city}
                disabled={attendance === 'no'}
                class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pastelBlue focus:border-transparent outline-none transition-all disabled:bg-gray-100 disabled:text-gray-400"
              >
                <option value="Ho Chi Minh">Hồ Chí Minh – 27.12.2026 (6PM–9PM)</option>
                <option value="Hanoi">Hà Nội – 05.01.2027 (5PM–8PM)</option>
                <option value="Both">Cả hai!</option>
              </select>
            </div>

            {#if attendance === 'maybe'}
            <div class="md:col-span-2">
              <label for="confirmBy" class="block text-sm font-medium text-gray-700 mb-1">Bạn sẽ xác nhận trước ngày…</label>
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
            {loading ? 'Đang gửi...' : 'Gửi Xác Nhận'}
          </button>
        </form>
      {/if}
    </div>
  </div>
</section>