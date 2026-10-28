# Isfak's portfolio

A responsive personal portfolio for Isfak, a second-year Computer Science undergraduate at the University of Jaffna, AWS Community Builder, and aspiring ML/AI professional. Built with plain HTML, CSS, and vanilla JavaScript. No libraries, dependencies, or build step.

## Preview and files

Open `index.html` directly, or run `python -m http.server 8000` in the repository and visit `http://localhost:8000`.

- `index.html`: content, semantic structure, inline SVG emoji favicon, metadata, and the small pre-paint theme script.
- `styles.css`: both theme palettes, responsive layout, CSS artwork, and motion. The stylesheet retains its original plural filename.
- `script.js`: theme switching, mobile navigation, active section, progress bar, scroll reveals, and desktop pointer effects.
- `favicon.svg`: the original standalone favicon, retained as an optional alternative to the inline favicon.

All file references are relative. The favicon is embedded and needs no network request.

## Edit the content

Edit the About paragraph, skill cards, and project cards directly in `index.html`. Descriptions are honest drafts based on the supplied project information. Each project's GitHub link currently leads to the profile; replace these with repository URLs when ready.

Search HTML comments for `TODO`. LinkedIn and email link templates are commented out in the footer; fill in real addresses before uncommenting. No TODO labels appear in rendered content.

The empty `#creative-feature` section and its hero hint remain reserved for a future feature. Its visible placeholder is supplied by CSS pseudo-elements. Remove those rules when adding content and update the hint if needed.

## Themes and accessibility

Edit the variables in `:root` (dark) and `:root[data-theme="light"]` (light) at the top of `styles.css`. Keep the light system-theme fallback in sync. Browser chrome reads the CSS background token after the stylesheet loads and on every theme switch; no duplicate color values live in the HTML.

The initial theme follows the operating system unless the visitor has explicitly selected a theme. Choices persist under `portfolio-theme` in localStorage; blocked storage is handled gracefully. The header button remains visible on mobile. Both palettes use contrasting text, accents, and UI borders.

Navigation collapses below 720px, closes on link selection, outside click, focus leaving the navigation, or Escape, and restores focus to the menu button for Escape. Without JavaScript the links stay visible and wrap naturally. Keyboard focus outlines and a skip link are retained.

Reduced-motion preferences disable decorative animation, tilt, glow, smooth scrolling, and reveals. Without JavaScript all content remains visible. Scroll and pointer updates are limited to one animation frame at a time. Project tilt uses 0.15 interpolation and a smooth reset; a site-wide fixed glow follows mouse coordinates through CSS variables, while an 8px dot tracks the mouse and a 36px ring follows with 0.18 interpolation. The ring grows over controls/cards and compresses on press. Every project and skill card has a pointer-tracked spotlight. Cursor layers and passive pointer listeners are removed on touch-only or reduced-motion settings, restoring the normal cursor. Text inputs retain their native text cursor. Hover boxes replace link underlines; keyboard focus remains visible. Reveals run once for 500ms at 15% visibility, with at most 60ms stagger. Orbits rotate in 14-18 seconds. Only transforms and opacity animate; theme colors update immediately. Optional missing markup does not disable unrelated enhancements.

## Responsive layout

Shared gutters use `clamp(16px, 5vw, 32px)` on the main, navigation, and footer wrappers. Sections inherit the main wrapper's gutters without double padding. Cards use one column below 720px, then auto-fit grids that form two columns at 768px and three at 1024px and 1440px. The hero stacks below 1024px and the footer below 720px.

Review widths: **320, 360, 393, 768, 1024, and 1440 CSS pixels**. When editing, check both themes, menu keyboard behavior, reduced motion, and long labels at these widths.

## AWS Amplify Hosting

This site needs no install or build command. Its entry file is `index.html` in the repository root.

For manual deployment, zip `index.html`, `styles.css`, and `script.js` with the files directly at the archive root (not inside a parent folder), then upload the archive through Amplify Hosting's manual deployment flow. Include any additional local assets you add. The current favicon is inline; `favicon.svg` is optional.

For repository-connected hosting, use the repository root as the output/artifact directory and no build command. No SPA rewrite is needed: navigation uses fragment links on the same page.

No deployment, commit, or push is performed by these edits.
