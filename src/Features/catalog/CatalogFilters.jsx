import Icon from "../../Components/Ui/Icon";

function CatalogFilters({ search, category, categories, sort, onSearchChange, onCategoryChange, onSortChange }) {
  return (
    <div className="glass-panel rounded-2xl p-4 sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <label className="flex-1">
          <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted">Search components</span>
          <span className="relative block"><Icon name="search" className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" /><input type="search" value={search} onChange={(event) => onSearchChange(event.target.value)} placeholder="Try “Ryzen”, “RTX”, or “16GB”…" className="h-12 w-full rounded-xl border border-border/80 bg-white/80 pl-11 pr-4 text-sm text-ink placeholder:text-muted/70 focus:border-primary/40 focus:outline-none focus:ring-4 focus:ring-primary/10" /></span>
        </label>
        <label className="sm:w-52">
          <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted">Sort by</span>
          <select value={sort} onChange={(event) => onSortChange(event.target.value)} className="h-12 w-full rounded-xl border border-border/80 bg-white/80 px-3.5 text-sm font-semibold text-ink focus:border-primary/40 focus:outline-none focus:ring-4 focus:ring-primary/10">
            <option value="featured">Featured</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="name">Name: A to Z</option>
          </select>
        </label>
      </div>
      <div className="mt-4 flex gap-2 overflow-x-auto pb-1" aria-label="Filter by category">
        {categories.map((item) => <button key={item} type="button" onClick={() => onCategoryChange(item)} aria-pressed={category === item} className={`shrink-0 rounded-full border px-4 py-2 text-xs font-bold transition ${category === item ? "border-primary bg-primary text-white shadow-md shadow-primary/15" : "border-border/80 bg-white/70 text-muted hover:border-primary/30 hover:text-primary"}`}>{item}</button>)}
      </div>
    </div>
  );
}

export default CatalogFilters;
