import { Link, useParams } from "react-router-dom";
import { getOrderById } from "../services/orderService";

const PAYMENT_LABELS = {
  cod: "Cash on delivery",
  bank: "Bank transfer",
};

function OrderConfirmationPage() {
  const { id } = useParams();
  const order = getOrderById(id);

  if (!order) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="text-3xl font-bold text-ink">Order not found</h1>
        <Link to="/parts" className="mt-4 inline-block underline">
          Browse parts
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-4xl font-bold text-ink">
        Thank you, {order.customer.fullName}!
      </h1>
      <p className="mt-2 text-muted">
        Your order <span className="font-bold text-ink">{order.id}</span> has
        been placed.
      </p>

      <div className="mt-8 flex flex-col gap-3 rounded-xl border border-border bg-surface p-6">
        {order.items.map((item) => (
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
          <span>Rs {order.total.toLocaleString()}</span>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-border bg-surface p-6 text-sm">
        <p className="text-muted">Delivering to</p>
        <p className="text-ink">{order.customer.address}</p>
        <p className="text-ink">{order.customer.city}</p>
        <p className="mt-3 text-muted">Payment</p>
        <p className="text-ink">
          {PAYMENT_LABELS[order.customer.paymentMethod]}
        </p>
      </div>

      <Link
        to="/parts"
        className="mt-6 inline-block rounded-lg bg-primary px-5 py-3 font-medium text-white hover:bg-primary-strong"
      >
        Continue shopping
      </Link>
    </div>
  );
}

export default OrderConfirmationPage;
