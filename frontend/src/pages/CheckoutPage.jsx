import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CheckoutForm from "../features/checkout/CheckoutForm";
import { useCart } from "../hooks/useCart";
import { saveOrder } from "../services/orderService";
import { useAuth } from "../hooks/useAuth";

function CheckoutPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const [error, setError] = useState("");
  const [placing, setPlacing] = useState(false);

  const handlePlaceOrder = async (formValues) => {
    if (placing) return;
    setPlacing(true);
    setError("");
    try {
      const order = await saveOrder({ customer: formValues, items });
      clearCart();
      navigate(`/order-confirmation/${order.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setPlacing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="text-4xl font-bold text-ink">Checkout</h1>
        <p className="mt-4 text-muted">Your cart is empty.</p>
        <Link to="/parts" className="mt-4 inline-block underline">
          Browse parts
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-4xl font-bold text-ink">Checkout</h1>

      <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-start">
        <div className="flex-1">
          <CheckoutForm
            onSubmit={handlePlaceOrder}
            initialName={user?.name || ""}
          />
          {error && <p className="mt-4 text-sm text-danger">{error}</p>}
          {placing && (
            <p className="mt-2 text-sm text-muted">Placing your order...</p>
          )}
        </div>

        <aside className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-6 lg:w-80">
          <h2 className="text-xl font-bold text-ink">Order summary</h2>
          {items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-ink">
                {item.name} × {item.quantity}
              </span>
              <span className="text-muted">
                Rs {(item.price * item.quantity).toLocaleString()}
              </span>
            </div>
          ))}
          <div className="flex justify-between border-t border-border pt-3 text-lg font-bold text-ink">
            <span>Total</span>
            <span>Rs {totalPrice.toLocaleString()}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default CheckoutPage;
