export function Switch({ id, checked, onCheckedChange, className = "", ...props }) {
  return (
    <input
      type="checkbox"
      id={id}
      checked={checked}
      onChange={(e) => onCheckedChange?.(e.target.checked)}
      className={`relative inline-flex h-5 w-10 appearance-none items-center rounded-full border border-border bg-input transition-colors focus:outline-none checked:bg-primary ${className}`}
      {...props}
    />
  );
} 