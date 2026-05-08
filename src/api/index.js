import axios from 'axios';

// Base URL  — In dev: proxy forwards to localhost:5000
//            In prod: set REACT_APP_API_URL in .env
const BASE_URL = process.env.REACT_APP_API_URL || '';

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// ── Response interceptor ───────────────────────────────────────
api.interceptors.response.use(
  res => res.data,
  err => {
    const msg = err.response?.data?.error || err.message || 'Network error';
    return Promise.reject(new Error(msg));
  }
);

// ── Dashboard ─────────────────────────────────────────────────
export const fetchMetrics      = ()       => api.get('/dashboard/metrics');
export const fetchRecentOrders = ()       => api.get('/dashboard/recent-orders');
export const fetchRevenueChart = (period) => api.get(`/dashboard/revenue-chart?period=${period}`);
export const fetchOrderStatus  = ()       => api.get('/dashboard/order-status');
export const fetchCategories   = ()       => api.get('/dashboard/categories');

// ── Orders ────────────────────────────────────────────────────
export const fetchOrders    = (params) => api.get('/orders', { params });
export const fetchOrder     = (id)     => api.get(`/orders/${id}`);
export const createOrder    = (data)   => api.post('/orders', data);
export const updateOrder    = (id, d)  => api.patch(`/orders/${id}`, d);
export const deleteOrder    = (id)     => api.delete(`/orders/${id}`);

// ── Products ──────────────────────────────────────────────────
export const fetchProducts   = (params) => api.get('/products', { params });
export const createProduct   = (data)   => api.post('/products', data);
export const updateProduct   = (id, d)  => api.patch(`/products/${id}`, d);
export const deleteProduct   = (id)     => api.delete(`/products/${id}`);

// ── Customers ─────────────────────────────────────────────────
export const fetchCustomers        = (params) => api.get('/customers', { params });
export const fetchCustomerGrowth   = ()       => api.get('/customers/growth');
export const fetchCustomerSegments = ()       => api.get('/customers/segments');
export const createCustomer        = (data)   => api.post('/customers', data);
export const deleteCustomer        = (id)     => api.delete(`/customers/${id}`);

// ── Analytics ─────────────────────────────────────────────────
export const fetchTraffic        = (period) => api.get(`/analytics/traffic?period=${period}`);
export const fetchDevices        = ()       => api.get('/analytics/devices');
export const fetchSources        = ()       => api.get('/analytics/sources');
export const fetchAnalyticsSummary = ()     => api.get('/analytics/summary');
