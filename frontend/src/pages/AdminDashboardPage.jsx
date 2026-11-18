import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Icon from "../components/ui/Icon";
import StatCard from "../components/ui/StatCard";
import { getOrders } from "../services/orderService";
import {
  getLowStock,
  getOrdersOverTime,
  getSalesByCategory,
  getSummary,
  getTopProducts,
} from "../services/analyticsService";
import { useProducts } from "../hooks/useProducts";

const RANGES = [7, 30, 90];

const CATEGORY_LABELS = {
  cpu: "Processor",
  motherboard: "Motherboard",
  gpu: "Graphics card",
  ram: "Memory",
  storage: "Storage",
  psu: "Power supply",
  case: "Case",
  cooler: "Cooler",
};

const formatMoney = (value) =>
  `Rs ${Number(value || 0).toLocaleString("en-PK")}`;

const formatCompactMoney = (value) => {
  const amount = Number(value || 0);
  if (amount < 1000000) return formatMoney(amount);
  return `Rs ${new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(amount)}`;
};

const shortMoney = (value) =>
  value >= 1000000
    ? `${(value / 1000000).toFixed(1)}M`
    : value >= 1000
      ? `${Math.round(value / 1000)}k`
      : String(value);

const shorten = (text = "") =>
  text.length > 18 ? `${text.slice(0, 17)}…` : text;

const getResult = (result) =>
  result.status === "fulfilled" ? result.value : null;

function getDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function fillDays(rows, days) {
  const byDate = new Map(rows.map((row) => [row.date, row]));
  const filled = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - i);
    const key = getDateKey(date);
    filled.push(byDate.get(key) || { date: key, orders: 0, sales: 0 });
  }

  return filled;
}

function Message({ children }) {
  return (
    <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-border bg-bg/60 px-4 text-center text-sm text-muted">
      {children}
    </div>
  );
}

function ChartCard({
  title,
  subtitle,
  loading,
  error,
  empty,
  children,
  className = "",
}) {
  return (
    <section
      className={`min-w-0 rounded-3xl border border-border bg-white p-5 shadow-sm sm:p-6 ${className}`}
    >
      <h3 className="text-lg font-black tracking-tight text-ink">{title}</h3>
      <p className="mt-1 text-sm text-muted">{subtitle}</p>

      <div className="mt-4 h-72">
        {loading ? (
          <div className="h-full animate-pulse rounded-2xl bg-bg" />
        ) : error ? (
          <Message>Could not load this chart.</Message>
        ) : empty ? (
          <Message>No data available for this period.</Message>
        ) : (
          children
        )}
      </div>
    </section>
  );
}

function SalesTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const row = payload[0].payload;

  return (
    <div className="rounded-xl border border-border bg-white px-3 py-2 text-xs shadow-lg">
      <p className="font-bold text-ink">{label}</p>
      <p className="mt-1 text-muted">{row.orders} orders</p>
      <p className="text-muted">{formatMoney(row.sales)}</p>
    </div>
  );
}

