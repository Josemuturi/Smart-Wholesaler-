/**
 * Dashboard.jsx — Smart Wholesaler Protected Dashboard
 * ------------------------------------------------------
 * The main landing page after login. Renders a role-aware layout:
 *   - "distributor" role: sees a management-oriented view with analytics panels
 *   - "retailer" role: sees a purchasing-focused view with quick actions
 *
 * Backend integration checklist:
 *   [ ] GET /dashboard/stats → { totalOrders, pendingOrders, totalSpend, ... }
 *   [ ] GET /orders/recent   → Array of recent order objects
 *   [ ] GET /notifications   → Array of notification objects
 *
 * The placeholders below show exactly where those calls should go.
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { api } from '../utils/api';
import './Dashboard.css';

// ---------------------------------------------------------------------------
// Mock data — replace with real API calls once your FastAPI backend is ready
// ---------------------------------------------------------------------------
const MOCK_STATS_DISTRIBUTOR = [
  { id: 'total-orders',   label: 'Total Orders',     value: '1,284',  delta: '+12%', icon: '📦' },
  { id: 'active-retailers', label: 'Active Retailers', value: '87',     delta: '+3',   icon: '🏪' },
  { id: 'revenue',        label: 'Monthly Revenue',   value: 'KSh 2.4M', delta: '+8%', icon: '💰' },
  { id: 'low-stock',      label: 'Low Stock Alerts',  value: '6',      delta: 'Now',  icon: '⚠️' },
];

const MOCK_STATS_RETAILER = [
  { id: 'my-orders',      label: 'My Orders',         value: '34',     delta: '+2',   icon: '📋' },
  { id: 'pending',        label: 'Pending Delivery',   value: '3',      delta: 'Active', icon: '🚚' },
  { id: 'total-spend',    label: 'Total Spend (Mo.)', value: 'KSh 48K', delta: '-5%', icon: '💳' },
  { id: 'credit-limit',   label: 'Credit Available',  value: 'KSh 120K', delta: 'Limit', icon: '🏦' },
];

const MOCK_RECENT_ORDERS = [
  { id: 'ORD-001', product: 'Unga Pembe 50kg', quantity: 20, status: 'delivered', date: '2026-05-18', total: 'KSh 48,000' },
  { id: 'ORD-002', product: 'Cooking Oil 20L', quantity: 12, status: 'in-transit', date: '2026-05-19', total: 'KSh 21,600' },
  { id: 'ORD-003', product: 'Sugar 50kg bags', quantity: 30, status: 'processing', date: '2026-05-20', total: 'KSh 63,000' },
];

// Status badge color map
const STATUS_CONFIG = {
  delivered:   { label: 'Delivered',   cls: 'badge--success' },
  'in-transit': { label: 'In Transit',  cls: 'badge--warning' },
  processing:  { label: 'Processing',  cls: 'badge--info'    },
  cancelled:   { label: 'Cancelled',   cls: 'badge--danger'  },
};

// ---------------------------------------------------------------------------
// Dashboard component
// ---------------------------------------------------------------------------
const Dashboard = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // State for API data — replace mock data with real API responses below
  const [stats, setStats]   = useState([]);
  const [orders, setOrders] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ── Determine role to drive the UI ──
  const isDistributor = user?.role === 'distributor';

  // -------------------------------------------------------------------------
  // Fetch dashboard data on mount
  // -------------------------------------------------------------------------
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // TODO: Replace mock data with real API calls:
        //
        //   const statsData  = await api.get('/dashboard/stats');
        //   const ordersData = await api.get('/orders/recent?limit=5');
        //
        //   setStats(statsData);
        //   setOrders(ordersData);
        //
        // For now, simulate a network delay with mock data:
        await new Promise((res) => setTimeout(res, 600));
        setStats(isDistributor ? MOCK_STATS_DISTRIBUTOR : MOCK_STATS_RETAILER);
        setOrders(MOCK_RECENT_ORDERS);
      } catch (err) {
        console.error('Failed to load dashboard data:', err.message);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchDashboardData();
  }, [isDistributor]);

  // ── Logout handler ──
  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------
  return (
    <div className={`dashboard-layout ${sidebarOpen ? 'sidebar-open' : ''}`}>

      {/* ── Sidebar ── */}
      <aside className="sidebar">
        <div className="sidebar__brand">
          <div className="sidebar__logo" aria-hidden="true">SW</div>
          <span className="sidebar__brand-name">Smart Wholesaler</span>
        </div>

        <nav className="sidebar__nav" aria-label="Main navigation">
          <ul className="sidebar__nav-list">
            <li className="sidebar__nav-item sidebar__nav-item--active">
              <span className="sidebar__nav-icon" aria-hidden="true">🏠</span>
              Dashboard
            </li>
            <li className="sidebar__nav-item">
              <Link to="/products" className="sidebar__nav-link">
                <span className="sidebar__nav-icon" aria-hidden="true">🛒</span>
                Product Catalog
              </Link>
            </li>

            {/* Orders — available to all roles */}
            <li className="sidebar__nav-item">
              {/* TODO: create /orders route */}
              <span className="sidebar__nav-icon" aria-hidden="true">📋</span>
              My Orders
            </li>

            {/* Distributor-only links */}
            {isDistributor && (
              <>
                <li className="sidebar__nav-item sidebar__nav-item--section">Manage</li>
                <li className="sidebar__nav-item">
                  {/* TODO: create /retailers route */}
                  <span className="sidebar__nav-icon" aria-hidden="true">🏪</span>
                  Retailers
                </li>
                <li className="sidebar__nav-item">
                  {/* TODO: create /inventory route */}
                  <span className="sidebar__nav-icon" aria-hidden="true">📦</span>
                  Inventory
                </li>
                <li className="sidebar__nav-item">
                  {/* TODO: create /reports route */}
                  <span className="sidebar__nav-icon" aria-hidden="true">📊</span>
                  Reports
                </li>
              </>
            )}

            {/* Retailer-only links */}
            {!isDistributor && (
              <>
                <li className="sidebar__nav-item sidebar__nav-item--section">Account</li>
                <li className="sidebar__nav-item">
                  {/* TODO: create /credit route */}
                  <span className="sidebar__nav-icon" aria-hidden="true">🏦</span>
                  Credit & Payments
                </li>
              </>
            )}
          </ul>
        </nav>

        {/* User info + logout */}
        <div className="sidebar__footer">
          <div className="sidebar__user">
            <div className="sidebar__avatar" aria-hidden="true">
              {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="sidebar__user-info">
              <p className="sidebar__user-name">{user?.name || 'User'}</p>
              <p className="sidebar__user-role">{isDistributor ? 'Distributor' : 'Retailer'}</p>
            </div>
          </div>
          <button
            id="logout-btn"
            className="sidebar__logout-btn"
            onClick={handleLogout}
            title="Logout"
          >
            ↩
          </button>
        </div>
      </aside>

      {/* ── Mobile overlay ── */}
      <div
        className="sidebar-overlay"
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* ── Main content ── */}
      <main className="dashboard-main">

        {/* Top bar */}
        <header className="topbar">
          <button
            className="topbar__menu-btn"
            onClick={() => setSidebarOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            ☰
          </button>
          <div className="topbar__title">
            <h1>
              {isDistributor ? 'Distributor Dashboard' : 'Retailer Dashboard'}
            </h1>
            <p className="topbar__subtitle">
              Welcome back, <strong>{user?.name || user?.email}</strong>
            </p>
          </div>
          <div className="topbar__actions">
            {/* Theme toggle */}
            <button
              className="theme-toggle-btn"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            {/* TODO: wire to a real notifications endpoint */}
            <button className="topbar__icon-btn" aria-label="Notifications">
              🔔
            </button>
          </div>
        </header>

        {/* Stats grid */}
        <section className="stats-grid" aria-label="Key metrics">
          {loadingStats
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="stat-card stat-card--skeleton" />
              ))
            : stats.map((stat) => (
                <div key={stat.id} className="stat-card">
                  <div className="stat-card__icon" aria-hidden="true">
                    {stat.icon}
                  </div>
                  <div className="stat-card__body">
                    <p className="stat-card__label">{stat.label}</p>
                    <p className="stat-card__value">{stat.value}</p>
                  </div>
                  <span className="stat-card__delta">{stat.delta}</span>
                </div>
              ))}
        </section>

        {/* Recent orders table */}
        <section className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">Recent Orders</h2>
            <button className="btn btn--ghost btn--sm">View All →</button>
          </div>

          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const status = STATUS_CONFIG[order.status] || { label: order.status, cls: 'badge--info' };
                  return (
                    <tr key={order.id}>
                      <td className="data-table__mono">{order.id}</td>
                      <td>{order.product}</td>
                      <td>{order.quantity}</td>
                      <td>{order.date}</td>
                      <td className="data-table__bold">{order.total}</td>
                      <td>
                        <span className={`badge ${status.cls}`}>{status.label}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Quick action panel */}
        <section className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">Quick Actions</h2>
          </div>
          <div className="quick-actions">
            <Link to="/products" className="quick-action-card">
              <span className="quick-action-card__icon" aria-hidden="true">🛒</span>
              <span>Browse Catalog</span>
            </Link>
            <button className="quick-action-card">
              {/* TODO: wire to /orders/new route */}
              <span className="quick-action-card__icon" aria-hidden="true">📝</span>
              <span>New Order</span>
            </button>
            {isDistributor && (
              <button className="quick-action-card">
                {/* TODO: wire to /inventory/add route */}
                <span className="quick-action-card__icon" aria-hidden="true">➕</span>
                <span>Add Product</span>
              </button>
            )}
            <button className="quick-action-card">
              {/* TODO: wire to /support or /chat */}
              <span className="quick-action-card__icon" aria-hidden="true">💬</span>
              <span>Get Support</span>
            </button>
          </div>
        </section>

      </main>
    </div>
  );
};

export default Dashboard;
