import { Link } from "react-router-dom";
import Button from "../../components/ui/Button";
import Icon from "../../components/ui/Icon";
import ProductImage from "../../components/ui/ProductImage";
import { useCart } from "../../hooks/useCart";
import { getProductImage } from "../../utils/productImage";

function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-white transition-colors hover:border-primary/40">
      <Link
        to={`/parts/${product.id}`}
        aria-label={`View ${product.name}`}
        className="relative block overflow-hidden bg-bg"
      >
        <ProductImage
          src={getProductImage(product)}
          alt={product.name}
          className="aspect-[4/3] w-full transition duration-500 group-hover:scale-[1.04]"
        />
        <span className="absolute left-3 top-3 rounded-md bg-white px-2.5 py-1 text-[11px] font-semibold text-primary">
          {product.category}
        </span>
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <Link
          to={`/parts/${product.id}`}
          className="text-base font-extrabold leading-snug text-ink transition hover:text-primary"
        >
          {product.name}
        </Link>
        <p className="mt-1.5 min-h-10 text-xs leading-5 text-muted">
          {product.spec}
        </p>
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-border/70 pt-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted">
              Price
            </p>
            <p className="mt-0.5 text-lg font-black tracking-tight text-ink">
              Rs {product.price.toLocaleString()}
            </p>
          </div>
          <Button
            onClick={() => addToCart(product)}
            aria-label={`Add ${product.name} to cart`}
            className="min-h-10 px-4"
          >
            <Icon name="cart" className="h-4 w-4" />
            <span className="hidden sm:inline">Add</span>
          </Button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
