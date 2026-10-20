import { Link } from "react-router-dom";
import Icon from "../Components/Ui/Icon";
import CartItemRow from "../Features/cart/CartItemRow";
import { useCart } from "../hooks/useCart";

function CartPage() {
  const { items, totalPrice, changeQuantity, removeFromCart } = useCart();

  if (items.length === 0) return <div className="content-width py-10 sm:py-14"><div className="mb-6"><p className="text-xs font-black uppercase tracking-[0.16em] text-primary">Your selection</p><h1 className="mt-2 text-3xl font-black text-ink">Shopping cart</h1></div><div className="glass-panel rounded-[1.7rem] px-5 py-12 text-center sm:py-16"><span className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/10 text-primary"><Icon name="cart" className="h-7 w-7" /></span><h2 className="mt-5 text-xl font-black text-ink">Your next build starts here</h2><p className="mt-2 text-sm text-muted">Your cart is empty right now. Browse parts or start with the PC builder.</p><div className="mt-6 flex flex-wrap justify-center gap-3"><Link to="/parts" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-white shadow-lg shadow-primary/15 transition hover:-translate-y-0.5 hover:bg-primary-strong">Explore parts <Icon name="arrow" className="h-4 w-4" /></Link><Link to="/builder" className="inline-flex min-h-11 items-center rounded-full border border-border/80 bg-white/75 px-5 text-sm font-bold text-ink transition hover:border-primary/25 hover:bg-primary/5 hover:text-primary">Open builder</Link></div></div></div>;

  return (
    <div className="content-width py-9 sm:py-12">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-[0.16em] text-primary">Your selection</p><h1 className="mt-2 text-3xl font-black tracking-tight text-ink sm:text-4xl">Shopping cart</h1><p className="mt-2 text-sm text-muted">Review your parts and quantities before checkout.</p></div><Link to="/parts" className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:gap-3"><Icon name="arrow" className="h-4 w-4 rotate-180" />Continue shopping</Link></div>
      <div className="grid items-start gap-5 lg:grid-cols-[1fr_350px]">
        <div className="flex flex-col gap-3">{items.map((item) => <CartItemRow key={item.id} item={item} onChangeQuantity={changeQuantity} onRemove={removeFromCart} />)}</div>
        <aside className="glass-panel rounded-[1.5rem] p-5 lg:sticky lg:top-24"><div className="flex items-center gap-2"><Icon name="box" className="h-5 w-5 text-primary" /><h2 className="text-lg font-black text-ink">Order summary</h2></div><div className="mt-5 flex justify-between text-sm text-muted"><span>Items</span><span>{items.reduce((sum, item) => sum + item.quantity, 0)}</span></div><div className="mt-3 flex justify-between border-t border-border/70 pt-4 text-lg font-black text-ink"><span>Total</span><span>Rs {totalPrice.toLocaleString()}</span></div><p className="mt-2 text-xs text-muted">Delivery options shown at checkout.</p><Link to="/checkout" className="mt-5 flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-white shadow-lg shadow-primary/15 transition hover:-translate-y-0.5 hover:bg-primary-strong">Continue to checkout <Icon name="arrow" className="h-4 w-4" /></Link><p className="mt-4 flex justify-center gap-1.5 text-xs font-medium text-muted"><Icon name="shield" className="h-4 w-4 text-primary" />Secure checkout</p></aside>
      </div>
    </div>
  );
}

export default CartPage;
