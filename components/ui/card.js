import React from "react";

export function Card({ className = "", ...props }) {
  return <div className={`rounded-lg border bg-card ${className}`} {...props} />;
}

export function CardHeader({ className = "", ...props }) {
  return <div className={`border-b border-border p-6 ${className}`} {...props} />;
}

export function CardTitle({ className = "", children }) {
  return <h3 className={`text-xl font-semibold ${className}`}>{children}</h3>;
}

export function CardDescription({ className = "", children }) {
  return <p className={`text-sm text-muted-foreground ${className}`}>{children}</p>;
}

export function CardContent({ className = "", ...props }) {
  return <div className={`p-6 ${className}`} {...props} />;
} 