/**
 * ProductCatalog.jsx — Secure-Duka Wholesale Product Catalog
 * -----------------------------------------------------------
 * Fetches and renders the list of wholesale products from your FastAPI backend.
 *
 * Backend integration checklist:
 *   [ ] GET /products              → Array of product objects (see MOCK_PRODUCTS shape)
 *   [ ] GET /products?category=X  → Filtered by category
 *   [ ] GET /products?search=Y    → Full-text search
 *   [ ] GET /categories           → Array of { id, name } for the filter bar
 *   [ ] POST /cart/items          → { product_id, quantity } to add to cart
 *
 * Product object shape expected from your API:
 *   {
 *     id: number,
 *     name: string,
 *     sku: string,
 *     category: string,
 *     unit: string,           // e.g. "50kg bag", "20L Jerry", "carton of 24"
 *     unit_price: number,     // in KSh
 *     min_order_qty: number,  // minimum wholesale order quantity
 *     stock_qty: number,      // units in stock
 *     image_url: string | null,
 *     description: string,
 *   }
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { api } from '../utils/api';
import './ProductCatalog.css';

// ---------------------------------------------------------------------------
// Mock data — delete once your FastAPI /products endpoint is live
// ---------------------------------------------------------------------------
const MOCK_CATEGORIES = ['All', 'Flour & Grains', 'Cooking Oils', 'Sugar & Sweeteners', 'Beverages', 'Dairy & Eggs'];

const MOCK_PRODUCTS = [
  { id: 1, name: 'Unga Pembe Wheat Flour', sku: 'SKU-001', category: 'Flour & Grains',      unit: '50kg bag',    unit_price: 2400,  min_order_qty: 5,  stock_qty: 340, description: 'High-quality wheat flour, ideal for baking and cooking. Consistent grind for professional kitchens.' },
  { id: 2, name: 'Kabras Sugar',           sku: 'SKU-002', category: 'Sugar & Sweeteners',  unit: '50kg bag',    unit_price: 2100,  min_order_qty: 10, stock_qty: 220, description: 'Premium refined white sugar from Kabras Sugar Factory. Perfect for bulk catering and retail.' },
  { id: 3, name: 'Bidco Cooking Oil',      sku: 'SKU-003', category: 'Cooking Oils',         unit: '20L jerry',  unit_price: 3800,  min_order_qty: 3,  stock_qty: 95,  description: 'Pure vegetable cooking oil. Long shelf life, heart-healthy, and suitable for frying, baking, and salads.' },
  { id: 4, name: 'Maize Meal (Posho)',     sku: 'SKU-004', category: 'Flour & Grains',      unit: '25kg bag',    unit_price: 1350,  min_order_qty: 10, stock_qty: 410, description: 'Finely milled white maize meal. The East African staple grain for ugali, porridge, and more.' },
  { id: 5, name: 'Brookside Fresh Milk',   sku: 'SKU-005', category: 'Dairy & Eggs',        unit: 'crate (12×1L)', unit_price: 1440, min_order_qty: 2, stock_qty: 60,  description: 'Fresh pasteurised whole milk. Rich in protein and calcium. Requires refrigerated transport.' },
  { id: 6, name: 'Ketepa Tea Bags',        sku: 'SKU-006', category: 'Beverages',           unit: 'carton (25 × 50)', unit_price: 4500, min_order_qty: 1, stock_qty: 130, description: `Kenya's favourite premium tea. Each carton contains 25 boxes of 50 tea bags.` },
  { id: 7, name: 'Trisodium Phosphate Salt', sku: 'SKU-007', category: 'Sugar & Sweeteners', unit: '50kg bag', unit_price: 1800, min_order_qty: 5, stock_qty: 0,  description: 'Refined iodized table salt. Essential mineral, fine granulation for easy dissolving.' },
  { id: 8, name: 'Sunflower Oil (Pwani)',  sku: 'SKU-008', category: 'Cooking Oils',         unit: '10L jerry',  unit_price: 2100,  min_order_qty: 5,  stock_qty: 180, description: 'Light sunflower oil, rich in Vitamin E and perfect for stir-frying and salad dressings.' },
];

// ---------------------------------------------------------------------------
// Helper — format number as KSh currency
// ---------------------------------------------------------------------------
const formatPrice = (amount) =>
  new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(amount);

// ---------------------------------------------------------------------------
// ProductCard sub-component
// ---------------------------------------------------------------------------
const ProductCard = ({ product, onAddToCart }) => {
  const [qty, setQty] = useState(product.min_order_qty);
  const isOutOfStock = product.stock_qty === 0;

  return (
    <article className={`product-card ${isOutOfStock ? 'product-card--oos' : ''}`}>
      {/* Stock badge */}
      {isOutOfStock && (
        <div className="product-card__oos-badge">Out of Stock</div>
      )}

      {/* Placeholder image */}
      <div className="product-card__img-wrap">
        {product.image_url
          ? <img src={product.image_url} alt={product.name} className="product-card__img" loading="lazy" />
          : (
            <div className="product-card__img-placeholder" aria-hidden="true">
              🛒
            </div>
          )
        }
      </div>

      {/* Info */}
      <div className="product-card__body">
        <span className="product-card__category">{product.category}</span>
        <h3 className="product-card__name">{product.name}</h3>
        <p className="product-card__sku">SKU: {product.sku}</p>
        <p className="product-card__desc">{product.description}</p>

        <div className="product-card__meta">
          <span className="product-card__unit">Per {product.unit}</span>
          <span className="product-card__moq">Min. {product.min_order_qty} units</span>
        </div>

        <p className="product-card__price">{formatPrice(product.unit_price)}</p>
        <p className="product-card__stock">
          {isOutOfStock
            ? <span className="product-card__stock--oos">Unavailable</span>
            : <span className="product-card__stock--ok">{product.stock_qty} in stock</span>
          }
        </p>
      </div>

      {/* Add to cart */}
      <div className="product-card__footer">
        <div className="qty-control">
          <button
            className="qty-control__btn"
            onClick={() => setQty((q) => Math.max(product.min_order_qty, q - 1))}
            disabled={isOutOfStock}
            aria-label="Decrease quantity"
          >−</button>
          <input
            type="number"
            className="qty-control__input"
            value={qty}
            min={product.min_order_qty}
            onChange={(e) => setQty(Math.max(product.min_order_qty, Number(e.target.value)))}
            disabled={isOutOfStock}
            aria-label="Order quantity"
          />
          <button
            className="qty-control__btn"
            onClick={() => setQty((q) => q + 1)}
            disabled={isOutOfStock}
            aria-label="Increase quantity"
          >+</button>
        </div>

        <button
          id={`add-to-cart-${product.id}`}
          className="btn btn--primary btn--sm"
          onClick={() => onAddToCart(product, qty)}
          disabled={isOutOfStock}
        >
          {isOutOfStock ? 'Unavailable' : 'Add to Cart'}
        </button>
      </div>
    </article>
  );
};

