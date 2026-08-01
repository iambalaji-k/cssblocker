// Hide promoted/sponsored posts in the LinkedIn feed.
// Pure CSS can't match the "Promoted" text label, so a tiny observer does it.
const PROMOTED_RE = /^\s*Promoted(?:\s*[•·:|]|\s|$)/i;

function hidePromoted(root) {
  const items = root.matches && root.matches('div[role="listitem"]')
    ? [root, ...root.querySelectorAll('div[role="listitem"]')]
    : root.querySelectorAll('div[role="listitem"]');

  for (const item of items) {
    if (item.dataset.cssBlockerProcessed) continue;
    item.dataset.cssBlockerProcessed = '1';

    for (const p of item.querySelectorAll('p')) {
      const text = p.textContent.trim();
      // "Promoted" or "Promoted • Partnership with X" — short label only,
      // so body text mentioning the word can never match.
      if (text.length < 80 && PROMOTED_RE.test(text)) {
        item.style.display = 'none';
        break;
      }
    }
  }
}

hidePromoted(document);

const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    for (const node of mutation.addedNodes) {
      if (node.nodeType === Node.ELEMENT_NODE) hidePromoted(node);
    }
  }
});
observer.observe(document.body, { childList: true, subtree: true });
