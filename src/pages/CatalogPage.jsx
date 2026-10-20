import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Button from "../Components/Ui/Button";
import Icon from "../Components/Ui/Icon";
import { BUILDER_SLOTS } from "../data/builderSlots";
import { PRODUCTS } from "../data/products";
import CatalogFilters from "../Features/catalog/CatalogFilters";
import ProductCard from "../Features/catalog/ProductCard";

const CATEGORIES = ["All parts", ...BUILDER_SLOTS];

function CatalogPage() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("featured");
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedCategory = searchParams.get("category") || "All parts";
  const category = CATEGORIES.includes(requestedCategory) ? requestedCategory : "All parts";

  const visibleProducts = useMemo(() => {
    const filtered = PRODUCTS.filter((product) => {
      const query = search.trim().toLowerCase();
      const matchesSearch = `${product.name} ${product.category} ${product.spec}`.toLowerCase().includes(query);
      return matchesSearch && (category === "All parts" || product.category === category);
    });
    if (sort === "price-low") return [...filtered].sort((a, b) => a.price - b.price);
    if (sort === "price-high") return [...filtered].sort((a, b) => b.price - a.price);
    if (sort === "name") return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    return filtered;
  }, [category, search, sort]);

  const handleCategoryChange = (nextCategory) => {
    if (nextCategory === "All parts") setSearchParams({});
    else setSearchParams({ category: nextCategory });
  };

  const handleClear = () => { setSearch(""); setSort("featured"); handleCategoryChange("All parts"); };

  return (
    <div className="content-width py-9 sm:py-12">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div><div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-extrabold uppercase tracking-wider text-primary"><Icon name="box" className="h-3.5 w-3.5" />Components</div><h1 className="mt-3 text-3xl font-black tracking-tight text-ink sm:text-4xl">Find your next part</h1><p className="mt-2 max-w-xl text-sm leading-6 text-muted sm:text-base">Explore trusted components for a PC that works the way you do.</p></div>
        <Link to="/builder" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border/80 bg-white/75 px-5 text-sm font-bold text-ink transition hover:border-primary/25 hover:bg-primary/5 hover:text-primary"><Icon name="cpu" className="h-4 w-4" />Open PC builder</Link>
      </div>
      <CatalogFilters search={search} category={category} categories={CATEGORIES} sort={sort} onSearchChange={setSearch} onCategoryChange={handleCategoryChange} onSortChange={setSort} />
      <div className="mt-6 flex items-center justify-between"><p className="text-sm font-semibold text-muted"><span className="font-black text-ink">{visibleProducts.length}</span> {visibleProducts.length === 1 ? "part" : "parts"} found</p>{(search || category !== "All parts" || sort !== "featured") && <button type="button" onClick={handleClear} className="text-xs font-bold text-primary hover:underline">Reset filters</button>}</div>
      {visibleProducts.length === 0 ? <div className="glass-panel mt-4 rounded-2xl p-10 text-center"><span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary"><Icon name="search" /></span><h2 className="mt-4 text-lg font-extrabold text-ink">No parts found</h2><p className="mt-1 text-sm text-muted">Try another search or reset your filters.</p><Button variant="ghost" onClick={handleClear} className="mt-4">Clear filters</Button></div> : <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{visibleProducts.map((product) => <ProductCard key={product.id} product={product} />)}</div>}
    </div>
  );
}

export default CatalogPage;
