// App.jsx — BIT3208 Week 1: Hello World
// This is the first React component for the Smart Wholesaler project.
// Week 2 will add the design system and Login page layout.
// Week 3 will add routing and form logic.

import React from 'react';

const App = () => {
  return (
    <div style={styles.page}>
      {/* ── App Header ── */}
      <header style={styles.header}>
        <div style={styles.logo}>SW</div>
        <h1 style={styles.title}>Smart Wholesaler</h1>
      </header>

      {/* ── Hello World Banner ── */}
      <main style={styles.main}>
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>👋 Hello, World!</h2>
          <p style={styles.cardText}>
            Welcome to <strong>Smart Wholesaler</strong> — a B2B wholesale supply portal
            built with React 19 and Vite.
          </p>
          <p style={styles.cardText}>
            This is Week 1 of the BIT3208 project. The environment is set up and
            the React component tree is rendering correctly.
          </p>

          {/* Project Info Table */}
          <table style={styles.table}>
            <tbody>
              <tr>
                <td style={styles.tdLabel}>Course</td>
                <td style={styles.tdValue}>BIT3208 — Internet Programming</td>
              </tr>
              <tr>
                <td style={styles.tdLabel}>Project</td>
                <td style={styles.tdValue}>Smart Wholesaler (Secure-Duka)</td>
              </tr>
              <tr>
                <td style={styles.tdLabel}>Week</td>
                <td style={styles.tdValue}>1 — Environment Setup</td>
              </tr>
              <tr>
                <td style={styles.tdLabel}>Stack</td>
                <td style={styles.tdValue}>React 19 + Vite 8 + Python FastAPI</td>
              </tr>
              <tr>
                <td style={styles.tdLabel}>GitHub</td>
                <td style={styles.tdValue}>
                  <a
                    href="https://github.com/Josemuturi/Smart-Wholesaler-"
                    target="_blank"
                    rel="noreferrer"
                    style={styles.link}
                  >
                    github.com/Josemuturi/Smart-Wholesaler-
                  </a>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Status Checklist */}
          <div style={styles.checklist}>
            <p style={styles.checklistTitle}>Week 1 Checklist</p>
            {[
              'Node.js installed',
              'Python 3.12 installed',
              'Vite + React project created',
              'Hello World page rendering',
              'Database connection test file created',
              'Initial GitHub commit pushed',
            ].map((item) => (
              <div key={item} style={styles.checkItem}>
                <span style={styles.checkMark}>✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <p style={styles.footer}>
          Next: Week 2 — Design System &amp; Login Page Layout
        </p>
      </main>
    </div>
  );
};

// ── Inline styles (Week 1 uses no external CSS yet — added in Week 2) ──
const styles = {
  page: {
    minHeight: '100vh',
    background: '#0d0f14',
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    color: '#f1f3f9',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '2rem 1rem',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '2.5rem',
  },
  logo: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #6c63ff, #48c6ef)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '800',
    fontSize: '1.1rem',
    color: '#fff',
  },
  title: {
    margin: 0,
    fontSize: '1.75rem',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #6c63ff, #48c6ef)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  main: {
    width: '100%',
    maxWidth: '600px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.5rem',
  },
  card: {
    width: '100%',
    background: '#161920',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '16px',
    padding: '2rem',
    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
  },
  cardTitle: {
    fontSize: '1.5rem',
    marginBottom: '0.75rem',
    color: '#f1f3f9',
  },
  cardText: {
    color: '#9ba3bb',
    lineHeight: 1.65,
    marginBottom: '0.75rem',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '1.25rem',
    marginBottom: '1.5rem',
  },
  tdLabel: {
    padding: '0.5rem 0.75rem',
    color: '#9ba3bb',
    fontSize: '0.85rem',
    fontWeight: '600',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    width: '35%',
  },
  tdValue: {
    padding: '0.5rem 0.75rem',
    color: '#f1f3f9',
    fontSize: '0.9rem',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  link: {
    color: '#6c63ff',
    textDecoration: 'none',
  },
  checklist: {
    background: 'rgba(108,99,255,0.07)',
    border: '1px solid rgba(108,99,255,0.2)',
    borderRadius: '10px',
    padding: '1rem 1.25rem',
  },
  checklistTitle: {
    fontWeight: '700',
    color: '#6c63ff',
    marginBottom: '0.75rem',
    fontSize: '0.9rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  checkItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.625rem',
    padding: '0.3rem 0',
    color: '#c9d1d9',
    fontSize: '0.9rem',
  },
  checkMark: {
    color: '#10b981',
    fontWeight: '700',
    fontSize: '1rem',
  },
  footer: {
    color: '#5c6480',
    fontSize: '0.85rem',
    textAlign: 'center',
  },
};

export default App;
