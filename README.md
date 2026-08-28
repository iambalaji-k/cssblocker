# CSS Blocker

A lightweight browser extension that removes unwanted sections (ads, sidebars, promos, clutter) from websites using CSS injection. Works on 12 sites out of the box — Amazon, Flipkart, Hotstar, Instagram, X/Twitter, Crunchyroll, AngelOne, ICAI, ChatGPT, Gemini, DeepSeek, and YouTube.

## How it Works

The extension uses **CSS Injection**. When you load a page, the browser automatically applies CSS rules that target ad containers and clutter elements, setting `display: none !important` to remove them from view.

## Supported Sites

| Site | CSS File | What's Blocked |
|---|---|---|
| Amazon | `sites/amazon.css` | Sponsored products, trending widgets, promo carousels, VSE ads, brand sections |
| Flipkart | `sites/flipkart.css` | Search result ads, product tiles with AD badges, tracking links |
| Hotstar | `sites/hotstar.css` | Ad media and ad details containers |
| Instagram | `sites/instagram.css` | Sidebar widgets, "Also from Meta" links |
| X / Twitter | `sites/x.css` | Right sidebar, premium sign-up, creator studio links |
| Crunchyroll | `sites/crunchyroll.css` | Feed banners, news & editorial sections, music video collections |
| AngelOne | `sites/angelone.css` | Promo columns, layout centering for login |
| ICAI | `sites/icai.css` | Banner elements |
| ChatGPT | `sites/chatgpt.css` | Sidebar clutter, upgrade promos |
| Gemini | `sites/gemini.css` | Sidebar clutter, upgrade promos |
| DeepSeek | `sites/deepseek.css` | Sidebar clutter, upgrade promos |
| YouTube | `sites/youtube.css` | Promoted/sparkles videos, merch shelf, banner promos, player ads, mealbar promos |
| Google Home | `sites/google-home.css` | Footer clutter, About/Store links, I'm Feeling Lucky button, header shortcuts |
| Google Search | `sites/google-search.css` | Top/bottom text ads, shopping carousel (PLA), commercial units, in-feed sponsored results |
| Reddit | `sites/reddit.css` | Promoted posts and ad containers |
| Gmail | `sites/gmail.css` | Ads and promotions tab clutter |
| LinkedIn | `sites/linkedin.css` | Promoted posts, feed ads, and side banners |

## Project Structure

```
css-blocker/
├── sites/                    # CSS rules — one file per site
│   ├── amazon.css
│   ├── flipkart.css
│   └── ...
├── icons/                    # Extension icons
│   ├── logo16.png
│   ├── logo48.png
│   └── logo128.png
├── sites.json                # Config: maps URL patterns to CSS files
├── manifest.template.json    # Base manifest fields (name, version, icons)
├── build.mjs                 # Build script — reads sites.json + template → manifest.json
├── package.json              # npm scripts
├── manifest.json             # Generated output (committed for clone-and-load)
└── README.md
```

## How to Add a New Site

1. Create a CSS file in `sites/` with your blocking rules
2. Add an entry in `sites.json`:
   ```json
   {
     "name": "YourSite",
     "matches": ["https://*.yoursite.com/*"],
     "css": "sites/yoursite.css"
   }
   ```
3. Run `npm run build` to regenerate `manifest.json`
4. Reload the extension in your browser

## How to Change Rules for an Existing Site

Just edit the CSS file in `sites/` and reload the extension. **No build step needed** — the CSS files are loaded directly by the browser at runtime.

## Writing CSS Rules

Each CSS file uses standard CSS selectors to target page elements and hide them. Every rule must end with a `{ display: none !important; }` block.

### Single selector
```css
.banner-ad {
    display: none !important;
}
```

### Grouped selectors (same hide rule for multiple elements)
```css
.sponsored-post,
.promoted-tweet,
div[data-type="ad"] {
    display: none !important;
}
```

### Common selector types

| Type | Example | When to use |
|---|---|---|
| Class | `.ad-container` | Elements with `class="ad-container"` |
| ID | `#sidebar-ads` | Unique elements with `id="sidebar-ads"` |
| Attribute | `div[data-testid="sidebarColumn"]` | Elements with specific `data-*` attributes (most stable for dynamic sites) |
| Nested | `div:has(> [data-testid="ad"])` | Parent elements that contain a certain child |
| Wildcard | `[class*="promo-"]` | Elements whose class contains "promo-" |

### Finding selectors (via DevTools)
1. Right-click the element → **Inspect**
2. In the Elements panel, look for unique `data-*` attributes, stable class names, or IDs
3. Use **Copy → Copy selector** as a starting point, but remove `:nth-child(n)` parts — those break when the page layout changes
4. Test by pasting into the DevTools console: `document.querySelector('your-selector')`

### Rules for reliable selectors
- Prefer `data-*` attributes over class names (sites change classes more often)
- Avoid `:nth-child()`, `:first-child`, `:last-child` — they break on layout changes
- Always end with `display: none !important;` — the `!important` is required to override the site's own CSS

## Loading the Extension in Brave / Chrome

1. Go to `brave://extensions` or `chrome://extensions`
2. Enable **Developer mode** (toggle in top-right)
3. Click **Load unpacked**
4. Select this folder
5. Done — the extension is active

## When Do I Need to Run `npm run build`?

| You changed... | Run build? | Then... |
|---|---|---|
| CSS rules in `sites/*.css` | **No** — just reload the extension | CSS files are loaded at runtime |
| `sites.json` (new site, new URLs) | **Yes** — `npm run build` | Regenerates `manifest.json` to include the new site |
| `manifest.template.json` (version, name, icons) | **Yes** — `npm run build` | Regenerates `manifest.json` with the new metadata |

## Why Manifest V3?

This extension was migrated from Manifest V2 to V3 because Brave (and Chrome) deprecated V2. V3 is the current standard and allows the extension to remain supported.
