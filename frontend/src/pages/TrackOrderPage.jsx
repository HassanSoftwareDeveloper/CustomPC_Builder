import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import OrderTimeline from "../features/orders/OrderTimeline";
import { getOrderById } from "../services/orderService";

function TrackOrderPage() {
  const { id } = useParams();
  const [result, setResult] = useState({ id: null, order: null });

  useEffect(() => {
    let active = true;
    getOrderById(id).then(
      (found) => active && setResult({ id, order: found || null }),
    );
    return () => {
      active = false;
    };
  }, [id]);

  const loading = result.id !== id;
  const order = result.order;

  if (loading) {
    return <p className="content-width py-12">Loading your order...</p>;
  }

  if (!order) {
    return (
      <div className="content-width py-12">
        <div className="glass-panel rounded-3xl px-5 py-12 text-center">
          <h1 className="text-2xl font-black text-ink">
            We couldn't find that order
          </h1>
          <p className="mt-2 text-sm text-muted">
            It may not exist, or it may belong to another account.
          </p>
          <Link
            to="/account"
            className="mt-5 inline-flex min-h-11 items-center rounded-full bg-primary px-5 text-sm font-bold text-white hover:bg-primary-strong"
          >
            Back to my orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="content-width py-9 sm:py-12">
      <Link
        to="/account"
        className="text-sm font-semibold text-muted hover:text-primary"
      >
        ← Back to my orders
      </Link>

      <div className="mt-4">
        <p className="text-xs font-black uppercase tracking-[0.15em] text-primary">
          Track order
        </p>
        <h1 className="mt-1 break-all text-2xl font-black text-ink sm:text-3xl">
          Order {order.id}
        </h1>
        <p className="mt-1 text-sm text-muted">
          Placed on {new Date(order.createdAt).toLocaleDateString()}
        </p>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_1fr]">
        <section className="glass-panel rounded-2xl p-5 sm:p-6">
          <h2 className="mb-5 text-lg font-black text-ink">Order progress</h2>
          <OrderTimeline status={order.status} />
        </section>

        <div className="space-y-5">
          <section className="glass-panel rounded-2xl p-5 sm:p-6">
            <h2 className="text-lg font-black text-ink">Items</h2>
            <ul className="mt-4 divide-y divide-border/80 text-sm">
              {order.items.map((item) => (
                <li key={item.id} className="flex justify-between gap-4 py-3">
                  <span className="font-semibold text-ink">
                    {item.name}{" "}
                    <span className="text-muted">× {item.quantity}</span>
                  </span>
                  <span className="font-bold text-ink">
                    Rs {(item.price * item.quantity).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-3 flex justify-between border-t border-border pt-3 font-black text-ink">
              <span>Total</span>
              <span>Rs {order.total.toLocaleString()}</span>
            </p>
          </section>

          <section className="glass-panel rounded-2xl p-5 sm:p-6 text-sm">
            <h2 className="text-lg font-black text-ink">Delivery details</h2>
            <p className="mt-3 font-bold text-ink">{order.customer.fullName}</p>
            <p className="text-muted">{order.customer.phone}</p>
            <p className="text-muted">
              {order.customer.address}, {order.customer.city}
            </p>
            <p className="mt-2 text-muted">
              Payment:{" "}
              {order.customer.paymentMethod === "bank"
                ? "Bank transfer"
                : "Cash on delivery"}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default TrackOrderPage;
