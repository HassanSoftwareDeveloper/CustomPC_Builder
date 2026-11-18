import { request } from "./api";

export function getSummary(days = 30) {
  return request(`/analytics/summary?days=${days}`);
}

export function getOrdersOverTime(days = 30) {
  return request(`/analytics/orders-over-time?days=${days}`);
}

export function getTopProducts(days = 30) {
  return request(`/analytics/top-products?days=${days}`);
}

export function getSalesByCategory(days = 30) {
  return request(`/analytics/sales-by-category?days=${days}`);
}

export function getLowStock(threshold = 5) {
  return request(`/analytics/low-stock?threshold=${threshold}`);
}
