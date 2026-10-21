function PartSlot({ slot, options, selectedId, onChange }) {
  const chosen = options.find((product) => product.id === Number(selectedId));

  return (
    <div className="glass-panel rounded-2xl p-4 transition hover:border-primary/20">
      <label className="block">
        <span className="text-sm text-muted">{slot}</span>
        <select
          value={selectedId || ""}
          onChange={(event) => onChange(slot, event.target.value)}
          className="mt-2 h-12 w-full rounded-xl border border-border/80 bg-white/80 px-3 text-sm text-ink focus:border-primary/40 focus:outline-none focus:ring-4 focus:ring-primary/10"
        >
          <option value="">Choose a part</option>
          {options.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </select>
      </label>

      {chosen && (
        <p className="mt-3 text-sm text-muted">
          {chosen.spec} · Rs {chosen.price.toLocaleString()}
        </p>
      )}
    </div>
  );
}

export default PartSlot;
