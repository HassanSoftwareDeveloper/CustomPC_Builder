import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Icon from "../components/ui/Icon";
import { ORDER_STATUSES } from "../constants/orderStatus";
import { getOrders, updateOrderStatus } from "../services/orderService";

const formatMoney = (value) => `Rs ${Number(value || 0).toLocaleString()}`;

function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    let active = true;
    getOrders()
      .then((list) => active && setOrders(list))
      .catch(
        (err) => active && setMessage(err.message || "Could not load orders."),
      )
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    const previousOrders = orders;
    setMessage("");
    setUpdatingId(orderId);
    setOrders((current) =>
      current.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order,
      ),
    );
    try {
      await updateOrderStatus(orderId, newStatus);
    } catch (err) {
      setOrders(previousOrders);
      setMessage(err.message || "Could not update this order.");
    } finally {
      setUpdatingId(null);
    }
  };

  const visibleOrders = useMemo(
    () =>
      orders.filter((order) => {
        const statusMatch =
          statusFilter === "All" || order.status === statusFilter;
        const query = search.trim().toLowerCase();
        const textMatch =
          !query ||
          `${order.id} ${order.customer?.fullName || ""} ${order.customer?.phone || ""} ${order.customer?.city || ""}`
            .toLowerCase()
            .includes(query);
        return statusMatch && textMatch;
      }),
    [orders, search, statusFilter],
  );

  return (
    <div className="mx-auto max-w-[90rem] px-4 py-7 sm:px-8 sm:py-10">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.17em] text-primary">
            Sales activity
          </p>
          <h1 className="text-3xl font-black tracking-tight text-ink sm:text-4xl">
            Orders
          </h1>
          <p className="mt-2 text-sm text-muted">
            Review purchases and keep customers up to date.
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-white px-4 py-3">
          <p className="text-xs font-semibold text-muted">Showing</p>
          <p className="mt-0.5 text-lg font-black text-ink">
            {loading ? "—" : visibleOrders.length}
            <span className="ml-1 text-sm font-medium text-muted">
              / {orders.length} orders
            </span>
          </p>
        </div>
      </div>

      {message && (
        <p
          role="alert"
          className="mt-5 rounded-2xl border border-danger/15 bg-danger/5 px-4 py-3 text-sm font-medium text-danger"
        >
          {message}
        </p>
      )}

      <section className="mt-7 overflow-hidden rounded-3xl border border-border bg-white shadow-sm shadow-ink/[0.02]">
        <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div>
            <h2 className="font-black text-ink">Order list</h2>
            <p className="mt-0.5 text-xs text-muted">
              Search by order number, customer, phone, or city.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <label className="relative block sm:w-64">
              <span className="sr-only">Search orders</span>
              <Icon
                name="search"
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Find an order"
                className="h-10 w-full rounded-full border border-border bg-bg/60 pl-9 pr-4 text-sm outline-none transition placeholder:text-muted/70 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
              />
            </label>
            <label className="relative">
              <span className="sr-only">Filter by order status</span>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="h-10 w-full cursor-pointer appearance-none rounded-full border border-border bg-white pl-4 pr-9 text-sm font-semibold text-ink outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10 sm:w-44"
              >
                <option value="All">All statuses</option>
                {ORDER_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <Icon
                name="chevron"
                className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
              />
            </label>
          </div>
        </div>

        {loading ? (
          <div className="space-y-3 p-5" aria-label="Loading orders">
            <div className="h-12 animate-pulse rounded-xl bg-bg" />
            <div className="h-12 animate-pulse rounded-xl bg-bg" />
            <div className="h-12 animate-pulse rounded-xl bg-bg" />
          </div>
        ) : visibleOrders.length === 0 ? (
          <div className="px-5 py-14 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Icon name="cart" />
            </span>
            <h3 className="mt-3 font-bold text-ink">
              {orders.length
                ? "No orders match these filters"
                : "No orders yet"}
            </h3>
            <p className="mt-1 text-sm text-muted">
              {orders.length
                ? "Adjust your search or choose a different status."
                : "Customer purchases will appear here."}
            </p>
            {(search || statusFilter !== "All") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("All");
                }}
                className="mt-4 text-sm font-bold text-primary hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[54rem] text-left text-sm">
              <thead className="bg-bg/70 text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-5 py-3.5 font-bold">Order</th>
                  <th className="px-4 py-3.5 font-bold">Customer</th>
                  <th className="px-4 py-3.5 font-bold">Date</th>
                  <th className="px-4 py-3.5 text-right font-bold">Total</th>
                  <th className="px-5 py-3.5 font-bold">Update status</th>
                </tr>
              </thead>
              <tbody>
                {visibleOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-t border-border transition hover:bg-bg/50"
                  >
                    <td className="px-5 py-4">
                      <Link
                        to={`/order-confirmation/${order.id}`}
                        className="font-bold text-primary hover:underline"
                      >
                        #{String(order.id).slice(-8)}
                      </Link>
                      <span className="mt-0.5 block text-xs text-muted">
                        View order details
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-bold text-ink">
                        {order.customer?.fullName || "Customer"}
                      </p>
                      <p className="mt-0.5 text-xs text-muted">
                        {[order.customer?.phone, order.customer?.city]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-muted">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 text-right font-bold text-ink">
                      {formatMoney(order.total)}
                    </td>
                    <td className="px-5 py-4">
                      <label className="relative inline-flex items-center">
                        <span className="sr-only">
                          Status of order {order.id}
                        </span>
                        <select
                          disabled={updatingId !== null}
                          value={order.status}
                          onChange={(event) =>
                            handleStatusChange(order.id, event.target.value)
                          }
                          className="h-10 min-w-36 cursor-pointer appearance-none rounded-full border border-border bg-white pl-3 pr-9 text-xs font-bold text-ink outline-none transition hover:border-primary/40 focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:opacity-60"
                        >
                          {ORDER_STATUSES.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                        <Icon
                          name="chevron"
                          className="pointer-events-none absolute right-3 h-4 w-4 text-muted"
                        />
                        {updatingId === order.id && (
                          <span className="ml-2 text-xs text-muted">
                            Saving…
                          </span>
                        )}
                      </label>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default AdminOrdersPage;
