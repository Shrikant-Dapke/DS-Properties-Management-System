/**
 * DS Properties — Frontend Constants
 */

// Route paths
export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  ADD_ENTRY: '/add-entry',
  TRANSACTIONS: '/transactions',
  TRANSACTION_DETAIL: '/transactions/:id',
  REPORTS: '/reports',
  SETTINGS: '/settings',
};

// Transaction types
export const TRANSACTION_TYPES = {
  INTAKE: 'intake',
  OUTTAKE: 'outtake',
};

// Payment modes
export const PAYMENT_MODES = [
  { value: 'cash', label: 'Cash' },
  { value: 'cheque', label: 'Cheque' },
  { value: 'upi', label: 'UPI' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
];

// User roles
export const ROLES = {
  ADMIN: 'admin',
  OPERATOR: 'operator',
  VIEWER: 'viewer',
};

// Role display labels
export const ROLE_LABELS = {
  admin: 'Admin',
  operator: 'Operator',
  viewer: 'Viewer',
};

// Transaction type colors
export const TYPE_COLORS = {
  intake: { bg: 'bg-success-50', text: 'text-success-700', badge: 'bg-success' },
  outtake: { bg: 'bg-danger-50', text: 'text-danger-700', badge: 'bg-danger' },
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
};

// Default expense category colors (from DATABASE_REVIEW.md seed data)
export const CATEGORY_COLORS = {
  'road-construction': '#EF4444',
  'gutter-drainage': '#F97316',
  'boundary-wall': '#EAB308',
  'labor-charges': '#8B5CF6',
  'materials': '#06B6D4',
  'admin-legal': '#64748B',
  'other': '#9CA3AF',
};
