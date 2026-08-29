// Unblock right-click and developer keyboard shortcuts on IRCTC
['contextmenu', 'keydown', 'keyup'].forEach((eventType) => {
  window.addEventListener(eventType, (e) => e.stopImmediatePropagation(), true);
});
