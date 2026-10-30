# Mohamed Isfak’s portfolio

A responsive personal portfolio for Mohamed Isfak, a second-year Computer Science undergraduate at the University of Jaffna, Sri Lanka, and aspiring MLOps & ML Systems Engineer. He serves as Community & Outreach Lead for the AWS Student Builder Group at the University of Jaffna. Built with plain HTML, CSS, and vanilla JavaScript. No libraries, dependencies, or build step.

## Preview and files

Open `index.html` directly, or run `python -m http.server 8000` in the repository and visit `http://localhost:8000`.

- `index.html`: content, semantic structure, inline SVG emoji favicon, metadata, and the small pre-paint theme script.
- `styles.css`: both theme palettes, responsive layout, scoped hero styling, project artwork and motion preferences. The stylesheet retains its original plural filename.
- `script.js`: the Canvas orbit, theme switching, mobile navigation, active section, progress bar, scroll reveals, desktop pointer effects and the Learning Quest.
- `favicon.svg`: the original standalone favicon, retained as an optional alternative to the inline favicon.

All file references are relative. The favicon is embedded and needs no network request.

## Projects

Project descriptions and statuses reflect the supplied portfolio content. Each project links to its repository; no live demo is listed.

- Kapru — AI Shopping Agent: multilingual conversational shopping prototype with Gemini-powered product discovery, Kapruka MCP integration, and cart workflows. Technologies: Next.js, TypeScript, Gemini API, MCP. Status: working prototype. [Repository](https://github.com/MIM-Isfak/kapru-project)
- Smart Classroom Edge AI System: university team project for local classroom occupancy detection, simulated AC control, and live monitoring. Mohamed’s role: Product Owner, responsible for requirements, system architecture, and final demonstration. Technologies: Python, ONNX Runtime, OpenCV, Streamlit, Docker. Status: team project prototype. [Repository](https://github.com/MIM-Isfak/Smart_Classroom_Edge_AI_System)
- TimeAlert: student timetable prototype with batch invitations, student approvals, event updates, acknowledgements, and Web Push reminder integration. Technologies: Spring Boot, React, PostgreSQL, Cloudflare Workers. Status: in development. The complete application is not represented as publicly deployed, and mobile notification delivery is not claimed as fully verified. [Repository](https://github.com/MIM-Isfak/timealert_app)
- DarkScan: focused file and website security scanner with secret-pattern detection, HTTP header checks, SSRF protections, and JSON reports. Technologies: Java, Spring Boot, Thymeleaf, Docker, GitHub Actions. Status: working local prototype. It is not presented as a complete security audit or guaranteed protection. [Repository](https://github.com/MIM-Isfak/DarkScan_app)

## Edit the content

Edit the About text, skill cards, and project cards directly in `index.html`. The About section describes Mohamed’s MLOps and ML Systems Engineering direction and his Community & Outreach Lead role with the AWS Student Builder Group at the University of Jaffna.

## Isfak’s Learning Quest

The `#creative-feature` section contains a six-level learning map: Programming Foundations → Software Development → Python & Data → Machine Learning → DevOps Foundations → Cloud & Deployment — Boss Level. It follows Mohamed’s goal of becoming an MLOps or DevOps Engineer. Software Development links to TimeAlert with **View project**. Machine Learning links to the Smart Classroom Edge AI team project with **View team project**. Each link has a project-specific accessible name. Start or resume from the hero’s Play link or the Lab navigation link. Start opens the map; selecting an unlocked node shows its details. Only **Continue to next level** unlocks the next node. Finish reveals the closing message, and **Play again** clears quest progress and returns focus to Start. Exploring levels records a visitor’s journey; it does not change Mohamed’s learning status or establish mastery. AWS deployment remains an ongoing challenge.

Edit the `QUEST_LEVELS` array near the top of `script.js` to change each level’s `id`, `title`, `learningStatus`, `blurb`, `tags`, and optional `projectUrl` (`null` means no link). For linked levels, set `projectName` to identify the project for assistive technology and set `isTeamProject: true` only for an actual team project; other links use **View project**. Keep the IDs unique and stable. The introduction, controls, and completion message live in `index.html`. Quest text and controls are English-only. Quest styles are scoped to `.creative-feature` in `styles.css`.

Only `{ reached, finished }` is saved under the localStorage key `isfak-portfolio:learning-quest:v2`. The previous v1 quest progress is discarded once because the levels and their order changed; subsequent reloads resume v2 progress. Invalid data is cleared. If storage is blocked, the quest works for the current page visit. Reload opens the introduction with a Resume button when progress exists, without moving focus or announcing restored content. Theme storage is independent, and Play again clears only the current quest key.

Use Tab and Shift+Tab to move among controls, and Enter or Space to activate buttons. Locked nodes remain discoverable and explain how to unlock them. Selecting a level moves focus to its details heading; completion moves focus to the closing heading. The hero Play link focuses Start while retaining normal fragment navigation. There are no quest keyboard shortcuts or focus traps. With JavaScript disabled, the introduction and normal portfolio links remain available.

## Contact

- GitHub: [github.com/MIM-Isfak](https://github.com/MIM-Isfak)
- LinkedIn: [LinkedIn profile](https://www.linkedin.com/in/m-i-mohamed-isfak-8a239b344/)
- Email: [ishfak349@gmail.com](mailto:ishfak349@gmail.com)

## Hero artwork

The open hero artwork uses Canvas 2D to project three rotating 3D orbit planes. CODE, CLOUD and ML travel on their corresponding tracks using the same `pt()` projection and elapsed time. Badges retain depth-based size and opacity. Collision-aware label placement keeps them away from other badges; displaced labels have thin leaders to anchors at their true projected positions. Theme colors come from the existing CSS variables, and the radial glow fades to transparent before the artwork edges.

One owned animation-frame loop renders the canvas. It pauses when the artwork is offscreen or the document is hidden, preserving active elapsed time. Theme changes refresh colors without restarting the loop. ResizeObserver updates the canvas to its container, with backing-store devicePixelRatio capped at 2.

## Themes and accessibility

Edit the variables in `:root` (dark) and `:root[data-theme="light"]` (light) at the top of `styles.css`. Keep the light system-theme fallback in sync. Browser chrome reads the CSS background token after the stylesheet loads and on every theme switch; no duplicate color values live in the HTML.

The initial theme follows the operating system unless the visitor has explicitly selected a theme. Choices persist under `portfolio-theme` in localStorage; blocked storage is handled gracefully. The header button remains visible on mobile. Both palettes use contrasting text, accents, and UI borders.

Navigation collapses below 720px, closes on link selection, outside click, focus leaving the navigation, or Escape, and restores focus to the menu button for Escape. Without JavaScript the links stay visible and wrap naturally. Keyboard focus outlines and a skip link are retained.

With `prefers-reduced-motion: reduce`, the hero shows a static orbit composition. Pointer effects, tilt, smooth scrolling and scroll reveals are disabled; the static radial artwork glow remains. Live preference changes are handled, and returning to normal motion resumes orbit active time.

There is **no in-page pause control**. Under normal motion preferences, the orbit animates while visible. Reduced-motion support and offscreen pausing do not replace a visitor-operated pause control, and this portfolio does not claim full WCAG compliance.

On fine-pointer devices without reduced motion, the page retains its custom cursor, pointer-following glow and card spotlights; project cards also tilt. These pointer effects are removed on touch-only or reduced-motion settings, restoring the native cursor. Keyboard focus outlines and the skip link remain available. Without JavaScript, core content and navigation remain readable.

## Responsive layout

Shared gutters use `clamp(16px, 5vw, 32px)` on the main, navigation, and footer wrappers. Sections inherit the main wrapper's gutters without double padding. Cards use one column below 720px, then auto-fit grids that form two columns at 768px and three at 1024px and 1440px. The hero stacks below 1024px and the footer below 720px.

Review widths: **320, 360, 393, 768, 1024, and 1440 CSS pixels**. When editing, check both themes, menu keyboard behavior, reduced motion, and long labels at these widths.

## AWS Amplify Hosting (optional)

No verified live AWS URL is provided for this portfolio. The following are conditional deployment instructions, not a claim that the site is currently deployed.

This site needs no install or build command. Its entry file is `index.html` in the repository root.

Prepare the published package from this explicit allowlist, preserving relative paths:

```text
index.html
styles.css
script.js
assets/icons/
```

Include `assets/icons/` recursively. The runtime image assets are `github.svg`, `python.svg`, `java.svg`, `aws.svg` and `linkedin.svg`. Retain `LICENSE-devicon.txt`, `LICENSE-lucide.txt` and the icon `README.md` with source URLs and usage notes. The folder also contains local SVG sources for generic icons embedded inline in the page; these may remain in the allowlisted icon folder. Do not omit the icon assets or their license/source documentation.

The active favicon is an embedded SVG data URI in `index.html`; it does not request `favicon.svg`. The standalone `favicon.svg` is an optional alternative and is not required in the current deployment package.

Exclude `artifacts/`, `.git/`, temporary browser/test profiles, local test files, logs, audit reports and reference demos from the published package. Review screenshots and JSON results are local verification evidence. Root project documentation and `.gitignore` are not runtime files. Nothing needs to be deleted or untracked to prepare a clean package.

If using a manual AWS Amplify Hosting deployment, create an archive from the allowlist with `index.html` at the archive root and the `assets/icons/` hierarchy intact. If configuring repository-connected hosting, publish a separate staging/artifact directory containing only the allowlisted paths. The application requires no compilation or dependency installation; staging only copies the production files. No SPA rewrite is needed because navigation uses fragments on the same page.

The root `.gitignore` excludes review artifacts and identified local audit outputs from future Git additions. It does not remove already tracked files or control what a hosting service publishes; the deployment package must still follow the allowlist.

No deployment, commit, or push is performed by these edits.
