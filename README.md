# CSS Blocker

A lightweight browser extension that removes unwanted sections (ads, sidebars, promos, clutter) from websites using CSS injection. Works on 19 sites out of the box — Amazon, Flipkart, Hotstar, Instagram, X/Twitter, Crunchyroll, AngelOne, ICAI, ChatGPT, Gemini, DeepSeek, YouTube, Google Home, Google Search, Reddit, Gmail, LinkedIn, IRCTC, and Income Tax e-Filing.

## How it Works

The extension uses **CSS Injection**. When you load a page, the browser automatically applies CSS rules that target ad containers and clutter elements, setting `display: none !important` to remove them from view.

## Supported Sites

| Site | CSS File | What's Blocked |
|---|---|---|
| Amazon | `sites/amazon.css` | Sponsored products, trending widgets, promo carousels, VSE ads, brand sections |
| Flipkart | `sites/flipkart.css` | Search result ads (`ADVIEW_`), "Great finds for you" sponsored carousels, Atlas & Sherlock PLA (Product Listing Ads), PMU ad banners, Base64 tracking signatures, and legacy AD badges |
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
| IRCTC | `sites/irctc.css` | Advisory ticker bar, QR promos, complete footer (`app-footer`), TrueReach/TechLab/Google ad banners, Ask DISHA AI bot overlay (also unlocks right-click & DevTools shortcuts via `sites/irctc.js`) |
| Income Tax | `sites/incometax.css` | Login promo sidebar & illustrations (with centered login card), TaxGenie AI assistant, large screen banner |

---

### Flipkart Ad Blocking Strategy (`sites/flipkart.css`)

Flipkart uses modern React / React Native for Web with heavily minified, dynamically generated class names that change frequently. To prevent breakage, `sites/flipkart.css` targets Flipkart ads using **multi-layered, stable identifiers**:

1. **Search Results Ads (`data-tkid^="ADVIEW_"`)**:
   Flipkart search results inject a tracking attribute `data-tkid="ADVIEW_..."` into sponsored product containers. Using `div[data-id]:has([data-tkid^="ADVIEW_"])` cleanly collapses the entire ad result item.

2. **Base64 Tracking Signatures (PLA & PMU Ads)**:
   Flipkart encodes ad metadata in the `fm` URL query parameter as Base64 JSON (e.g., `{"wtp":"atlas_pmu_v5","prpt":"hp","mid":"pla/u2ssherlock"}` or `{"wtp":"pmu_v2","mid":"pla"}`). We match the invariant Base64 substring tokens:
   - `LCJtaWQiOiJwbGE` & `Im1pZCI6InBsY` $\rightarrow$ Decodes to `mid: "pla"` (All Product Listing Ads).
   - `eyJ3dHAiOiJwbX` $\rightarrow$ Decodes to `wtp: "pmu"` (Product Matching Unit ad banners).
   - `eyJ3dHAiOiJhdGxhc1` $\rightarrow$ Decodes to `wtp: "atlas"` (Atlas recommendation ads).
   - `dTJzc2hlcmxvY2s` $\rightarrow$ Decodes to `u2ssherlock` (Sherlock bidding engine).

3. **Container-Level Collapse via `:has(...)`**:
   Rather than merely hiding individual ad images (which leaves blank white/grey boxes), rules like `div.fWi7J_:has(a[href*="LCJtaWQiOiJwbGE"])` and `div.yiQOTv:has(...)` collapse the entire sponsored carousel and its headers (such as *"Great finds for you"* & *"Sponsored"*).

4. **Direct Link & Grid Fallbacks**:
   If parent wrappers change classes, fallback selectors (`.grid-formation:has(...)` and `a[href*="..."]`) catch and eliminate the ad items directly.

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
