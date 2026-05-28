# Week 4 — Role-Based Dashboards & Product Catalog UI

## What This Week Covers
- Building the Distributor and Retailer dashboards
- Creating the Product Catalog view with shopping cart integration
- Implementing the global Dark / Light theme toggle using Context API
- Styling pages with responsive Vanilla CSS and CSS custom properties

## Folder Structure (Week 4)

```
week4/
├── README.md
└── src/
    ├── context/
    │   └── ThemeContext.jsx      ← Theme state and provider
    └── pages/
        ├── Dashboard.jsx         ← Distributor & Retailer dashboard view
        ├── Dashboard.css
        ├── ProductCatalog.jsx    ← Browse products & add-to-cart interface
        └── ProductCatalog.css
```

## UI and Styling Highlights
- Role-based dashboard views: Distributors see order management and statistics; Retailers see catalog quick access and active cart summary.
- Theming is handled via CSS variables and applied dynamically on the `<html>` or `<body>` element.
- Fully responsive catalog grid layout with flexbox and media queries.

## GitHub Commit Message for This Week
```
Week 4: Dashboard UI, Product Catalog, dark/light theme toggle
```