// ---------------------------------------------------------------------------
// ProductCatalog — main component
// ---------------------------------------------------------------------------
const ProductCatalog = () => {
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [products, setProducts]         = useState([]);
  const [categories, setCategories]     = useState(['All']);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm]     = useState('');
  const [sortBy, setSortBy]             = useState('name');
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');
  const [cartCount, setCartCount]       = useState(0);

  // -------------------------------------------------------------------------
  // Fetch products and categories from the backend
  // -------------------------------------------------------------------------
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      // TODO: Replace with real API call:
      //
      //   const params = new URLSearchParams();
      //   if (activeCategory !== 'All') params.set('category', activeCategory);
      //   if (searchTerm) params.set('search', searchTerm);
      //   const data = await api.get(`/products?${params}`);
      //   setProducts(data);
      //
      // Also fetch categories:
      //   const cats = await api.get('/categories');
      //   setCategories(['All', ...cats.map(c => c.name)]);
      //
      await new Promise((res) => setTimeout(res, 500)); // Simulate network
      setProducts(MOCK_PRODUCTS);
      setCategories(MOCK_CATEGORIES);
    } catch (err) {
      setError('Failed to load products. Please try again.');
      console.error('ProductCatalog fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []); // Remove [] deps and add activeCategory, searchTerm once using real API

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // -------------------------------------------------------------------------
  // Client-side filter + sort (replace with server-side once backend is ready)
  // -------------------------------------------------------------------------
  const visibleProducts = products
    .filter((p) => {
      const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
      const matchesSearch   = p.name.toLowerCase().includes(searchTerm.toLowerCase())
        || p.sku.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc')  return a.unit_price - b.unit_price;
      if (sortBy === 'price-desc') return b.unit_price - a.unit_price;
      if (sortBy === 'stock')      return b.stock_qty - a.stock_qty;
      return a.name.localeCompare(b.name); // default: name
    });

  // -------------------------------------------------------------------------
  // Add to cart handler
  // -------------------------------------------------------------------------
  const handleAddToCart = async (product, quantity) => {
    try {
      // TODO: Replace with real API call:
      //   await api.post('/cart/items', { product_id: product.id, quantity });
      console.log(`[Cart] Added ${quantity}× ${product.name} (ID: ${product.id})`);
      setCartCount((c) => c + quantity);
      // TODO: Show a toast notification here
    } catch (err) {
      console.error('Failed to add to cart:', err.message);
    }
  };

  // ── Handle logout ──
  const handleLogout = () => { logout(); navigate('/login', { replace: true }); };

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------
  return (
    <div className="catalog-page">

      {/* ── Topbar ── */}
      <header className="catalog-topbar">
        <div className="catalog-topbar__left">
          <button
            className="catalog-topbar__back btn btn--ghost btn--sm"
            onClick={() => navigate('/dashboard')}
          >
            ← Dashboard
          </button>
          <div>
            <h1 className="catalog-topbar__title">Product Catalog</h1>
            <p className="catalog-topbar__subtitle">
              Browse & order wholesale products
            </p>
          </div>
        </div>
        <div className="catalog-topbar__right">
          <button
            className="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <button className="catalog-topbar__cart" aria-label={`Cart: ${cartCount} items`}>
            🛒
            {cartCount > 0 && (
              <span className="catalog-topbar__cart-badge">{cartCount}</span>
            )}
          </button>
          <button className="btn btn--ghost btn--sm" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* ── Controls bar ── */}
      <div className="catalog-controls">
        {/* Search */}
        <div className="catalog-search-wrap">
          <span className="catalog-search__icon" aria-hidden="true">🔍</span>
          <input
            id="catalog-search"
            type="search"
            className="catalog-search"
            placeholder="Search by name or SKU…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Sort */}
        <select
          id="catalog-sort"
          className="form-input catalog-sort"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="name">Sort: Name A→Z</option>
          <option value="price-asc">Sort: Price Low→High</option>
          <option value="price-desc">Sort: Price High→Low</option>
          <option value="stock">Sort: Most Stock</option>
        </select>
      </div>

      {/* ── Category filter chips ── */}
      <div className="catalog-categories" role="group" aria-label="Filter by category">
        {categories.map((cat) => (
          <button
            key={cat}
            id={`cat-${cat.replace(/\s+/g, '-').toLowerCase()}`}
            className={`category-chip ${activeCategory === cat ? 'category-chip--active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── Result count ── */}
      {!loading && (
        <p className="catalog-result-count">
          Showing <strong>{visibleProducts.length}</strong> of {products.length} products
        </p>
      )}

      {/* ── Error ── */}
      {error && (
        <div className="catalog-error" role="alert">
          <span>⚠ {error}</span>
          <button className="btn btn--ghost btn--sm" onClick={fetchProducts}>Retry</button>
        </div>
      )}

      {/* ── Product grid ── */}
      {loading ? (
        <div className="catalog-grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="product-card product-card--skeleton" />
          ))}
        </div>
      ) : visibleProducts.length > 0 ? (
        <div className="catalog-grid">
          {visibleProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      ) : (
        <div className="catalog-empty">
          <p className="catalog-empty__icon">📦</p>
          <p className="catalog-empty__text">No products found for "{searchTerm || activeCategory}"</p>
          <button className="btn btn--ghost" onClick={() => { setSearchTerm(''); setActiveCategory('All'); }}>
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductCatalog;
