const OPTION_BASE = 'h-11 flex-1 cursor-pointer rounded-md text-[0.95rem]';
const OPTION_ACTIVE = 'bg-accent font-medium text-on-accent';
const OPTION_IDLE = 'bg-transparent text-muted';

function SegmentedControl({ label, options, value, onChange }) {
  return (
    <div
      role="group"
      aria-label={label}
      className="flex gap-1 rounded-[10px] border border-border bg-surface p-1"
    >
      {options.map((option) => {
        const isActive = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={isActive}
            className={`${OPTION_BASE} ${isActive ? OPTION_ACTIVE : OPTION_IDLE}`}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export default SegmentedControl;