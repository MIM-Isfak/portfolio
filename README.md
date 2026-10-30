# Mohamed Isfak — Portfolio

Hi, I’m Mohamed, a second-year Computer Science undergraduate at the University of Jaffna, Sri Lanka. I’m working toward a career in MLOps and ML Systems Engineering, and serve as Community & Outreach Lead for the AWS Student Builder Group at my university.

## Features

- Responsive layout with light and dark themes
- Animated Canvas orbit with CODE, ML and CLOUD badges
- Interactive six-level Learning Quest
- Keyboard navigation and reduced-motion support

## Built with

Plain HTML, CSS, vanilla JavaScript and Canvas 2D. There are no dependencies or build step.

## Run locally

From the repository directory, run:

```bash
python -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000).

## Project structure

```text
index.html       Page content
styles.css       Themes and responsive styling
script.js        Interactions, orbit and Learning Quest
assets/icons/    Icons and license/source documentation
```

## Featured projects

- [Kapru — AI Shopping Agent](https://github.com/MIM-Isfak/kapru-project) — Multilingual shopping prototype.
- [Smart Classroom Edge AI System](https://github.com/MIM-Isfak/Smart_Classroom_Edge_AI_System) — University team project; my role was Product Owner.
- [TimeAlert](https://github.com/MIM-Isfak/timealert_app) — Student timetable prototype in development.
- [DarkScan](https://github.com/MIM-Isfak/DarkScan_app) — Focused file and website security scanner.

## Learning Quest

The six levels follow my learning journey: Programming Foundations, Software Development, Python & Data, Machine Learning, DevOps Foundations, and Cloud & Deployment — Boss Level. Start with **Play my Learning Quest** in the hero or **Lab** in the navigation. Progress is saved in this browser when storage is available; visitor progress is separate from my learning status.

## Customize

- Edit page content and project cards in `index.html`.
- Edit themes and layout in `styles.css`.
- Edit the `QUEST_LEVELS` array in `script.js`.

## AWS Amplify deployment (optional)

AWS Amplify Hosting is a possible deployment target; deployment has not been verified. For a static deployment, publish this allowlist while preserving paths:

```text
index.html
styles.css
script.js
assets/icons/
```

Exclude `.git/`, `artifacts/`, temporary files, logs, test profiles and reference demos. No installation or build command is required. The active favicon is embedded in `index.html`.

## Accessibility and motion

The site supports keyboard navigation and reduced-motion preferences. The orbit pauses while offscreen or while the tab is hidden. There is no in-page pause control; full WCAG compliance is not claimed.

## Contact

- [GitHub](https://github.com/MIM-Isfak)
- [LinkedIn](https://www.linkedin.com/in/m-i-mohamed-isfak-8a239b344/)
- [Email](mailto:ishfak349@gmail.com)

Icon sources and licenses are documented in [assets/icons/README.md](assets/icons/README.md).
