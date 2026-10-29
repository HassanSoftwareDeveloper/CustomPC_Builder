import { getCustomers } from "../services/authService";
import { getOrders } from "../services/orderService";

function AdminCustomersPage() {
  const customers = getCustomers();
  const orders = getOrders();

  const rows = customers.map((customer) => {
    const customerOrders = orders.filter(
      (order) => order.userId === customer.id,
    );

    let totalSpent = 0;
    for (const order of customerOrders) {
      totalSpent = totalSpent + order.total;
    }

    return {
      ...customer,
      orderCount: customerOrders.length,
      totalSpent,
    };
  });

  return (
    <div className="px-6 py-12">
      <h1 className="text-4xl font-bold text-ink">Customers</h1>
      <p className="mt-2 text-muted">{rows.length} registered customers.</p>

      {rows.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-border bg-surface p-10 text-center text-muted">
          No customers yet.
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-surface">
          <table className="w-full min-w-[32rem] text-left text-sm">
            <thead className="border-b border-border text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 text-right font-medium">Orders</th>
                <th className="px-4 py-3 text-right font-medium">
                  Total spent
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-border last:border-0"
                >
                  <td className="px-4 py-3 text-ink">{row.name}</td>
                  <td className="px-4 py-3 text-muted">{row.email}</td>
                  <td className="px-4 py-3 text-right text-ink">
                    {row.orderCount}
                  </td>
                  <td className="px-4 py-3 text-right text-ink">
                    Rs {row.totalSpent.toLocaleString()}
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

export default AdminCustomersPage;
