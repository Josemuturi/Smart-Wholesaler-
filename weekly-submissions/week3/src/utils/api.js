/**
 * api.js — BIT3208 Week 3: API Utility Layer
 * -------------------------------------------
 * Centralised HTTP client for communicating with the FastAPI backend.
 * Automatically attaches the JWT Bearer token from localStorage to every request.
 * Handles FastAPI error response format: { detail: string | [...] }
 *
 * Introduced in Week 3 so the Login form can call POST /auth/login.
 * Used across all pages from Week 3 onwards.
 *
 * Usage:
 *   import { api } from '../utils/api';
 *   const user = await api.post('/auth/login', { email, password });
 *   const products = await api.get('/products');
 */

// ── Backend base URL ──────────────────────────────────────────────────────────
// Read from Vite environment variable. Falls back to localhost for development.
// Set VITE_API_BASE_URL in .env to point to your deployed backend.
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8004';

// ── Token helpers ─────────────────────────────────────────────────────────────
// JWT is stored in localStorage so the session survives page refresh.
const TOKEN_KEY = 'sw_token';

/** Get the stored JWT or null if not logged in. */
export const getToken    = () => localStorage.getItem(TOKEN_KEY);

/** Persist the JWT after a successful login. */
export const setToken    = (token) => localStorage.setItem(TOKEN_KEY, token);

/** Remove the JWT on logout or session expiry. */
export const removeToken = () => localStorage.removeItem(TOKEN_KEY);

/** Returns true if a token exists (user is "logged in"). */
export const isAuthenticated = () => Boolean(getToken());

// ── Header builder ────────────────────────────────────────────────────────────
/**
 * Build the request headers.
 * Always sends Content-Type: application/json.
 * Adds Authorization: Bearer <token> when a JWT is present.
 */
const buildHeaders = (extra = {}) => {
  const headers = { 'Content-Type': 'application/json', ...extra };
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// ── Core request function ─────────────────────────────────────────────────────
/**
 * Wrapper around the native Fetch API.
 * Throws a structured Error on non-2xx responses so callers can
 * display meaningful messages (not just "Failed to fetch").
 *
 * @param {string} method  - HTTP method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
 * @param {string} endpoint - Path after the base URL, e.g. '/auth/login'
 * @param {object|null} body - Request body for POST/PUT/PATCH
 * @param {object} extraHeaders - Any additional headers
 * @returns {Promise<any>} - Parsed JSON response
 */
const request = async (method, endpoint, body = null, extraHeaders = {}) => {
  const url = `${BASE_URL}${endpoint}`;

  const config = {
    method,
    headers: buildHeaders(extraHeaders),
  };

  // Attach JSON body for mutating requests
  if (body !== null) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(url, config);

  // Parse JSON regardless of success/failure to surface FastAPI detail messages
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    // FastAPI sends errors as: { detail: "string" } or { detail: [...] }
    const message =
      typeof data?.detail === 'string'
        ? data.detail
        : Array.isArray(data?.detail)
        ? data.detail.map((e) => e.msg).join(', ')
        : `Request failed with status ${response.status}`;

    const error = new Error(message);
    error.status = response.status;
    error.data   = data;
    throw error;
  }

  return data;
};

// ── Public API surface ────────────────────────────────────────────────────────
export const api = {
  /** GET /endpoint — e.g. api.get('/products?category=Beverages') */
  get: (endpoint, extraHeaders) =>
    request('GET', endpoint, null, extraHeaders),

  /** POST /endpoint { body } — e.g. api.post('/auth/login', { email, password }) */
  post: (endpoint, body, extraHeaders) =>
    request('POST', endpoint, body, extraHeaders),

  /** PUT /endpoint { body } — e.g. api.put('/products/1', { price: 2500 }) */
  put: (endpoint, body, extraHeaders) =>
    request('PUT', endpoint, body, extraHeaders),

  /** PATCH /endpoint { body } — e.g. api.patch('/orders/3/status', { status: 'shipped' }) */
  patch: (endpoint, body, extraHeaders) =>
    request('PATCH', endpoint, body, extraHeaders),

  /** DELETE /endpoint — e.g. api.del('/cart/items/5') */
  del: (endpoint, extraHeaders) =>
    request('DELETE', endpoint, null, extraHeaders),
};
