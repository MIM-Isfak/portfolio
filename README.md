# Mohamed Isfak: Portfolio

Computer Science undergraduate at the University of Jaffna, Sri Lanka, building toward MLOps and ML Systems Engineering. Community & Outreach Lead for the university’s AWS Student Builder Group.

[Visit the live portfolio](https://main.d1fiqe49r0snk.amplifyapp.com/)

## Built with

Plain HTML, CSS, vanilla JavaScript and Canvas 2D. No dependencies or build step.

## Run locally

From the repository directory:

```bash
python -m http.server 8000
```

Open [localhost:8000](http://localhost:8000).

## Features

- Responsive ivory/olive and matte dark/lime themes, Credentials navigation, and a decorative Canvas 2D projected globe with subtle teal routes.
- About, Skills, Projects and Contact sections.
- Five rounded skill bars with self-assessed learning stages, plus all six full Learning & Credentials cards and their supplied verification links. These entries are not independently issuer-verified or claims of professional accreditation.
- Builder Lab: four illustrative project demos for Kapru, Smart Classroom, TimeAlert and DarkScan. Explore freely or follow guided Next actions; Replay this demo restores its before state. A final story connects the projects to my learning direction, with this portfolio identified as hosted on AWS Amplify.
- Optional synthesized sound and browser voice, explicit opt-in starts, a complete silent experience, keyboard controls and reduced-motion support. Browser voice availability and quality vary. Human audio listening remains a separate check.
- Independent Sound and Voice toggles, audio-clock sequencing after cue release and output latency, and cancellation on project switch, replay, Lab exit or hidden tabs.
- A desktop dot with a smoothly following ring and native cursor fallback for selection, editable controls and reduced motion. Automatic mouse-hover water distortion applies to headings only, using per-heading SVG filters and one shared scheduler. Dynamic headings initialize automatically; detached headings release their resources. A separate short touch ripple cancels for scrolling, dragging, long press and multi-touch.
- Three readable satellite badges share the globe scheduler. The final Lab story uses two balanced, contained particle waves, settling within three seconds without extending its sound motif.

Lab interactions do not call the underlying project APIs, run real inference/scans, or deliver push notifications. Exploration progress lasts for the page visit and is not stored. The existing theme preference is stored separately.

## Customize

- `index.html`: page copy, credentials, project links and demo illustrations.
- `styles.css`: themes, responsive layout and feedback animations.
- `script.js`: `LAB_PROJECTS`, guided exploration, audio/narration, globe, cursor and automatic heading-hover behavior.

## Skill stages

Bars represent ordinal experience stages, not measured proficiency or percentages. The shared CSS mapping is Exploring `.32`, Practising `.54`, Project experience `.76` of the track. Labels and descriptions remain visible without JavaScript; bars animate once when entering view, or display immediately with reduced motion.

Python is Practising, supported by the listed Python/data coursework. Machine Learning stays Exploring: team Product Owner work does not establish personal model-building experience. Cloud / AWS reflects this portfolio's AWS Amplify hosting; Web Development and Java reflect the listed personal application projects and Spring Boot stack. These are conservative self-assessments, not mastery claims.

## Production

AWS Amplify Hosting is connected to `main`. Publish only this allowlist, preserving paths:

```text
index.html
styles.css
script.js
assets/icons/
```

Exclude `.git/`, `artifacts/`, temporary files, logs and browser profiles. No install/build command is required. The active favicon embeds the `favicon.svg` monogram in HTML, so it works with the existing hosting output.

Motion respects reduced-motion preferences; the globe pauses offscreen and when the tab is hidden. It caps pixel ratio at two and uses four decorative packets. Full WCAG compliance and universal browser/audio verification are not claimed.

Icon sources and licenses: [assets/icons/README.md](assets/icons/README.md).
