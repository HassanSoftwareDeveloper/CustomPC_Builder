const STORAGE_KEY = "customizePC_orders";

export function getOrders() {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : [];
}

export function getOrderById(id) {
  return getOrders().find((order) => order.id === id);
}

export function getOrdersByUser(userId) {
  return getOrders().filter((order) => order.userId === userId);
}

export function saveOrder({ userId, customer, items, total }) {
  const newOrder = {
    id: `ORD-${Date.now()}`,
    userId,
    createdAt: new Date().toISOString(),
    status: "Pending",
    customer,
    items,
    total,
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify([newOrder, ...getOrders()]));
  return newOrder;
}

export function updateOrderStatus(id, status) {
  const updated = getOrders().map((order) =>
    order.id === id ? { ...order, status } : order
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}