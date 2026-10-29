import Button from "../../components/ui/Button";

function SummaryPanel({ parts, total, issues, isComplete, onAddBuild }) {
  const hasIssues = issues.length > 0;

  return (
    <aside className="glass-panel flex flex-col gap-4 rounded-2xl p-5">
      <h2 className="text-xl font-black text-ink">Your build</h2>

      {parts.length === 0 && (
        <p className="text-sm text-muted">No parts chosen yet.</p>
      )}

      <ul className="flex flex-col gap-2">
        {parts.map((part) => (
          <li key={part.id} className="flex justify-between text-sm">
            <span className="text-ink">{part.name}</span>
            <span className="text-muted">Rs {part.price.toLocaleString()}</span>
          </li>
        ))}
      </ul>

      <div className="flex justify-between border-t border-border pt-4 text-lg font-bold text-ink">
        <span>Total</span>
        <span>Rs {total.toLocaleString()}</span>
      </div>

      {hasIssues &&
        issues.map((issue) => (
          <p
            key={issue}
            className="rounded-lg border border-danger px-3 py-2 text-sm text-danger"
          >
            {issue}
          </p>
        ))}

      {!hasIssues && parts.length > 1 && (
        <p className="text-sm text-muted">No compatibility problems found.</p>
      )}

      <Button onClick={onAddBuild} disabled={!isComplete || hasIssues}>
        Add build to cart
      </Button>
    </aside>
  );
}

export default SummaryPanel;
