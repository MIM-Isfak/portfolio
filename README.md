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

- Responsive cream/olive and dark/lime themes, navigation, and a Canvas hero orbit.
- About, Skills, Projects and Contact sections.
- Compact Learning & Credentials list with owner-supplied course credentials and a community badge, plus a LinkedIn profile link. These entries are not independently issuer-verified or claims of professional accreditation.
- Builder Lab: four illustrative project demos for Kapru, Smart Classroom, TimeAlert and DarkScan. Explore freely or follow guided Next actions; Replay this demo restores its before state. A final story connects the projects to my learning direction, with this portfolio identified as hosted on AWS Amplify.
- Optional synthesized sound and browser voice, explicit opt-in starts, a complete silent experience, keyboard controls and reduced-motion support. Browser voice availability and quality vary. Human audio listening remains a separate check.

Lab interactions do not call the underlying project APIs, run real inference/scans, or deliver push notifications. Exploration progress lasts for the page visit and is not stored. The existing theme preference is stored separately.

## Customize

- `index.html`: page copy, credentials, project links and demo illustrations.
- `styles.css`: themes, responsive layout and feedback animations.
- `script.js`: `LAB_PROJECTS`, guided exploration, audio/narration and orbit behavior.

## Production

AWS Amplify Hosting is connected to `main`. Publish only this allowlist, preserving paths:

```text
index.html
styles.css
script.js
assets/icons/
```

Exclude `.git/`, `artifacts/`, temporary files, logs and browser profiles. No install/build command is required. The active favicon is embedded in `index.html`.

Motion respects reduced-motion preferences; the orbit pauses offscreen and when the tab is hidden. Full WCAG compliance and universal browser/audio verification are not claimed.

Icon sources and licenses: [assets/icons/README.md](assets/icons/README.md).
