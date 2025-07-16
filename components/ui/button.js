export function Button({ className = "", ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none enabled:hover:opacity-90 disabled:opacity-50 disabled:pointer-events-none ${className}`}
      {...props}
    />
  );
} 