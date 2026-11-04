import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Icon from "../components/ui/Icon";
import StatCard from "../components/ui/StatCard";
import { getOrders } from "../services/orderService";
import { useProducts } from "../hooks/useProducts";

const formatMoney = (value) => `Rs ${Number(value || 0).toLocaleString()}`;

function AdminDashboardPage() {
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState("");
  const { products, loading: productsLoading } = useProducts();

  useEffect(() => {
    let active = true;
    getOrders()
      .then((list) => active && setOrders(list))
      .catch((err) => active && setOrdersError(err.message || "Could not load orders."))
      .finally(() => active && setOrdersLoading(false));
    return () => { active = false; };
  }, []);

  const revenue = orders.reduce((total, order) => total + Number(order.total || 0), 0);
  const pendingCount = orders.filter((order) => order.status === "Pending").length;
  const recentOrders = orders.slice(0, 5);

  return (
    <div className="mx-auto max-w-[90rem] px-4 py-7 sm:px-8 sm:py-10">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.17em] text-primary">Your store at a glance</p>
          <h1 className="text-3xl font-black tracking-tight text-ink sm:text-4xl">Dashboard</h1>
          <p className="mt-2 text-sm text-muted sm:text-base">Welcome back. Here’s what’s happening with your store.</p>
        </div>
        <Link to="/admin/products" className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:bg-primary-strong">
          <Icon name="cpu" className="h-4 w-4" /> Manage products
        </Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total orders" value={ordersLoading ? "—" : orders.length} icon="cart" note="Orders placed in your store" />
        <StatCard label="Total revenue" value={ordersLoading ? "—" : formatMoney(revenue)} icon="chart" note="Across all orders" />
        <StatCard label="Needs attention" value={ordersLoading ? "—" : pendingCount} icon="truck" note="Orders waiting for an update" />
        <StatCard label="Products in store" value={productsLoading ? "—" : products.length} icon="cpu" note="Parts available to customers" />
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_300px]">
        <section className="min-w-0 rounded-3xl border border-border bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div><h2 className="text-xl font-black tracking-tight text-ink">Recent orders</h2><p className="mt-1 text-sm text-muted">Keep track of your latest customer activity.</p></div>
            <Link to="/admin/orders" className="group inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-bold text-primary transition hover:bg-primary/5">View all <Icon name="arrow" className="h-4 w-4 transition group-hover:translate-x-1" /></Link>
          </div>

          {ordersError && <p role="alert" className="mt-5 rounded-2xl bg-danger/5 px-4 py-3 text-sm font-medium text-danger">{ordersError}</p>}
          {ordersLoading ? (
            <div className="mt-5 space-y-3" aria-label="Loading recent orders"><div className="h-12 animate-pulse rounded-xl bg-bg" /><div className="h-12 animate-pulse rounded-xl bg-bg" /><div className="h-12 animate-pulse rounded-xl bg-bg" /></div>
          ) : recentOrders.length === 0 ? (
            <div className="mt-5 rounded-2xl border border-dashed border-border bg-bg/60 px-5 py-10 text-center">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary"><Icon name="cart" /></span>
              <h3 className="mt-3 font-bold text-ink">Your first order will show up here</h3>
              <p className="mt-1 text-sm text-muted">When customers place an order, you can review it from this dashboard.</p>
            </div>
          ) : (
            <div className="mt-5 overflow-x-auto rounded-2xl border border-border">
              <table className="w-full min-w-[36rem] text-left text-sm">
                <thead className="bg-bg/70 text-xs uppercase tracking-wide text-muted"><tr><th className="px-4 py-3 font-bold">Order</th><th className="px-4 py-3 font-bold">Customer</th><th className="px-4 py-3 font-bold">Date</th><th className="px-4 py-3 font-bold">Status</th><th className="px-4 py-3 text-right font-bold">Total</th></tr></thead>
                <tbody>{recentOrders.map((order) => <tr key={order.id} className="border-t border-border transition hover:bg-bg/50">
                  <td className="px-4 py-3.5"><Link to={`/order-confirmation/${order.id}`} className="font-bold text-primary hover:underline">#{String(order.id).slice(-8)}</Link></td>
                  <td className="px-4 py-3.5 font-semibold text-ink">{order.customer?.fullName || "Customer"}</td>
                  <td className="px-4 py-3.5 text-muted">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3.5"><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${order.status === "Pending" ? "bg-accent/20 text-[#80500d]" : order.status === "Delivered" ? "bg-emerald-50 text-emerald-700" : "bg-primary/8 text-primary"}`}>{order.status}</span></td>
                  <td className="px-4 py-3.5 text-right font-bold text-ink">{formatMoney(order.total)}</td>
                </tr>)}</tbody>
              </table>
            </div>
          )}
        </section>

        <aside className="rounded-3xl bg-[#332a25] p-5 text-white shadow-lg shadow-ink/10 sm:p-6">
          <h2 className="text-xl font-black">Quick actions</h2>
          <p className="mt-1 text-sm leading-relaxed text-white/65">Jump straight into the tasks you do most.</p>
          <div className="mt-5 flex flex-col gap-2">
            {[
              ["Add a product", "/admin/products", "cpu"],
              ["Review orders", "/admin/orders", "cart"],
              ["Browse customers", "/admin/customers", "user"],
            ].map(([label, to, icon]) => <Link key={to} to={to} className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold transition hover:border-white/20 hover:bg-white/10"><span className="flex items-center gap-3"><Icon name={icon} className="h-4 w-4 text-accent" />{label}</span><Icon name="arrow" className="h-4 w-4 text-white/45 transition group-hover:translate-x-1 group-hover:text-white" /></Link>)}
          </div>
        </aside>
      </div>
    </div>
  );
}

export default AdminDashboardPage;
