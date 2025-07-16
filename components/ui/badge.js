export function Badge({ variant = "primary", className = "", children, ...props }) {
  const variantClass =
    variant === "secondary"
      ? "bg-muted text-foreground"
      : "bg-primary text-primary-foreground";
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${variantClass} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
} 