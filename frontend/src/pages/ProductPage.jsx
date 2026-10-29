import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Button from "../components/ui/Button";
import { getProductById } from "../services/productService";
import { useCart } from "../hooks/useCart";

function ProductPage() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [result, setResult] = useState({ id: null, product: null });

  useEffect(() => {
    let active = true;
    getProductById(id).then(
      (found) => active && setResult({ id, product: found || null }),
    );
    return () => {
      active = false;
    };
  }, [id]);

  const product = result.product;
  const loading = result.id !== id;

  if (loading) {
    return <p className="mx-auto max-w-6xl px-6 py-12">Loading...</p>;
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="text-3xl font-bold text-ink">Product not found</h1>
        <Link to="/parts" className="mt-4 inline-block underline">
          Back to parts
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <Link to="/parts" className="text-sm text-muted hover:text-ink">
        ← Back to parts
      </Link>

      <div className="mt-6 flex flex-col gap-10 md:flex-row">
        <div className="flex h-80 flex-1 items-center justify-center rounded-xl border border-dashed border-border bg-surface text-muted">
          Product photo
        </div>

        <div className="flex flex-1 flex-col gap-4">
          <p className="text-sm text-muted">{product.category}</p>
          <h1 className="text-4xl font-bold text-ink">{product.name}</h1>
          <p className="text-3xl font-bold text-ink">
            Rs {product.price.toLocaleString()}
          </p>

          <div className="rounded-xl border border-border bg-surface p-4">
            <div className="flex justify-between py-2">
              <span className="text-muted">Category</span>
              <span className="text-ink">{product.category}</span>
            </div>
            <div className="flex justify-between border-t border-border py-2">
              <span className="text-muted">Details</span>
              <span className="text-ink">{product.spec}</span>
            </div>
          </div>

          <div className="flex gap-4">
            <Button>Add to build</Button>
            <Button variant="ghost" onClick={() => addToCart(product)}>
              Add to cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
