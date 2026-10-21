import { Link, useNavigate } from "react-router-dom";
import Icon from "../components/ui/Icon";
import CheckoutForm from "../features/checkout/CheckoutForm";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";
import { saveOrder } from "../services/orderService";

function CheckoutPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, totalPrice, clearCart } = useCart();

  const handlePlaceOrder = (formValues) => {
    const order = saveOrder({ userId: user.id, customer: formValues, items, total: totalPrice });
    clearCart();
    navigate(`/order-confirmation/${order.id}`);
  };

  if (items.length === 0) return <div className="content-width py-12"><div className="glass-panel rounded-3xl p-10 text-center"><h1 className="text-3xl font-black text-ink">Nothing to check out yet</h1><p className="mt-2 text-muted">Add parts to your cart and they’ll be ready here.</p><Link to="/parts" className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-white shadow-lg shadow-primary/15 transition hover:-translate-y-0.5 hover:bg-primary-strong">Browse parts <Icon name="arrow" className="h-4 w-4" /></Link></div></div>;

  return (
    <div className="content-width py-9 sm:py-12">
      <div className="mb-7"><div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-extrabold uppercase tracking-wider text-primary"><Icon name="shield" className="h-4 w-4" />Secure checkout</div><h1 className="mt-3 text-3xl font-black tracking-tight text-ink sm:text-4xl">Delivery details</h1><p className="mt-2 text-sm text-muted">Where should we send your parts?</p></div>
      <div className="grid items-start gap-5 lg:grid-cols-[1fr_350px]"><section className="glass-panel rounded-2xl p-5 sm:p-7"><CheckoutForm onSubmit={handlePlaceOrder} initialName={user.name} /></section><aside className="glass-panel rounded-2xl p-5 lg:sticky lg:top-24"><h2 className="text-lg font-black text-ink">Order summary</h2><div className="mt-4 flex flex-col gap-3">{items.map((item) => <div key={item.id} className="flex justify-between gap-3 text-sm"><span className="text-muted">{item.name} × {item.quantity}</span><span className="shrink-0 font-semibold text-ink">Rs {(item.price * item.quantity).toLocaleString()}</span></div>)}</div><div className="mt-4 flex justify-between border-t border-border/70 pt-4 text-lg font-black text-ink"><span>Total</span><span>Rs {totalPrice.toLocaleString()}</span></div></aside></div>
    </div>
  );
}

export default CheckoutPage;
