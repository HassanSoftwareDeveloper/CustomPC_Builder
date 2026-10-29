import { Link } from "react-router-dom";
import Icon from "../ui/Icon";

function Footer() {
  return (
    <footer className="mt-16 border-t border-border/70 bg-white/60 backdrop-blur-xl">
      <div className="content-width grid gap-10 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-2">
          <Link
            to="/"
            className="flex items-center gap-2 text-lg font-black tracking-tight text-ink"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white">
              <Icon name="cpu" className="h-5 w-5" />
            </span>
            apna<span className="-ml-2 text-primary">pc</span>
            <span className="-ml-2 text-accent">.</span>
          </Link>
          <p className="mt-3 max-w-md text-sm leading-6 text-muted">
            Build a PC that fits your needs, your games, and your budget.
            Carefully chosen parts, one simple build at a time.
          </p>
        </div>
        <div>
          <h2 className="text-sm font-black uppercase tracking-wider text-ink">
            Explore
          </h2>
          <div className="mt-3 flex flex-col gap-2 text-sm text-muted">
            <Link className="hover:text-primary" to="/parts">
              Browse parts
            </Link>
            <Link className="hover:text-primary" to="/builder">
              PC builder
            </Link>
            <Link className="hover:text-primary" to="/cart">
              Your cart
            </Link>
          </div>
        </div>
        <div>
          <h2 className="text-sm font-black uppercase tracking-wider text-ink">
            Built around you
          </h2>
          <div className="mt-3 flex flex-col gap-2 text-sm text-muted">
            <span>Thoughtful component picks</span>
            <span>Compatibility checks</span>
            <span>Friendly local support</span>
          </div>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="content-width flex flex-wrap items-center justify-between gap-3 py-4 text-xs text-muted">
          <span>
            © {new Date().getFullYear()} Apna PC. Made for better builds.
          </span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
