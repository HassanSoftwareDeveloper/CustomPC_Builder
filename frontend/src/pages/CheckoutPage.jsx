import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CheckoutForm from "../features/checkout/CheckoutForm";
import { useCart } from "../hooks/useCart";
import { saveOrder } from "../services/orderService";
import { useAuth } from "../hooks/useAuth";
import Icon from "../components/ui/Icon";

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
      <div className="content-width py-12 sm:py-16">
        <div className="glass-panel rounded-3xl px-5 py-12 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary"><Icon name="cart" /></span>
          <h1 className="mt-4 text-2xl font-black text-ink">Your cart is empty</h1>
          <p className="mt-2 text-sm text-muted">Add a part before continuing to checkout.</p>
          <Link to="/parts" className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-white hover:bg-primary-strong">Browse parts <Icon name="arrow" className="h-4 w-4" /></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="content-width py-8 sm:py-12">
      <Link to="/cart" className="inline-flex items-center gap-2 text-sm font-semibold text-muted transition hover:text-primary"><Icon name="arrow" className="h-4 w-4 rotate-180" />Back to cart</Link>
      <div className="mt-4"><p className="text-xs font-black uppercase tracking-[0.16em] text-primary">Almost there</p><h1 className="mt-1 text-3xl font-black tracking-tight text-ink sm:text-4xl">Checkout</h1><p className="mt-2 text-sm text-muted">Add your delivery details and review your order.</p></div>

      <div className="mt-7 grid items-start gap-5 lg:grid-cols-[1fr_360px]">
        <section className="glass-panel rounded-3xl p-5 sm:p-7">
          <h2 className="mb-5 text-lg font-black text-ink">Delivery and payment</h2>
          <CheckoutForm onSubmit={handlePlaceOrder} initialName={user?.name || ""} submitting={placing} />
          {error && <p role="alert" className="mt-4 rounded-xl border border-danger/15 bg-danger/5 px-4 py-3 text-sm font-medium text-danger">{error}</p>}
        </section>

        <aside className="glass-panel rounded-3xl p-5 lg:sticky lg:top-24 sm:p-6">
          <div className="flex items-center gap-2"><Icon name="box" className="h-5 w-5 text-primary" /><h2 className="text-lg font-black text-ink">Order summary</h2></div>
          <div className="mt-5 flex max-h-72 flex-col gap-3 overflow-y-auto pr-1">
            {items.map((item) => <div key={item.id} className="flex justify-between gap-4 text-sm"><span className="min-w-0 text-ink"><span className="block truncate font-semibold">{item.name}</span><span className="text-xs text-muted">Qty {item.quantity}</span></span><span className="shrink-0 font-medium text-muted">Rs {(item.price * item.quantity).toLocaleString()}</span></div>)}
          </div>
          <div className="mt-5 flex justify-between border-t border-border pt-4 text-lg font-black text-ink"><span>Total</span><span>Rs {totalPrice.toLocaleString()}</span></div>
          <p className="mt-2 text-xs text-muted">Delivery options shown at checkout.</p>
        </aside>
      </div>
    </div>
  );
}

export default CheckoutPage;
