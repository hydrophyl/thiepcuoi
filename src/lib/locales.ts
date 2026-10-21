// src/lib/locales.ts
function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
// "bác Hùng" -> "bác", "anh chị Nam" -> "anh chị"; no pronoun match keeps full string
export function pronounOf(s: string): string {
  return (
    s.match(/^(?:(?:ông|bà|bác|cô|chú|dì|cậu|mợ|thím|anh|chị|em|cháu|các|quý|khách|bạn)(?:\s+|$))+/i)?.[0].trim() ?? s
  );
}
export type Locale = {
  // Shell
  lang: string;
  skipLink: string;
  pageTitle: string;

  // App.svelte — guest banner + footer
  guestBanner: (opts: {
    name: string;
    salutation: string;
    appellation: string;
  }) => string;
  footerTagline: (opts: { salutation: string }) => string;
  parentQuotes: (opts: { salutation: string; appellation: string }) => string[];

  // Hero.svelte
  heroAriaLabel: string;
  heroSubheading: (opts: { appellation: string }) => string;
  countdown: {
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
    ariaLabel: (d: number, h: number, m: number, s: number) => string;
  };

  // Story.svelte
  storyImageAlt: (n: number) => string;

  // Gallery.svelte
  galleryTitle: string;
  galleryAriaLabel: string;
  galleryImageAlt: (n: number) => string;

  // Locations.svelte
  locationsTitle: string;
  hcmDate: string;
  hanoiDate: string;
  mapButton: string;
  hcmMapAriaLabel: string;
  hanoiMapAriaLabel: string;

  // RSVP.svelte
  rsvpTitle: string;
  rsvpSubtitle: (opts: { salutation: string; appellation: string }) => string;
  rsvpThankYouTitle: (opts: { salutation: string }) => string;
  rsvpThankYouMsg: (opts: {
    salutation: string;
    appellation: string;
  }) => string;
  nameLabel: string;
  namePlaceholder: string;
  nameError: string;
  nameTooLong: string;
  attendanceLabel: string;
  attendanceYes: (opts: { salutation: string }) => string;
  attendanceNo: (opts: { salutation: string }) => string;
  attendanceMaybe: (opts: { salutation: string }) => string;
  guestsLabel: string;
  guestsError: string;
  cityLabel: (opts: { salutation: string }) => string;
  cityHCM: string;
  cityHanoi: string;
  cityBoth: string;
  confirmByLabel: (opts: { salutation: string }) => string;
  confirmByError: (opts: { salutation: string }) => string;
  submitBtn: string;
  submittingBtn: string;

  // AudioPlayer.svelte
  audioPlay: string;
  audioPause: string;
};

export const vi: Locale = {
  lang: 'vi',
  skipLink: 'Loading',
  pageTitle: 'Thiệp Cưới — Đức Duy & Xuân Thy',
  guestBanner: ({ name, salutation, appellation }) =>
    `Thân mời ${salutation ? ` ${salutation}` : ''} ${name} tới dự lễ cưới của ${appellation}!`,
  footerTagline: ({ salutation }) => `© 2026 - Hẹn ${salutation} nha`,

  heroAriaLabel: 'Thiệp cưới Đức Duy & Xuân Thy',
  heroSubheading: ({ appellation }) =>
    `${capitalize(appellation)} sắp kết hôn rồi!`,
  countdown: {
    days: 'Ngày',
    hours: 'Giờ',
    minutes: 'Phút',
    seconds: 'Giây',
    ariaLabel: (d, h, m, s) =>
      `Đếm ngược: ${d} ngày, ${h} giờ, ${m} phút, ${s} giây đến ngày cưới`,
  },

  storyImageAlt: (n) => `Kỷ niệm ${n}`,

  galleryTitle: 'Gallery',
  galleryAriaLabel: 'Thư viện ảnh cưới',
  galleryImageAlt: (n) => `Ảnh cưới ${n}`,

  locationsTitle: 'Sự kiện',
  hcmDate: 'Chủ Nhật, 27 tháng 12 năm 2026',
  hanoiDate: 'Thứ Ba, 05 tháng 01 năm 2027',
  mapButton: 'Xem Bản Đồ',
  hcmMapAriaLabel: 'Xem bản đồ tiệc cưới Hồ Chí Minh (mở trong tab mới)',
  hanoiMapAriaLabel: 'Xem bản đồ tiệc cưới Hà Nội (mở trong tab mới)',

  rsvpTitle: 'Xác Nhận',
  rsvpSubtitle: ({ salutation, appellation }) =>
    `Sự hiện diện của ${salutation || 'bạn'} là niềm vinh hạnh cho gia đình`,
  rsvpThankYouTitle: ({ salutation }) => `Cảm ơn ${salutation || 'bạn'}!`,
  rsvpThankYouMsg: ({ salutation, appellation }) =>
    `Cảm ơn vì đã dành thời gian quý báu của ${salutation || 'bạn'} cho ${appellation}`,
  nameLabel: 'Họ và Tên',
  namePlaceholder: 'Nhập tên ...',
  nameError: 'Vui lòng nhập tên của bạn.',
  nameTooLong: 'Tên quá dài (tối đa 100 ký tự).',
  attendanceLabel: 'Tham dự',
  attendanceYes: ({ salutation }) =>
    `Chắc chắn tới!`,
  attendanceNo: ({ salutation }) =>
    `Rất tiếc không thể đến`,
  attendanceMaybe: ({ salutation }) =>
    `Chưa chắc, sẽ xác nhận sau`,
  guestsLabel: 'Số lượng người',
  guestsError: 'Số người phải từ 1 đến 20.',
  cityLabel: ({ salutation }) =>
    `${capitalize(salutation || 'Bạn')} sẽ tham dự tiệc ở thành phố nào?`,
  cityHCM: 'Hồ Chí Minh – 27.12.2026 (11AM–3PM)',
  cityHanoi: 'Hà Nội – 05.01.2027 (5PM–8PM)',
  cityBoth: 'Cả hai!',
  confirmByLabel: ({ salutation }) =>
    `${capitalize(salutation || 'Bạn')} sẽ xác nhận trước ngày…`,
  confirmByError: ({ salutation }) =>
    `Vui lòng chọn ngày ${salutation || 'bạn'} sẽ xác nhận.`,
  submitBtn: 'Gửi',
  submittingBtn: 'Đang gửi...',

  audioPlay: 'Bật nhạc nền',
  audioPause: 'Tắt nhạc nền',
  parentQuotes: ({ salutation, appellation }) => {
    const s = salutation || 'quý khách'
    const a = appellation || 'các con'
    const pronoun = pronounOf(s)
    return [
      'Sau một hành trình 9 năm bên nhau, nay các con của chúng tôi đã quyết định đi đến hôn nhân.',
      `Trân trọng kính mời`,
      capitalize(s),
      `Tới dự bữa cơm thân mật chung vui cùng gia đình chúng tôi mừng lễ thành hôn của hai cháu:`,
      `Đức Duy và Xuân Thy`,
      `Sự hiện diện của ${pronoun} là món quà quý giá dành cho gia đình chúng tôi trong ngày trọng đại này.`,
      `Gia đình chúng tôi rất hân hạnh được đón tiếp!`,
    ]
  },
};

