function Input({ label, id, error, ...rest }) {
  const borderClass = error ? "border-red-400" : "border-border";

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm text-muted">
        {label}
      </label>
      <input
        id={id}
        className={`h-12 rounded-xl border bg-white/80 px-3.5 text-sm text-ink placeholder:text-muted/70 focus:border-primary/40 focus:outline-none focus:ring-4 focus:ring-primary/10 ${borderClass}`}
        {...rest}
      />
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}

export default Input;
