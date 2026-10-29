import { useEffect, useState } from "react";
import { CartContext } from "./createCartContext";
import { STORAGE_KEYS } from "../constants/storageKeys";

const STORAGE_KEY = STORAGE_KEYS.CART;

function loadCart() {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : [];
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (!toastMessage) return undefined;

    const timeoutId = window.setTimeout(() => setToastMessage(""), 3000);
    return () => window.clearTimeout(timeoutId);
  }, [toastMessage]);

  const addToCart = (product) => {
    setToastMessage(`Added ${product.name} to your cart.`);
    setItems((current) => {
      const existing = current.find((item) => item.id === product.id);

      if (existing) {
        return current.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [...current, { ...product, quantity: 1 }];
    });
  };

  const changeQuantity = (id, amount) => {
    setItems((current) =>
      current
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + amount } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const removeFromCart = (id) => {
    setItems((current) => current.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setItems([]);
  };

  let cartCount = 0;
  let totalPrice = 0;
  for (const item of items) {
    cartCount = cartCount + item.quantity;
    totalPrice = totalPrice + item.price * item.quantity;
  }

  return (
    <CartContext.Provider
      value={{
        items,
        cartCount,
        totalPrice,
        addToCart,
        changeQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
      {toastMessage && (
        <div
          className="fixed bottom-5 right-5 z-50 flex max-w-sm items-center gap-4 rounded-xl border border-border bg-surface px-5 py-4 text-ink shadow-lg"
          role="status"
          aria-live="polite"
        >
          <span aria-hidden="true" className="text-lg text-primary">
            ✓
          </span>
          <p className="flex-1 text-sm font-medium">{toastMessage}</p>
          <button
            type="button"
            onClick={() => setToastMessage("")}
            aria-label="Dismiss notification"
            className="cursor-pointer text-muted hover:text-ink"
          >
            ×
          </button>
        </div>
      )}
    </CartContext.Provider>
  );
}
