import Icon from "../../components/ui/Icon";

const STEPS = [
  { status: "Pending", text: "We received your order." },
  { status: "Assembling", text: "Your parts are being assembled." },
  { status: "Testing", text: "Your build is being tested." },
  { status: "Shipped", text: "Your order is on its way." },
  { status: "Delivered", text: "Your order has arrived." },
];

function OrderTimeline({ status }) {
  if (status === "Cancelled") {
    return (
      <p
        role="status"
        className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
      >
        This order was cancelled.
      </p>
    );
  }

  const current = STEPS.findIndex((step) => step.status === status);

  return (
    <ol>
      {STEPS.map((step, index) => {
        const done = index < current || status === "Delivered";
        const active = index === current && status !== "Delivered";
        const isLast = index === STEPS.length - 1;

        return (
          <li key={step.status} className="flex gap-4">
            <div className="flex flex-col items-center">
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-black ${
                  done
                    ? "bg-primary text-white"
                    : active
                      ? "border-2 border-primary bg-white text-primary"
                      : "border border-border bg-white text-muted"
                }`}
              >
                {done ? <Icon name="check" className="h-4 w-4" /> : index + 1}
              </span>
              {!isLast && (
                <span
                  className={`mt-1 w-0.5 flex-1 ${done ? "bg-primary" : "bg-border"}`}
                />
              )}
            </div>
            <div className="pb-6">
              <p
                className={`font-extrabold ${done || active ? "text-ink" : "text-muted"}`}
              >
                {step.status}
              </p>
              <p className="mt-0.5 text-sm text-muted">{step.text}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export default OrderTimeline;
