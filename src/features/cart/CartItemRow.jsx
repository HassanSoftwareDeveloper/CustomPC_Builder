import Icon from "../../components/ui/Icon";
import ProductImage from "../../components/ui/ProductImage";
import { getProductImage } from "../../utils/productImage";

function CartItemRow({ item, onChangeQuantity, onRemove }) {
  return (
    <article className="glass-panel flex flex-wrap items-center gap-4 rounded-2xl p-3.5 sm:p-4">
      <ProductImage src={getProductImage(item)} alt={item.name} className="h-20 w-20 rounded-xl sm:h-24 sm:w-24" />
      <div className="min-w-36 flex-1"><p className="text-[10px] font-bold uppercase tracking-wider text-primary">{item.category}</p><h3 className="mt-1 font-extrabold text-ink">{item.name}</h3><p className="mt-1 text-xs text-muted">{item.spec}</p></div>
      <div className="flex items-center gap-2 rounded-full border border-border/80 bg-white/70 p-1"><button type="button" aria-label={`Decrease ${item.name} quantity`} onClick={() => onChangeQuantity(item.id, -1)} className="flex h-8 w-8 items-center justify-center rounded-full text-lg text-ink hover:bg-primary/10 hover:text-primary">−</button><span className="min-w-5 text-center text-sm font-bold text-ink">{item.quantity}</span><button type="button" aria-label={`Increase ${item.name} quantity`} onClick={() => onChangeQuantity(item.id, 1)} className="flex h-8 w-8 items-center justify-center rounded-full text-lg text-ink hover:bg-primary/10 hover:text-primary">+</button></div>
      <div className="ml-auto min-w-24 text-right"><p className="text-[10px] font-bold uppercase tracking-wider text-muted">Subtotal</p><p className="mt-1 font-black text-ink">Rs {(item.price * item.quantity).toLocaleString()}</p><button type="button" onClick={() => onRemove(item.id)} className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-danger hover:underline"><Icon name="x" className="h-3 w-3" />Remove</button></div>
    </article>
  );
}

export default CartItemRow;
