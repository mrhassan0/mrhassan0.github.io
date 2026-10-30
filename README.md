# Md. Rakibul Hassan — academic portfolio

A responsive, buildless portfolio for GitHub Pages. All biographical details, research claims, publication statuses, project descriptions, and external profile links come from `Md_Rakibul_Hassan_Bangladesh.pdf`. The original document is available at `assets/Md_Rakibul_Hassan_CV.pdf`.

## Preview

From this directory:

```sh
python3 -m http.server 8000
```

Open `http://localhost:8000`. No package installation, build step, API keys, or external asset services are required.

## Structure

- `index.html`: complete, readable content with semantic sections and publication links.
- `css/styles.css`: responsive layouts, locally hosted fonts, reduced-motion support, and print styles.
- `js/script.js`: mobile navigation, project filters, citation dialog and copy controls.
- `assets/`: downloadable source CV, favicon, and WOFF2 fonts with license notices. Fonts are subset for Latin content and the Bengali illustration.
- `research.html`, `projects.html`, `education.html`, `skills.html`: redirects preserving the previous site's URLs.

Update content in `index.html`, matching BibTeX in `js/script.js`, and the downloadable PDF together. Publication links and statuses are reproduced from the supplied CV; proceedings are marked forthcoming. Research proposals are explicitly labeled as proposals. The hero network is a conceptual illustration, not experimental data.

## Deployment

The site is ready for GitHub Pages from the repository root. Push the reviewed changes to the branch configured in the repository’s Pages settings to publish them. Local changes alone do not update the hosted site.

## Accessibility and resilience

Includes keyboard navigation, a skip link, labeled controls, native disclosure and dialog elements, visible focus indicators, reduced-motion support, and print styling. All substantive content and download links are available without JavaScript; filters and clipboard features progressively enhance the page.
