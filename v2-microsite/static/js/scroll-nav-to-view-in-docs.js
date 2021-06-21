// On backstage.io/docs pages, scroll the Nav sidebar to focus on
// the page being viewed. Helpful when the Nav is large enough that
// the selected page is hidden somewhere at bottom.
// Credits: https://github.com/facebook/docusaurus/issues/823#issuecomment-421152269
document.addEventListener('DOMContentLoaded', () => {
  // Find the active nav item in the sidebar
  const item = document.getElementsByClassName('navListItemActive')[0];
  if (!item) {
    return;
  }
  const bounding = item.getBoundingClientRect();
  if (
    bounding.top >= 0 &&
    bounding.bottom <=
      (window.innerHeight || document.documentElement.clientHeight)
  ) {
    // Already visible.  Do nothing.
  } else {
    // Not visible.  Scroll sidebar.
    item.scrollIntoView({ block: 'start', inline: 'nearest' });
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }
});
