const CATEGORY_IMAGES = {
  Processor: "/images/processor.jpg",
  Motherboard: "/images/motherboard.jpg",
  "Graphics card": "/images/graphics-card.jpg",
  Memory: "/images/memory.jpg",
  Storage: "/images/storage.jpg",
  "Power supply": "/images/power-supply.jpg",
};

export function getProductImage(product) {
  return product.image || CATEGORY_IMAGES[product.category] || null;
}
