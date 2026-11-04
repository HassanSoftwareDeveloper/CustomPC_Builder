import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Button from "../components/ui/Button";
import Icon from "../components/ui/Icon";
import ProductImage from "../components/ui/ProductImage";
import { getProductById } from "../services/productService";
import { useCart } from "../hooks/useCart";
import { getProductImage } from "../utils/productImage";

function ProductPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [result, setResult] = useState({ id: null, product: null });

  useEffect(() => {
    let active = true;
    getProductById(id)
      .then((found) => active && setResult({ id, product: found || null }))
      .catch(() => active && setResult({ id, product: null }));
    return () => {
      active = false;
    };
  }, [id]);

  const product = result.product;
  const loading = result.id !== id;

  if (loading) {
    return (
      <div className="content-width py-10 sm:py-14">
        <div className="h-5 w-32 animate-pulse rounded bg-border" />
        <div className="mt-6 grid gap-8 lg:grid-cols-2">
          <div className="aspect-square animate-pulse rounded-3xl bg-white" />
          <div className="space-y-4 py-4">
            <div className="h-5 w-28 animate-pulse rounded bg-border" />
            <div className="h-10 w-3/4 animate-pulse rounded bg-border" />
            <div className="h-24 animate-pulse rounded-2xl bg-white" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="content-width py-12 sm:py-16">
        <div className="glass-panel rounded-3xl px-5 py-12 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Icon name="search" />
          </span>
          <h1 className="mt-4 text-2xl font-black text-ink">
            We couldn’t find that part
          </h1>
          <p className="mt-2 text-sm text-muted">
            It may have been removed or the link may be out of date.
          </p>
          <Link
            to="/parts"
            className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-white hover:bg-primary-strong"
          >
            Browse all parts <Icon name="arrow" className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  const outOfStock = product.stock === 0;
  const lowStock = product.stock > 0 && product.stock <= 5;

  return (
    <div className="content-width py-8 sm:py-12">
      <Link
        to="/parts"
        className="inline-flex items-center gap-2 text-sm font-semibold text-muted transition hover:text-primary"
      >
        <Icon name="arrow" className="h-4 w-4 rotate-180" />
        Back to parts
      </Link>

      <div className="mt-5 grid items-start gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        <div className="overflow-hidden rounded-3xl border border-border bg-white p-2 shadow-sm shadow-ink/[0.03]">
          <ProductImage
            src={getProductImage(product)}
            alt={product.name}
            className="aspect-[4/3] w-full rounded-[1.25rem] sm:aspect-square"
          />
        </div>

        <section className="rounded-3xl border border-border bg-white p-5 shadow-sm shadow-ink/[0.03] sm:p-8">
          <span className="inline-flex rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold capitalize text-primary">
            {product.category}
          </span>
          <h1 className="mt-4 text-3xl font-black leading-tight tracking-tight text-ink sm:text-4xl">
            {product.name}
          </h1>
          <p className="mt-3 text-3xl font-black tracking-tight text-primary">
            Rs {Number(product.price).toLocaleString()}
          </p>

          {outOfStock && (
            <p className="mt-2 text-sm font-bold text-danger">Out of stock</p>
          )}
          {lowStock && (
            <p className="mt-2 text-sm font-semibold text-muted">
              Only {product.stock} left
            </p>
          )}

          <div className="mt-6 rounded-2xl bg-bg/70 p-4 sm:p-5">
            <h2 className="text-sm font-black text-ink">Part details</h2>
            <dl className="mt-3 divide-y divide-border/80 text-sm">
              <div className="flex justify-between gap-4 py-3">
                <dt className="text-muted">Category</dt>
                <dd className="text-right font-semibold text-ink">
                  {product.category}
                </dd>
              </div>
              <div className="flex justify-between gap-4 py-3">
                <dt className="text-muted">Specifications</dt>
                <dd className="max-w-[65%] text-right font-semibold text-ink">
                  {product.spec || "Details coming soon"}
                </dd>
              </div>
              {product.socket && (
                <div className="flex justify-between gap-4 py-3">
                  <dt className="text-muted">Socket</dt>
                  <dd className="text-right font-semibold text-ink">
                    {product.socket}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Link
              to={`/builder?category=${encodeURIComponent(product.category)}&product=${encodeURIComponent(product.id)}`}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-border bg-white px-5 text-sm font-bold text-ink transition hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
            >
              <Icon name="cpu" className="h-4 w-4" />
              Use in my build
            </Link>
            <Button
              variant="ghost"
              disabled={outOfStock}
              onClick={() => addToCart(product)}
            >
              {outOfStock ? "Out of stock" : "Add to cart"}
            </Button>
          </div>
          <p className="mt-4 flex items-center gap-2 text-xs text-muted">
            <Icon name="check" className="h-4 w-4 text-primary" />
            Add this part to your build or cart whenever you’re ready.
          </p>
        </section>
      </div>
    </div>
  );
}

export default ProductPage;
