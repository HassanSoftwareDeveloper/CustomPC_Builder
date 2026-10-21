import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Icon from "../ui/Icon";

const ADMIN_LINKS = [
  { label: "Dashboard", to: "/admin", end: true, icon: "box" },
  { label: "Orders", to: "/admin/orders", icon: "cart" },
  { label: "Products", to: "/admin/products", icon: "cpu" },
  { label: "Customers", to: "/admin/customers", icon: "user" },
];

function AdminSidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate("/"); };

  return (
    <aside className="flex flex-col gap-6 bg-[#102e2b] p-5 text-white shadow-xl shadow-ink/10 md:sticky md:top-0 md:min-h-screen md:w-64 md:shrink-0 md:p-6">
      <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10"><Icon name="cpu" /></span><div><div className="text-lg font-black tracking-tight">apnapc<span className="text-accent">.</span></div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/50">Store admin</p></div></div>
      <nav aria-label="Admin navigation" className="flex flex-1 flex-row gap-1 overflow-x-auto md:flex-col">
        {ADMIN_LINKS.map((link) => <NavLink key={link.to} to={link.to} end={link.end} className={({ isActive }) => `flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${isActive ? "bg-white/15 text-white shadow-inner" : "text-white/65 hover:bg-white/8 hover:text-white"}`}><Icon name={link.icon} className="h-4 w-4" />{link.label}</NavLink>)}
      </nav>
      <div className="flex flex-row items-center gap-3 border-t border-white/10 pt-4 text-sm md:flex-col md:items-stretch"><NavLink to="/" className="flex items-center gap-2 rounded-lg px-2 py-2 text-white/65 hover:bg-white/8 hover:text-white"><Icon name="arrow" className="h-4 w-4 rotate-180" />Back to shop</NavLink><button type="button" onClick={handleLogout} className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-left text-white/65 hover:bg-white/8 hover:text-white"><Icon name="logout" className="h-4 w-4" />Log out</button></div>
    </aside>
  );
}

export default AdminSidebar;
