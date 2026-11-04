import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Icon from "../ui/Icon";

const ADMIN_LINKS = [
  { label: "Dashboard", to: "/admin", end: true, icon: "box" },
  { label: "Orders", to: "/admin/orders", icon: "cart" },
  { label: "Products", to: "/admin/products", icon: "cpu" },
  { label: "Customers", to: "/admin/customers", icon: "user" },
];

function AdminSidebar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <aside className="border-b border-border bg-white md:sticky md:top-0 md:flex md:min-h-screen md:w-64 md:shrink-0 md:flex-col md:border-b-0 md:border-r">
      <div className="flex items-center justify-between gap-3 px-5 py-4 md:px-6 md:py-6">
        <Link to="/" className="group flex items-center gap-3" aria-label="Apna PC home">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/20 transition group-hover:-rotate-3 group-hover:scale-105">
            <Icon name="cpu" className="h-5 w-5" />
          </span>
          <span>
            <span className="block text-lg font-black tracking-tight text-ink">apna<span className="text-primary">pc</span><span className="text-accent">.</span></span>
            <span className="block text-[10px] font-bold uppercase tracking-[0.16em] text-muted">Store admin</span>
          </span>
        </Link>
        <span className="hidden rounded-full bg-primary/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-primary md:inline-flex">Admin</span>
      </div>

      <nav aria-label="Admin navigation" className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-1 md:flex-col md:overflow-visible md:px-4 md:pb-4">
        <p className="hidden px-3 pb-2 pt-4 text-[10px] font-bold uppercase tracking-[0.16em] text-muted md:block">Workspace</p>
        {ADMIN_LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) => `flex shrink-0 items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition md:gap-3 ${isActive ? "bg-primary/10 text-primary" : "text-muted hover:bg-bg hover:text-ink"}`}
          >
            <Icon name={link.icon} className="h-[18px] w-[18px]" />
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="flex items-center gap-2 border-t border-border px-3 py-2 md:block md:p-4">
        <div className="mb-3 hidden items-center gap-3 rounded-2xl bg-bg p-3 md:flex">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-black uppercase text-primary">{user?.name?.trim()?.[0] || "A"}</span>
          <span className="min-w-0"><span className="block truncate text-sm font-bold text-ink">{user?.name || "Administrator"}</span><span className="text-xs text-muted">Store administrator</span></span>
        </div>
        <Link to="/" className="flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold text-muted transition hover:bg-bg hover:text-primary md:justify-start md:text-sm"><Icon name="arrow" className="h-4 w-4 rotate-180" />Back to shop</Link>
        <button type="button" onClick={handleLogout} className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-left text-xs font-semibold text-muted transition hover:bg-danger/5 hover:text-danger md:w-full md:justify-start md:text-sm"><Icon name="logout" className="h-4 w-4" />Log out</button>
      </div>
    </aside>
  );
}

export default AdminSidebar;
