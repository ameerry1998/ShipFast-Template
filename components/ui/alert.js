export function Alert({ className = "", children }) {
  return <div className={`flex items-start gap-3 rounded-lg border border-border p-4 ${className}`}>{children}</div>;
}

export function AlertDescription({ className = "", children }) {
  return <div className={`text-sm ${className}`}>{children}</div>;
} 