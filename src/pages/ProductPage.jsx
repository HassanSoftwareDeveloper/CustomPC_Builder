import { Link, useNavigate, useParams } from "react-router-dom";
import Button from "../components/ui/Button";
import Icon from "../components/ui/Icon";
import ProductImage from "../components/ui/ProductImage";
import { useCart } from "../hooks/useCart";
import { getProductById } from "../services/productService";
import { getProductImage } from "../utils/productImage";

function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const product = getProductById(id);

  if (!product) return <div className="content-width py-16"><div className="glass-panel rounded-3xl p-10 text-center"><h1 className="text-3xl font-black text-ink">We couldn’t find that part</h1><p className="mt-2 text-muted">It may have moved. Browse the catalog to find another one.</p><Link to="/parts" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary">Back to parts <Icon name="arrow" className="h-4 w-4" /></Link></div></div>;

  return (
    <div className="content-width py-8 sm:py-12">
      <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-2 text-xs font-semibold text-muted"><Link to="/parts" className="hover:text-primary">Parts</Link><span>/</span><span>{product.category}</span><span>/</span><span className="truncate text-ink">{product.name}</span></nav>
      <div className="grid items-start gap-6 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="glass-panel overflow-hidden rounded-[1.7rem] p-3"><ProductImage src={getProductImage(product)} alt={product.name} className="aspect-[4/3] w-full rounded-[1.25rem] sm:aspect-[5/4]" /></div>
        <section className="glass-panel rounded-[1.7rem] p-5 sm:p-8">
          <span className="inline-flex rounded-full bg-primary/10 px-3 py-1.5 text-xs font-extrabold text-primary">{product.category}</span>
          <h1 className="mt-4 text-3xl font-black leading-tight tracking-tight text-ink sm:text-4xl">{product.name}</h1>
          <p className="mt-3 text-sm leading-6 text-muted">A reliable component for a balanced custom PC. Add it to your cart or check how it fits into your full build.</p>
          <p className="mt-6 text-3xl font-black tracking-tight text-ink">Rs {product.price.toLocaleString()}</p>
          <div className="mt-6 rounded-2xl border border-border/70 bg-white/65 p-4"><p className="text-xs font-bold uppercase tracking-wider text-muted">Key details</p><div className="mt-3 flex items-start justify-between gap-4 border-t border-border/70 pt-3 text-sm"><span className="font-semibold text-muted">Specifications</span><span className="text-right font-bold text-ink">{product.spec}</span></div>{product.socket && <div className="mt-3 flex justify-between gap-4 border-t border-border/70 pt-3 text-sm"><span className="font-semibold text-muted">Socket</span><span className="font-bold text-ink">{product.socket}</span></div>}</div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2"><Button onClick={() => addToCart(product)} className="w-full"><Icon name="cart" className="h-4 w-4" />Add to cart</Button><Button variant="ghost" onClick={() => navigate("/builder")} className="w-full"><Icon name="cpu" className="h-4 w-4" />View in builder</Button></div>
        </section>
      </div>
    </div>
  );
}

export default ProductPage;
