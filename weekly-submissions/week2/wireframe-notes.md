# Smart Wholesaler — BIT3208 Week 2 Wireframe Notes
## Page: Login (/login)

---

## Purpose
The Login page is the entry point to the portal. It must:
- Authenticate distributors (admin role) and retailers (buyer role)
- Redirect to /dashboard after successful login
- Redirect back to intended page if the user was blocked by ProtectedRoute

---

## Layout Structure

```
┌─────────────────────────────────────────────┐
│  [Background gradient blobs — decorative]   │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │           [SW Logo]                 │    │
│  │       Smart Wholesaler              │    │
│  │   B2B Wholesale Supply Portal       │    │
│  │                                     │    │
│  │  ┌───────────────────────────────┐  │    │
│  │  │  Sign In                      │  │    │
│  │  │  Access your wholesale account│  │    │
│  │  │                               │  │    │
│  │  │  [ERROR BANNER — conditional] │  │    │
│  │  │                               │  │    │
│  │  │  Business Email    [label]    │  │    │
│  │  │  [email input field         ] │  │    │
│  │  │                               │  │    │
│  │  │  Password          [Forgot?]  │  │    │
│  │  │  [password input   ] [👁 btn] │  │    │
│  │  │                               │  │    │
│  │  │  [      Sign In Button      ] │  │    │
│  │  └───────────────────────────────┘  │    │
│  │                                     │    │
│  │  ── or jump in with demo account ── │    │
│  │  [🏭 Distributor btn] [🏪 Retailer] │    │
│  │  🔒 Mock mode active                │    │
│  │                                     │    │
│  │  Don't have an account? Request Access│  │
│  └─────────────────────────────────────┘    │
│                                             │
│  [🌙/☀️ Theme toggle — fixed top-right]    │
└─────────────────────────────────────────────┘
```

---

## Component Decisions

| Element | Decision | Reason |
|---|---|---|
| Card layout | Centered, max-width 440px | Focused attention, mobile-friendly |
| Background | Animated gradient blobs | Premium feel, glassmorphism aesthetic |
| Password field | Has show/hide toggle (👁) | UX best practice |
| Error display | role="alert" banner | Accessibility (screen reader) |
| Logo | Initials "SW" in gradient box | No image required, scales well |
| Theme toggle | Fixed top-right corner | Always accessible |

---

## User Flows

### Flow 1: Successful Login
1. User enters email + password
2. Clicks "Sign In" → button shows spinner
3. POST /auth/login called (Week 3 / Week 5)
4. JWT token stored in localStorage
5. Redirect to /dashboard (or intended destination)

### Flow 2: Failed Login
1. User enters wrong credentials
2. API returns HTTP 401
3. Error banner appears: "Invalid email or password."
4. Form stays filled (don't clear — UX)

### Flow 3: Demo Quick Login (Mock Mode)
1. Click "Distributor" or "Retailer" button
2. Pre-fills credentials + auto-submits
3. Redirects to appropriate dashboard view

---

## Accessibility Notes
- All inputs have associated `<label>` via htmlFor
- Error uses role="alert" for screen readers
- Password toggle has descriptive aria-label
- Submit button has unique id="login-submit-btn"
- Tab order: email → password → sign in

---

## Color Tokens Used (from design-system.css)
- Page background: `--color-bg`
- Card background: `--color-surface`
- Button gradient: `--gradient-primary`
- Input focus: `--color-accent`
- Error: `--color-danger`

---

## Mobile Considerations
- Card takes full width on screens < 480px
- Padding reduces on small screens
- Blobs scale down with viewport