export const en: Locale = {
  lang: 'en',
  skipLink: 'Skip to main content',
  pageTitle: 'Wedding Invitation — Đức Duy & Xuân Thy',
  guestBanner: ({ name }) =>
    `Welcome, ${name}! You are cordially invited to our wedding.`,
  footerTagline: () => '© 2026 · See you there',
  parentQuotes: ({ salutation }) => [
    'After 9 years together, our children have decided to marry.',
    'We warmly invite',
    salutation || 'you',
    'to join us for a family meal celebrating the wedding of Đức Duy and Xuân Thy.',
    'Your presence would be a precious gift to our family on this special day.',
    'Our family would be honored to welcome you!',
  ],

  heroAriaLabel: 'Wedding invitation for Đức Duy & Xuân Thy',
  heroSubheading: () => 'We are getting married',
  countdown: {
    days: 'Days',
    hours: 'Hours',
    minutes: 'Minutes',
    seconds: 'Seconds',
    ariaLabel: (d, h, m, s) =>
      `Countdown: ${d} days, ${h} hours, ${m} minutes, ${s} seconds until the wedding`,
  },

  storyImageAlt: (n) => `Memory ${n}`,

  galleryTitle: 'Gallery',
  galleryAriaLabel: 'Wedding photo gallery',
  galleryImageAlt: (n) => `Wedding photo ${n}`,

  locationsTitle: 'Events',
  hcmDate: 'Sunday, December 27, 2026',
  hanoiDate: 'Tuesday, January 05, 2027',
  mapButton: 'View Map',
  hcmMapAriaLabel: 'View map for Ho Chi Minh City reception (opens in new tab)',
  hanoiMapAriaLabel: 'View map for Hanoi reception (opens in new tab)',

  rsvpTitle: 'Confirmation',
  rsvpSubtitle: () => 'Your presence would be our greatest honor.',
  rsvpThankYouTitle: () => 'Thank you!',
  rsvpThankYouMsg: () => 'Your response has been recorded.',
  nameLabel: 'Full Name',
  namePlaceholder: 'Enter your name...',
  nameError: 'Please enter your name.',
  nameTooLong: 'Name is too long (max 100 characters).',
  attendanceLabel: 'Attendance',
  attendanceYes: () => `Absolutely!`,
  attendanceNo: () => `Sorry, I can't make it`,
  attendanceMaybe: () => `Not sure yet, I'll confirm later`,
  guestsLabel: 'Number of guests',
  guestsError: 'Number of guests must be between 1 and 20.',
  cityLabel: () => 'Which reception will you attend?',
  cityHCM: 'Ho Chi Minh City – Dec 27, 2026 (11AM–3PM)',
  cityHanoi: 'Hanoi – Jan 05, 2027 (5PM–8PM)',
  cityBoth: 'Both!',
  confirmByLabel: () => "I'll confirm by...",
  confirmByError: () => "Please select a date by which you'll confirm.",
  submitBtn: 'Send Confirmation',
  submittingBtn: 'Sending...',

  audioPlay: 'Play background music',
  audioPause: 'Pause background music',
};
