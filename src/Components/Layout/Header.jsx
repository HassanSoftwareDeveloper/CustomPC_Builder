import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { ROLES } from "../../constants/roles";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";
import Icon from "../Ui/Icon";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Parts", to: "/parts" },
  { label: "PC Builder", to: "/builder" },
];

function Header() {
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setAccountOpen(false);
    setMobileOpen(false);
    navigate("/");
  };

  const navClass = ({ isActive }) =>
    `rounded-full px-4 py-2 text-sm font-semibold transition ${isActive ? "bg-primary/10 text-primary" : "text-muted hover:bg-white/70 hover:text-ink"}`;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white">
      <div className="content-width flex h-[76px] items-center justify-between gap-4">
        <Link to="/" className="group flex shrink-0 items-center gap-2.5" aria-label="Apna PC home">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/20 transition group-hover:-rotate-3 group-hover:scale-105">
            <Icon name="cpu" className="h-5 w-5" />
          </span>
          <span className="text-lg font-black tracking-tight text-ink">apna<span className="text-primary">pc</span><span className="text-accent">.</span></span>
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => <NavLink key={link.to} to={link.to} end={link.to === "/"} className={navClass}>{link.label}</NavLink>)}
          {user?.role === ROLES.ADMIN && <NavLink to="/admin" className={navClass}>Admin</NavLink>}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <Link to="/cart" aria-label={`Cart, ${cartCount} ${cartCount === 1 ? "item" : "items"}`} className="relative flex h-10 w-10 items-center justify-center rounded-full border border-border/80 bg-white/75 text-ink transition hover:border-primary/30 hover:bg-primary/5 hover:text-primary">
            <Icon name="cart" />
            {cartCount > 0 && <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-black text-ink">{cartCount}</span>}
          </Link>

          {user ? (
            <div className="relative hidden sm:block">
              <button type="button" onClick={() => setAccountOpen((open) => !open)} aria-expanded={accountOpen} aria-haspopup="menu" className="flex h-11 items-center gap-2 rounded-full border border-border/80 bg-white/75 py-1 pl-1 pr-3 transition hover:border-primary/30 hover:bg-white">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-black uppercase text-primary">{user.name?.trim()?.[0] || "U"}</span>
                <span className="max-w-40 truncate text-xs font-bold text-ink">Hi, {user.name}</span>
                <Icon name="chevron" className="h-4 w-4 text-muted" />
              </button>
              {accountOpen && <div role="menu" className="absolute right-0 top-14 w-56 rounded-2xl border border-border/80 bg-white/95 p-2 shadow-xl shadow-ink/10 backdrop-blur-xl">
                <Link role="menuitem" to="/account" onClick={() => setAccountOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-ink hover:bg-primary/5"><Icon name="user" className="h-4 w-4 text-primary" />My account</Link>
                {user.role === ROLES.ADMIN && <Link role="menuitem" to="/admin" onClick={() => setAccountOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-ink hover:bg-primary/5"><Icon name="shield" className="h-4 w-4 text-primary" />Admin dashboard</Link>}
                <button role="menuitem" type="button" onClick={handleLogout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-danger hover:bg-danger/5"><Icon name="logout" className="h-4 w-4" />Sign out</button>
              </div>}
            </div>
          ) : (
            <Link to="/login" className="hidden h-10 items-center gap-2 rounded-full bg-primary px-4 text-sm font-bold text-white shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:bg-primary-strong sm:flex"><Icon name="user" className="h-4 w-4" />Sign in</Link>
          )}

          <button type="button" aria-label={mobileOpen ? "Close menu" : "Open menu"} aria-expanded={mobileOpen} onClick={() => setMobileOpen((open) => !open)} className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-ink md:hidden"><Icon name={mobileOpen ? "x" : "menu"} /></button>
        </div>
      </div>

      {mobileOpen && <nav aria-label="Mobile navigation" className="border-t border-border/70 bg-white/95 px-4 py-4 shadow-xl backdrop-blur-xl md:hidden">
        <div className="content-width flex flex-col gap-1">
          {NAV_LINKS.map((link) => <NavLink key={link.to} to={link.to} end={link.to === "/"} onClick={() => setMobileOpen(false)} className={navClass}>{link.label}</NavLink>)}
          {user ? <><Link to="/account" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-ink hover:bg-primary/5"><Icon name="user" className="h-4 w-4 text-primary" />{user.name}</Link><button type="button" onClick={handleLogout} className="flex items-center gap-2 rounded-full px-4 py-2.5 text-left text-sm font-semibold text-danger hover:bg-danger/5"><Icon name="logout" className="h-4 w-4" />Sign out</button></> : <Link to="/login" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-primary hover:bg-primary/5"><Icon name="user" className="h-4 w-4" />Sign in or create account</Link>}
          {user?.role === ROLES.ADMIN && <NavLink to="/admin" onClick={() => setMobileOpen(false)} className={navClass}>Admin</NavLink>}
        </div>
      </nav>}
    </header>
  );
}

export default Header;
