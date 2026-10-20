function StepCard({ number, title, text }) {
  return (
    <article className="rounded-xl border border-border bg-white p-5 sm:p-6">
      <span className="text-sm font-semibold text-primary">Step {Number(number)}</span>
      <h3 className="mt-3 text-lg font-semibold text-ink">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted">{text}</p>
    </article>
  );
}

export default StepCard;
