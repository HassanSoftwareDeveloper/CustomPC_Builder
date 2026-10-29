const VARIANT_CLASSES = {
  primary: "border-transparent bg-primary text-white shadow-lg shadow-primary/15 hover:-translate-y-0.5 hover:bg-primary-strong hover:shadow-xl",
  ghost: "border-border/80 bg-white/75 text-ink hover:border-primary/25 hover:bg-primary/5 hover:text-primary",
  accent: "border-transparent bg-accent text-ink shadow-lg shadow-accent/20 hover:-translate-y-0.5 hover:bg-[#f6b27f]",
};

function Button({ children, variant = "primary", className = "", ...rest }) {
  return (
    <button className={`inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 ${VARIANT_CLASSES[variant] || VARIANT_CLASSES.primary} ${className}`} {...rest}>
      {children}
    </button>
  );
}

export default Button;
