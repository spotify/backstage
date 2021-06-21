// Ref: https://github.com/francoischalifour/medium-zoom#options
window.addEventListener(
  'load',
  () => {
    mediumZoom('[data-zoomable]', {
      margin: 20,
      background: '#000',
    });
  },
  false,
);
