import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ORDER_STATUSES } from "../constants/orderStatus";
import { getOrders, updateOrderStatus } from "../services/orderService";

function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    getOrders()
      .then(setOrders)
      .catch((err) => setMessage(err.message));
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders(await getOrders());
    } catch (err) {
      setMessage(err.message);
    }
  };

  const visibleOrders = orders.filter(
    (order) => statusFilter === "All" || order.status === statusFilter,
  );
  return (
    <div className="px-6 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-ink">Orders</h1>
          <p className="mt-2 text-muted">
            {visibleOrders.length} orders shown.
          </p>
        </div>

        <label className="flex flex-col gap-1 text-sm text-muted">
          Show
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="h-11 rounded-lg border border-border bg-surface px-3 text-ink focus:outline-2 focus:outline-primary"
          >
            <option value="All">All orders</option>
            {ORDER_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
      </div>

      {message && <p className="mt-4 text-sm text-red-600">{message}</p>}
      {visibleOrders.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-border bg-surface p-10 text-center text-muted">
          No orders to show.
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-surface">
          <table className="w-full min-w-[44rem] text-left text-sm">
            <thead className="border-b border-border text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 text-right font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {visibleOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-border last:border-0"
                >
                  <td className="px-4 py-3">
                    <Link
                      to={`/order-confirmation/${order.id}`}
                      className="text-ink underline"
                    >
                      {order.id}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-ink">{order.customer.fullName}</p>
                    <p className="text-muted">
                      {order.customer.phone} · {order.customer.city}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right text-ink">
                    Rs {order.total.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      aria-label={`Status of ${order.id}`}
                      value={order.status}
                      onChange={(event) =>
                        handleStatusChange(order.id, event.target.value)
                      }
                      className="h-10 rounded-lg border border-border bg-surface px-2 text-ink focus:outline-2 focus:outline-primary"
                    >
                      {ORDER_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
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

export default AdminOrdersPage;
