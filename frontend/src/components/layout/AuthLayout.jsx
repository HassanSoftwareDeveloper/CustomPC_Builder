import { Link } from "react-router-dom";
import Icon from "../ui/Icon";

function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <aside className="hidden min-h-screen flex-col justify-between bg-[#f0ece5] px-10 py-9 text-ink lg:flex xl:px-16">
        <Link to="/" className="flex items-center gap-2.5 text-lg font-bold tracking-tight"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white"><Icon name="cpu" className="h-5 w-5" /></span>apnapc<span className="text-primary">.</span></Link>
        <div className="w-full max-w-2xl self-center py-8">
          <img src="/images/hero.jpg" alt="A real desktop PC photographed for Apna PC" className="aspect-[1.55] w-full rounded-xl border border-white/70 object-cover object-center shadow-sm" />
          <div className="mt-7 max-w-xl">
            <h1 className="text-3xl font-semibold leading-tight tracking-tight text-ink">Your Apna PC account</h1>
            <p className="mt-2 text-base leading-7 text-muted">Sign in to manage your account, builds, and orders.</p>
          </div>
        </div>
        <p className="text-xs text-muted">© {new Date().getFullYear()} Apna PC</p>
      </aside>

      <main className="flex min-h-screen items-center justify-center bg-bg px-5 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <Link to="/" className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-primary lg:hidden"><Icon name="arrow" className="h-4 w-4 rotate-180" />Back to Apna PC</Link>
          <div className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-9">
            <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon name="user" className="h-5 w-5" /></div>
            <h2 className="text-2xl font-semibold tracking-tight text-ink">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted">{subtitle}</p>
            <div className="mt-6">{children}</div>
            <p className="mt-6 border-t border-border pt-5 text-center text-sm text-muted">{footer}</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AuthLayout;
