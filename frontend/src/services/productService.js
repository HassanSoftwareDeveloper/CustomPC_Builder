import { request } from "./api";

// backend key  ->  the name your screens use
const LABEL_BY_KEY = {
  cpu: "Processor",
  motherboard: "Motherboard",
  gpu: "Graphics card",
  ram: "Memory",
  storage: "Storage",
  psu: "Power supply",
  case: "Case",
  cooler: "Cooler",
};

const KEY_BY_LABEL = Object.fromEntries(
  Object.entries(LABEL_BY_KEY).map(([key, label]) => [label, key])
);

// Backend shape -> your frontend shape
function fromApi(p) {
  return {
    id: p._id,
    name: p.name,
    category: LABEL_BY_KEY[p.category] || p.category,
    categoryKey: p.category,
    spec: p.spec || "",
    price: p.price,
    socket: p.specs?.socket,
    image: p.image,
    stock: p.stock,
    specs: p.specs,
  };
}

// Your frontend shape -> backend shape (used by the admin screens)
function toApi(data) {
  return {
    name: data.name,
    price: Number(data.price),
    spec: data.spec,
    image: data.image,
    category: KEY_BY_LABEL[data.category] || data.category,
    specs: { ...(data.specs || {}), ...(data.socket ? { socket: data.socket } : {}) },
  };
}

export async function getProducts() {
  const list = await request("/products");
  return list.map(fromApi);
}

export async function getProductById(id) {
  try {
    return fromApi(await request(`/products/${id}`));
  } catch {
    return undefined; // same as before: not found = undefined
  }
}

export async function addProduct(data) {
  const created = await request("/products", {
    method: "POST",
    body: JSON.stringify(toApi(data)),
  });
  return fromApi(created);
}

export async function updateProduct(updated) {
  await request(`/products/${updated.id}`, {
    method: "PUT",
    body: JSON.stringify(toApi(updated)),
  });
}

export async function deleteProduct(id) {
  await request(`/products/${id}`, { method: "DELETE" });
}