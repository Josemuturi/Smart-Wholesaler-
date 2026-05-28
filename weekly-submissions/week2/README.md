# Week 2 — Design System, Wireframes & Login Layout

## What This Week Covers
- Building the CSS design token system (dark + light theme)
- Documenting wireframe decisions as structured notes
- Creating the Login page HTML layout (no JavaScript logic yet)

## How to Run

Open `src/pages/Login.html` directly in a browser to preview the static layout.
(Full React integration happens in Week 3.)

## Folder Structure (Week 2)

```
week2/
├── README.md
├── wireframe-notes.md          ← Design decisions & page structure notes
├── src/
│   ├── design-system.css       ← Full CSS variable token system
│   └── pages/
│       └── Login.html          ← Static login layout (no JS logic)
```

## Design Decisions Made This Week
- Dark theme as default (background: #0d0f14, accent: #6c63ff)
- Light theme override via [data-theme="light"] selector
- Google Fonts: Inter (400, 500, 600, 700, 800)
- Two user roles: Distributor (admin) and Retailer (buyer)

## GitHub Commit Message for This Week
```
feat(week2): add design system CSS, wireframe notes, static Login page layout
```
