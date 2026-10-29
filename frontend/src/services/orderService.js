import { request } from "./api";

export function getOrders() {
  return request("/orders"); // admin: all orders
}

export function getMyOrders() {
  return request("/orders/mine");
}

// kept so older code doesn't break; the server knows who you are from your token
export function getOrdersByUser() {
  return getMyOrders();
}

export async function getOrderById(id) {
  try {
    return await request(`/orders/${id}`);
  } catch {
    return undefined; // not found = undefined, same as before
  }
}

export function saveOrder({ customer, items }) {
  return request("/orders", {
    method: "POST",
    body: JSON.stringify({
      customer,
      items: items.map((item) => ({ id: item.id, quantity: item.quantity })),
    }),
  });
}

export function updateOrderStatus(id, status) {
  return request(`/orders/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}