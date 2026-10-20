import { Link } from "react-router-dom";
import Icon from "../Components/Ui/Icon";

function NotFoundPage() {
  return (
    <div className="content-width py-16 sm:py-24">
      <div className="glass-panel mx-auto max-w-2xl rounded-[2rem] px-6 py-12 text-center sm:px-12">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/10 text-primary"><Icon name="search" className="h-7 w-7" /></span>
        <p className="mt-6 text-xs font-black uppercase tracking-[0.16em] text-primary">404 · Page not found</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-ink sm:text-4xl">This page missed the build.</h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted">The address may be incorrect, or the page may have moved. Let’s get you back to the parts that fit.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3"><Link to="/" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-white shadow-lg shadow-primary/15 transition hover:-translate-y-0.5 hover:bg-primary-strong">Go to home <Icon name="arrow" className="h-4 w-4" /></Link><Link to="/parts" className="inline-flex min-h-11 items-center rounded-full border border-border/80 bg-white/75 px-5 text-sm font-bold text-ink transition hover:border-primary/25 hover:bg-primary/5 hover:text-primary">Browse parts</Link></div>
      </div>
    </div>
  );
}

export default NotFoundPage;
