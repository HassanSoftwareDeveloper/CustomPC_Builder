import { PRODUCTS } from "../data/products";

const STORAGE_KEY = "customizePC_products";

function saveProducts(products) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

export function getProducts() {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (saved) {
    return JSON.parse(saved);
  }

  saveProducts(PRODUCTS);
  return PRODUCTS;
}

export function getProductById(id) {
  return getProducts().find((product) => product.id === Number(id));
}

export function addProduct(data) {
  const products = getProducts();

  let highestId = 0;
  for (const product of products) {
    if (product.id > highestId) {
      highestId = product.id;
    }
  }

  const newProduct = { ...data, id: highestId + 1 };
  saveProducts([...products, newProduct]);
  return newProduct;
}

export function updateProduct(updated) {
  saveProducts(
    getProducts().map((product) =>
      product.id === updated.id ? updated : product
    )
  );
}

export function deleteProduct(id) {
  saveProducts(getProducts().filter((product) => product.id !== id));
}