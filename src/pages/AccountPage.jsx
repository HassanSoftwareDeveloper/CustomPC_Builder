import { Link } from "react-router-dom";
import Icon from "../Components/Ui/Icon";
import { useAuth } from "../hooks/useAuth";
import { getOrdersByUser } from "../services/orderService";

function AccountPage() {
  const { user } = useAuth();
  const orders = getOrdersByUser(user.id);

  return (
    <div className="content-width py-9 sm:py-12">
      <div className="glass-panel relative overflow-hidden rounded-[1.7rem] p-5 sm:p-8"><div className="absolute -right-8 -top-16 h-56 w-56 rounded-full bg-primary/10 blur-3xl" /><div className="relative flex flex-wrap items-center gap-4"><span className="flex h-16 w-16 items-center justify-center rounded-3xl bg-primary text-2xl font-black uppercase text-white shadow-lg shadow-primary/20">{user.name?.trim()?.[0] || "U"}</span><div><p className="text-xs font-black uppercase tracking-[0.15em] text-primary">Your account</p><h1 className="mt-1 text-2xl font-black tracking-tight text-ink sm:text-3xl">Welcome, {user.name}</h1><p className="mt-1 text-sm text-muted">Manage your details and keep up with your orders.</p></div></div></div>
      <div className="mt-5 grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <section className="glass-panel rounded-2xl p-5 sm:p-6"><div className="flex items-center gap-2"><Icon name="user" className="h-5 w-5 text-primary" /><h2 className="text-lg font-black text-ink">Profile details</h2></div><div className="mt-5 space-y-4"><div className="rounded-xl border border-border/70 bg-white/65 p-4"><p className="text-[10px] font-bold uppercase tracking-wider text-muted">Full name</p><p className="mt-1 font-bold text-ink">{user.name}</p></div><div className="rounded-xl border border-border/70 bg-white/65 p-4"><p className="text-[10px] font-bold uppercase tracking-wider text-muted">Email address</p><p className="mt-1 break-all font-bold text-ink">{user.email}</p></div></div></section>
        <section><div className="flex items-end justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-[0.15em] text-primary">Order history</p><h2 className="mt-1 text-xl font-black text-ink">Your orders</h2></div><span className="rounded-full bg-white/80 px-3 py-1.5 text-xs font-bold text-muted">{orders.length} total</span></div>
          {orders.length === 0 ? <div className="glass-panel mt-4 rounded-2xl p-7 text-center sm:p-10"><span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary"><Icon name="box" /></span><h3 className="mt-4 font-extrabold text-ink">Your order history will show up here</h3><p className="mt-1 text-sm text-muted">Start browsing and build your next setup.</p><Link to="/parts" className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-white shadow-lg shadow-primary/15 transition hover:-translate-y-0.5 hover:bg-primary-strong">Browse parts <Icon name="arrow" className="h-4 w-4" /></Link></div> : <div className="mt-4 flex flex-col gap-3">{orders.map((order) => <Link key={order.id} to={`/order-confirmation/${order.id}`} className="glass-panel flex flex-wrap items-center justify-between gap-3 rounded-2xl p-4 transition hover:-translate-y-0.5 hover:shadow-lg"><div><p className="font-extrabold text-ink">Order {order.id}</p><p className="mt-1 text-xs text-muted">{new Date(order.createdAt).toLocaleDateString()} · {order.items.length} items</p></div><span className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold capitalize text-primary">{order.status}</span><span className="font-black text-ink">Rs {order.total.toLocaleString()}</span></Link>)}</div>}
        </section>
      </div>
    </div>
  );
}

export default AccountPage;
