# Sampada Chaugule — Portfolio

A premium, personal-brand portfolio site for Sampada Chaugule (Data Analytics · AI/ML · Software Development · Robotics), built with plain HTML5, CSS3 and vanilla JavaScript — no build step required.

## Run it locally

Any static server works. From the `portfolio/` folder:

```bash
# Option 1 — Python
python3 -m http.server 8000

# Option 2 — Node
npx serve .
```

Then open `http://localhost:8000` in your browser. Opening `index.html` directly by double-clicking also works.

## File structure

```
portfolio/
│
├── index.html
├── css/
│   └── style.css
├── js/
│   └── main.js
├── assets/
│   ├── images/
│   │   └── sampada.jpg      ← your uploaded photo, already in place
│   ├── resume/
│   │   └── Sampada_Chaugule_Resume.svg
│   └── icons/
└── README.md
```

## Resume and deployment

The portfolio uses `assets/resume/Sampada_Chaugule_Resume.svg`, a scalable vector
version of the supplied resume. It stays sharp when zoomed in and is used by the
thumbnail, full-screen preview, and download links. The GitHub profile links point
to `https://github.com/sampadachaugule`.

## Design notes

- **Palette** — midnight navy (`#0A1526`), warm gold (`#C6A15B`), and an off-white
  background (`#FAF8F3`), defined as CSS custom properties in `css/style.css` under
  `:root` so the whole system can be retuned from one place.
- **Type** — Fraunces (display serif, used for headlines) + Space Grotesk (body/UI)
  + JetBrains Mono (labels, tags, data-style numbers) — loaded from Google Fonts.
- **Signature motif** — a subtle drifting node-network canvas behind the hero,
  echoing the "data → AI → solution" idea from the brief without being loud about it.
- **Motion** — scroll reveals via `IntersectionObserver`, a rotating role line in the
  hero, subtle magnetic buttons, and a floating stat-card animation. Everything
  respects `prefers-reduced-motion`.
- **Project previews** — abstract UI mockups (bar charts, node graphs, grid tiles)
  built in CSS/SVG, clearly presented as visual previews rather than real screenshots.

## Content honesty

No internship, award, statistic, certification, or link beyond what you provided has
been invented. Sports achievements were intentionally excluded per your instructions.
