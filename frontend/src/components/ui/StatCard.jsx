import Icon from "./Icon";

function StatCard({ label, value, icon = "box", note }) {
  return (
    <div className="group rounded-3xl border border-border bg-white p-5 shadow-sm shadow-ink/[0.02] transition duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-ink/[0.06] sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-semibold text-muted">{label}</p>
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/8 text-primary transition group-hover:bg-primary group-hover:text-white"><Icon name={icon} className="h-5 w-5" /></span>
      </div>
      <p className="mt-5 text-3xl font-black tracking-tight text-ink">{value}</p>
      {note && <p className="mt-1 text-xs text-muted">{note}</p>}
    </div>
  );
}

export default StatCard;
