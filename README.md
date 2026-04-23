# Amazon Unsponsored

A lightweight browser extension designed to create a cleaner, ad-free shopping experience on Amazon by automatically hiding sponsored products, trending widgets, and promotional carousels.

## How it Works

The extension uses a technique called **CSS Injection**. When you load an Amazon page, the browser automatically applies the rules defined in `injection.6cd9aa31.css`. These rules target specific HTML patterns that Amazon uses to display non-organic content and sets their display property to `none !important`, effectively removing them from your view.

## Current Filter List

The extension currently filters out:
- **Sponsored Product Listings:** Elements explicitly marked as ad holders or lacking standard product identifiers (ASINs).
- **Trending Widgets:** Promotional blocks like "Trending now" or "Featured for you."
- **Search Thematic Ads:** Thematic ad slots often found at the top or middle of search results.
- **Carousel Promotions:** Sponsored product carousels that scroll horizontally.
- **Live Flagship Elements:** Interactive or live promotional roots on the homepage.

## How to Add Your Own Selectors

If you find a new sponsored section that isn't being hidden, follow these steps to add it:

### Step 1: Identify the Element
1. Open Amazon in your browser and find the element you want to hide.
2. **Right-click** on the element and select **Inspect** (or press `F12`).
3. The browser's Developer Tools will open, highlighting the HTML code for that element.

### Step 2: Find a Stable Selector
Look for unique attributes in the highlighted code:
- **ID:** Look for `id="unique-name"`. (Used in CSS as `#unique-name`).
- **Data Attributes:** Look for `data-cel-widget="..."` or `data-component-type="..."`. These are often the most reliable for Amazon. (Used in CSS as `div[data-attribute="value"]`).
- **Classes:** Look for `class="some-class-name"`. (Used in CSS as `.some-class-name`).

*Tip: Avoid using "Copy Selector" from the right-click menu in DevTools if it includes `nth-child(n)`, as these are fragile and break when the page layout changes slightly.*

### Step 3: Update the CSS File
1. Open `injection.6cd9aa31.css` in a text editor.
2. Add a comma after the last selector in the list.
3. Paste your new selector.
4. Save the file.

### Step 4: Reload the Extension
1. Go to your browser's extensions page (`chrome://extensions` or `about:debugging`).
2. Find **Amazon Unsponsored**.
3. Click the **Reload** icon to apply your changes.

## Project Structure
- `manifest.json`: The extension's configuration file.
- `injection.6cd9aa31.css`: The stylesheet containing all the hiding logic.
- `icon*.png`: Icons for the extension at various sizes.
