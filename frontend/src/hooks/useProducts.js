import { useEffect, useState } from "react";
import { getProducts } from "../services/productService";

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getProducts()
      .then((list) => active && setProducts(list))
      .catch(() => active && setError("Could not load products. Is the backend running?"))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  return { products, loading, error };
}