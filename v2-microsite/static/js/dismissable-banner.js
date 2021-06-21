window.addEventListener('DOMContentLoaded', () => {
  const banners = document.querySelectorAll('[data-banner]');
  banners.forEach(banner => {
    const storageKey = `hideBanner/${banner.getAttribute('data-banner')}`;

    if (!localStorage.getItem(storageKey)) {
      banner.classList.remove('Banner--hidden');
    }

    const dismissButton = banner.querySelector('[data-banner-dismiss]');
    if (dismissButton) {
      dismissButton.addEventListener('click', () => {
        banner.classList.add('Banner--hidden');
        localStorage.setItem(storageKey, 'true');
      });
    }
  });
});
