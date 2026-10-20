import { useState } from "react";
import { BUILDER_SLOTS } from "../data/builderSlots";
import PartSlot from "../Features/PartSlot";
import SummaryPanel from "../Features/builder/SummaryPanel";
import { checkCompatibility } from "../utils/compatibility";
import { useCart } from "../hooks/useCart";
import { getProducts } from "../services/productService";
import Icon from "../Components/Ui/Icon";

function BuilderPage() {
  const { addToCart } = useCart();
  const products = getProducts();
  const [selected, setSelected] = useState({});

  const handleChange = (slot, productId) => {
    setSelected((current) => ({ ...current, [slot]: productId }));
  };

  const chosenCount = BUILDER_SLOTS.filter((slot) => selected[slot]).length;

  const chosenParts = BUILDER_SLOTS.map((slot) =>
    products.find((product) => product.id === Number(selected[slot])),
  ).filter((part) => part !== undefined);

  let total = 0;
  for (const part of chosenParts) {
    total = total + part.price;
  }

  const issues = checkCompatibility(chosenParts);
  const isComplete = chosenParts.length === BUILDER_SLOTS.length;

  const handleAddBuild = () => {
    for (const part of chosenParts) {
      addToCart(part);
    }
  };

  return (
    <div className="content-width py-9 sm:py-12">
      <div className="mb-7"><div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-extrabold uppercase tracking-wider text-primary"><Icon name="cpu" className="h-4 w-4" />Build studio</div><h1 className="mt-3 text-3xl font-black tracking-tight text-ink sm:text-4xl">Create your PC build</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-muted">Choose a component for each slot. Your parts and estimated total update as you go.</p></div>

      <div className="glass-panel mb-5 rounded-2xl p-4"><div className="flex items-center justify-between gap-4"><div><p className="text-sm font-extrabold text-ink">Build progress</p><p className="mt-1 text-xs text-muted">{chosenCount} of {BUILDER_SLOTS.length} components selected</p></div><span className="text-lg font-black text-primary">{Math.round((chosenCount / BUILDER_SLOTS.length) * 100)}%</span></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-primary/10"><div className="h-full rounded-full bg-gradient-to-r from-primary to-[#63b6a6] transition-all duration-500" style={{ width: `${(chosenCount / BUILDER_SLOTS.length) * 100}%` }} /></div></div>

      <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-start">
        <div className="grid flex-1 gap-3 md:grid-cols-2">
          {BUILDER_SLOTS.map((slot) => (
            <PartSlot
              key={slot}
              slot={slot}
              options={products.filter((product) => product.category === slot)}
              selectedId={selected[slot]}
              onChange={handleChange}
            />
          ))}
        </div>

        <div className="lg:w-80">
          <SummaryPanel
            parts={chosenParts}
            total={total}
            issues={issues}
            isComplete={isComplete}
            onAddBuild={handleAddBuild}
          />
        </div>
      </div>
    </div>
  );
}

export default BuilderPage;
