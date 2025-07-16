import React from "react";

export function RadioGroup({ value, onValueChange, className = "", children }) {
  return (
    <div className={className} role="radiogroup">
      {React.Children.map(children, (child) =>
        React.cloneElement(child, {
          checked: child.props.value === value,
          onChange: () => onValueChange(child.props.value),
        })
      )}
    </div>
  );
}

export function RadioGroupItem({ id, value, checked, onChange, className = "" }) {
  return (
    <input
      type="radio"
      id={id}
      name="radio-group"
      value={value}
      checked={checked}
      onChange={onChange}
      className={`h-4 w-4 text-primary border-border focus:ring-ring ${className}`}
    />
  );
} 