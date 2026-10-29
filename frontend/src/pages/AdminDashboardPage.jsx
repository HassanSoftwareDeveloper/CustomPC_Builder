import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StatCard from "../components/ui/StatCard";
import { getOrders } from "../services/orderService";
import { useProducts } from "../hooks/useProducts";

function AdminDashboardPage() {
  const [orders, setOrders] = useState([]);
  const { products, loading } = useProducts();

  useEffect(() => {
    getOrders()
      .then(setOrders)
      .catch(() => setOrders([]));
  }, []);

  let revenue = 0;
  for (const order of orders) {
    revenue = revenue + order.total;
  }

  const pendingCount = orders.filter(
    (order) => order.status === "Pending",
  ).length;
  const recentOrders = orders.slice(0, 5);

  return (
    <div className="px-6 py-12">
      <h1 className="text-4xl font-bold text-ink">Dashboard</h1>
      <p className="mt-2 text-muted">A quick look at your shop.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total orders" value={orders.length} />
        <StatCard label="Revenue" value={`Rs ${revenue.toLocaleString()}`} />
        <StatCard label="Pending orders" value={pendingCount} />

        <StatCard
          label="Products in store"
          value={loading ? "..." : products.length}
        />
      </div>

      <div className="mt-10 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-ink">Recent orders</h2>
        <Link to="/admin/orders" className="text-sm text-ink underline">
          View all
        </Link>
      </div>

      {recentOrders.length === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed border-border bg-surface p-10 text-center text-muted">
          No orders yet. They will appear here.
        </div>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-xl border border-border bg-surface">
          <table className="w-full min-w-[32rem] text-left text-sm">
            <thead className="border-b border-border text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-border last:border-0"
                >
                  <td className="px-4 py-3 text-ink">{order.id}</td>
                  <td className="px-4 py-3 text-ink">
                    {order.customer.fullName}
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full border border-border px-3 py-1 text-ink">
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-ink">
                    Rs {order.total.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminDashboardPage;