function AdminDashboardPage() {
  const [days, setDays] = useState(30);

  const [data, setData] = useState({
    days: null,
    summary: null,
    daily: null,
    top: null,
    categories: null,
    lowStock: null,
  });

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState("");

  const { products, loading: productsLoading } = useProducts();

  useEffect(() => {
    let active = true;

    async function loadAnalytics() {
      const results = await Promise.allSettled([
        getSummary(days),
        getOrdersOverTime(days),
        getTopProducts(days),
        getSalesByCategory(days),
        getLowStock(5),
      ]);

      if (!active) return;

      const [summary, daily, top, categories, lowStock] =
        results.map(getResult);
      setData({ days, summary, daily, top, categories, lowStock });
    }

    loadAnalytics();

    return () => {
      active = false;
    };
  }, [days]);

  useEffect(() => {
    let active = true;
    getOrders()
      .then((list) => active && setOrders(list))
      .catch(
        (err) =>
          active && setOrdersError(err.message || "Could not load orders."),
      )
      .finally(() => active && setOrdersLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const loading = data.days !== days;

  const dailyRows = useMemo(
    () =>
      !loading && Array.isArray(data.daily) ? fillDays(data.daily, days) : [],
    [data.daily, days, loading],
  );

  const categoryRows = useMemo(
    () =>
      Array.isArray(data.categories)
        ? data.categories.map((row) => ({
            ...row,
            label: CATEGORY_LABELS[row.category] || row.category,
          }))
        : [],
    [data.categories],
  );

  const summaryValue = (format) =>
    loading ? "—" : data.summary ? format(data.summary) : "N/A";

  const formatDate = (value) => {
    const [, month, day] = value.split("-");
    return `${month}/${day}`;
  };

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="mx-auto max-w-[90rem] px-4 py-7 sm:px-8 sm:py-10">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.17em] text-primary">
            Your store at a glance
          </p>
          <h1 className="text-3xl font-black tracking-tight text-ink sm:text-4xl">
            Dashboard
          </h1>
          <p className="mt-2 text-sm text-muted sm:text-base">
            Welcome back. Here’s what’s happening with your store.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* One filter for every card and chart */}
          <div className="inline-flex rounded-full border border-border bg-white p-1">
            {RANGES.map((range) => (
              <button
                key={range}
                type="button"
                onClick={() => setDays(range)}
                aria-pressed={days === range}
                className={`rounded-full px-4 py-1.5 text-sm font-bold transition ${
                  days === range
                    ? "bg-primary text-white"
                    : "text-muted hover:text-ink"
                }`}
              >
                {range} days
              </button>
            ))}
          </div>

          <Link
            to="/admin/products"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:bg-primary-strong"
          >
            <Icon name="cpu" className="h-4 w-4" /> Manage products
          </Link>
        </div>
      </div>

      {/* Stat cards */}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <StatCard
          label="Total sales"
          value={summaryValue((s) => formatCompactMoney(s.sales))}
          icon="chart"
          note={`Last ${days} days, excluding cancelled`}
        />
        <StatCard
          label="Total orders"
          value={summaryValue((s) => s.orders ?? 0)}
          icon="cart"
          note={`Last ${days} days, excluding cancelled`}
        />
        <StatCard
          label="Pending orders"
          value={summaryValue((s) => s.pendingOrders ?? 0)}
          icon="truck"
          note="Right now, all dates"
        />
        <StatCard
          label="Cancelled orders"
          value={summaryValue((s) => s.cancelledOrders ?? 0)}
          icon="box"
          note={`Last ${days} days`}
        />
        <StatCard
          label="Products in store"
          value={productsLoading ? "—" : products.length}
          icon="cpu"
          note="Parts available to customers"
        />
      </div>

      {/* Charts */}

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <ChartCard
          title="Sales & Orders Trend"
          subtitle="Daily sales revenue and order activity."
          loading={loading}
          error={data.daily === null && !loading}
          empty={data.daily?.length === 0}
          className="lg:col-span-2"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={dailyRows}
              margin={{ top: 10, right: 16, left: 8, bottom: 4 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                minTickGap={24}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                yAxisId="sales"
                tickFormatter={shortMoney}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                yAxisId="orders"
                orientation="right"
                allowDecimals={false}
                tick={{ fontSize: 12 }}
              />
              <Tooltip content={<SalesTooltip />} />
              <Legend />
              <Line
                yAxisId="sales"
                type="monotone"
                dataKey="sales"
                name="Sales"
                stroke="#b94a2b"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 5 }}
              />
              <Line
                yAxisId="orders"
                type="monotone"
                dataKey="orders"
                name="Orders"
                stroke="#2f7f79"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Top Selling Products"
          subtitle="Best sellers by units sold."
          loading={loading}
          error={data.top === null && !loading}
          empty={data.top?.length === 0}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data.top || []}
              layout="vertical"
              margin={{ top: 8, right: 16, left: 8, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis
                type="number"
                allowDecimals={false}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={130}
                tickFormatter={shorten}
                tick={{ fontSize: 12 }}
              />
              <Tooltip formatter={(value) => [value, "Units sold"]} />
              <Bar dataKey="unitsSold" fill="#2f7f79" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Revenue by Category"
          subtitle="Revenue generated by each product category."
          loading={loading}
          error={data.categories === null && !loading}
          empty={data.categories?.length === 0}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={categoryRows}
              layout="vertical"
              margin={{ top: 8, right: 16, left: 8, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis
                type="number"
                tickFormatter={shortMoney}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                type="category"
                dataKey="label"
                width={110}
                tick={{ fontSize: 12 }}
              />
              <Tooltip formatter={(value) => [formatMoney(value), "Revenue"]} />
              <Bar dataKey="revenue" fill="#c9922e" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Low stock */}

      <section className="mt-4 rounded-3xl border border-border bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-black tracking-tight text-ink">
              Low Stock Alerts
            </h3>
            <p className="mt-1 text-sm text-muted">
              Products with five or fewer units remaining.
            </p>
          </div>
          <Link
            to="/admin/products"
            className="text-sm font-bold text-primary hover:underline"
          >
            Manage products
          </Link>
        </div>

        <div className="mt-4">
          {loading ? (
            <div className="h-16 animate-pulse rounded-2xl bg-bg" />
          ) : data.lowStock === null ? (
            <p className="text-sm text-muted">
              Could not load inventory information.
            </p>
          ) : data.lowStock.length === 0 ? (
            <p className="text-sm text-muted">
              All products have sufficient stock.
            </p>
          ) : (
            <ul className="divide-y divide-border/80">
              {data.lowStock.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between gap-4 py-3 text-sm"
                >
                  <div className="min-w-0">
                    <p className="truncate font-bold text-ink">{item.name}</p>
                    <p className="text-xs text-muted">
                      {CATEGORY_LABELS[item.category] || item.category}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
                      item.stock === 0
                        ? "bg-red-50 text-red-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {item.stock === 0 ? "Out of stock" : `${item.stock} left`}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Recent orders and quick actions  */}

      <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_300px]">
        <section className="min-w-0 rounded-3xl border border-border bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-black tracking-tight text-ink">
                Recent orders
              </h2>
              <p className="mt-1 text-sm text-muted">
                Keep track of your latest customer activity.
              </p>
            </div>
            <Link
              to="/admin/orders"
              className="group inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-bold text-primary transition hover:bg-primary/5"
            >
              View all{" "}
              <Icon
                name="arrow"
                className="h-4 w-4 transition group-hover:translate-x-1"
              />
            </Link>
          </div>

          {ordersError && (
            <p
              role="alert"
              className="mt-5 rounded-2xl bg-danger/5 px-4 py-3 text-sm font-medium text-danger"
            >
              {ordersError}
            </p>
          )}

          {ordersLoading ? (
            <div className="mt-5 space-y-3" aria-label="Loading recent orders">
              <div className="h-12 animate-pulse rounded-xl bg-bg" />
              <div className="h-12 animate-pulse rounded-xl bg-bg" />
              <div className="h-12 animate-pulse rounded-xl bg-bg" />
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="mt-5 rounded-2xl border border-dashed border-border bg-bg/60 px-5 py-10 text-center">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Icon name="cart" />
              </span>
              <h3 className="mt-3 font-bold text-ink">
                Your first order will show up here
              </h3>
              <p className="mt-1 text-sm text-muted">
                When customers place an order, you can review it from this
                dashboard.
              </p>
            </div>
          ) : (
            <div className="mt-5 overflow-x-auto rounded-2xl border border-border">
              <table className="w-full min-w-[36rem] text-left text-sm">
                <thead className="bg-bg/70 text-xs uppercase tracking-wide text-muted">
                  <tr>
                    <th className="px-4 py-3 font-bold">Order</th>
                    <th className="px-4 py-3 font-bold">Customer</th>
                    <th className="px-4 py-3 font-bold">Date</th>
                    <th className="px-4 py-3 font-bold">Status</th>
                    <th className="px-4 py-3 text-right font-bold">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-t border-border transition hover:bg-bg/50"
                    >
                      <td className="px-4 py-3.5">
                        <Link
                          to={`/order-confirmation/${order.id}`}
                          className="font-bold text-primary hover:underline"
                        >
                          #{String(order.id).slice(-8)}
                        </Link>
                      </td>
                      <td className="px-4 py-3.5 font-semibold text-ink">
                        {order.customer?.fullName || "Customer"}
                      </td>
                      <td className="px-4 py-3.5 text-muted">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${
                            order.status === "Pending"
                              ? "bg-accent/20 text-[#80500d]"
                              : order.status === "Delivered"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-primary/8 text-primary"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right font-bold text-ink">
                        {formatMoney(order.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <aside className="rounded-3xl bg-[#332a25] p-5 text-white shadow-lg shadow-ink/10 sm:p-6">
          <h2 className="text-xl font-black">Quick actions</h2>
          <p className="mt-1 text-sm leading-relaxed text-white/65">
            Jump straight into the tasks you do most.
          </p>
          <div className="mt-5 flex flex-col gap-2">
            {[
              ["Add a product", "/admin/products", "cpu"],
              ["Review orders", "/admin/orders", "cart"],
              ["Browse customers", "/admin/customers", "user"],
            ].map(([label, to, icon]) => (
              <Link
                key={to}
                to={to}
                className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold transition hover:border-white/20 hover:bg-white/10"
              >
                <span className="flex items-center gap-3">
                  <Icon name={icon} className="h-4 w-4 text-accent" />
                  {label}
                </span>
                <Icon
                  name="arrow"
                  className="h-4 w-4 text-white/45 transition group-hover:translate-x-1 group-hover:text-white"
                />
              </Link>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}

export default AdminDashboardPage;
