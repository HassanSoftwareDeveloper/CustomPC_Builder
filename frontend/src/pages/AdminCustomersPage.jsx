import { useEffect, useMemo, useState } from "react";
import Icon from "../components/ui/Icon";
import { getCustomers } from "../services/authService";

function AdminCustomersPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    let active = true;
    getCustomers()
      .then((list) => active && setRows(list))
      .catch(
        (err) =>
          active && setMessage(err.message || "Could not load customers."),
      )
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const visibleRows = useMemo(
    () =>
      rows.filter((row) =>
        `${row.name} ${row.email}`
          .toLowerCase()
          .includes(search.trim().toLowerCase()),
      ),
    [rows, search],
  );
  const totalSpent = rows.reduce(
    (total, row) => total + Number(row.totalSpent || 0),
    0,
  );

  return (
    <div className="mx-auto max-w-[90rem] px-4 py-7 sm:px-8 sm:py-10">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.17em] text-primary">
            Your community
          </p>
          <h1 className="text-3xl font-black tracking-tight text-ink sm:text-4xl">
            Customers
          </h1>
          <p className="mt-2 text-sm text-muted">
            Get to know the people building their setups with you.
          </p>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-white px-4 py-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icon name="wallet" className="h-5 w-5" />
          </span>
          <span>
            <span className="block text-xs font-semibold text-muted">
              Customer lifetime spend
            </span>
            <span className="mt-0.5 block text-lg font-black text-ink">
              {loading ? "—" : `Rs ${totalSpent.toLocaleString()}`}
            </span>
          </span>
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
            <h2 className="font-black text-ink">Customer directory</h2>
            <p className="mt-0.5 text-xs text-muted">
              {loading
                ? "Loading customer list…"
                : `${visibleRows.length} of ${rows.length} registered customers`}
            </p>
          </div>
          <label className="relative block w-full sm:w-72">
            <span className="sr-only">Search customers</span>
            <Icon
              name="search"
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
            />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name or email"
              className="h-10 w-full rounded-full border border-border bg-bg/60 pl-9 pr-4 text-sm outline-none transition placeholder:text-muted/70 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
            />
          </label>
        </div>

        {loading ? (
          <div className="space-y-3 p-5" aria-label="Loading customers">
            <div className="h-12 animate-pulse rounded-xl bg-bg" />
            <div className="h-12 animate-pulse rounded-xl bg-bg" />
            <div className="h-12 animate-pulse rounded-xl bg-bg" />
          </div>
        ) : visibleRows.length === 0 ? (
          <div className="px-5 py-14 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Icon name="user" />
            </span>
            <h3 className="mt-3 font-bold text-ink">
              {rows.length
                ? "No customers match your search"
                : "No customers yet"}
            </h3>
            <p className="mt-1 text-sm text-muted">
              {rows.length
                ? "Try searching with another name or email."
                : "New customer accounts will appear here."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[38rem] text-left text-sm">
              <thead className="bg-bg/70 text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-5 py-3.5 font-bold">Customer</th>
                  <th className="px-4 py-3.5 font-bold">Email address</th>
                  <th className="px-4 py-3.5 text-right font-bold">Orders</th>
                  <th className="px-5 py-3.5 text-right font-bold">
                    Total spent
                  </th>
                </tr>
              </thead>
              <tbody>
                {visibleRows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-t border-border transition hover:bg-bg/50"
                  >
                    <td className="px-5 py-4">
                      <span className="flex items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-black uppercase text-primary">
                          {row.name?.trim()?.[0] || "?"}
                        </span>
                        <span className="font-bold text-ink">{row.name}</span>
                      </span>
                    </td>
                    <td className="px-4 py-4 text-muted">{row.email}</td>
                    <td className="px-4 py-4 text-right font-semibold text-ink">
                      {row.orderCount}
                    </td>
                    <td className="px-5 py-4 text-right font-bold text-ink">
                      Rs {Number(row.totalSpent || 0).toLocaleString()}
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

export default AdminCustomersPage;
