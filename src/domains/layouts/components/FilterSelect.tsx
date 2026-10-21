import type { SelectHTMLAttributes } from "react";

export interface FilterSelectOption {
  value: string;
  label: string;
}

export interface FilterSelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "onChange" | "value" | "size"> {
  value: string;
  onChange: (value: string) => void;
  options: readonly FilterSelectOption[];
  ariaLabel: string;
  allLabel: string;
}

export const FilterSelect = ({
  value,
  onChange,
  options,
  ariaLabel,
  allLabel,
  className,
  ...props
}: FilterSelectProps) => {
  return (
    <select
      aria-label={ariaLabel}
      className={className ? `udb-filter-select ${className}` : "udb-filter-select"}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      {...props}
    >
      <option value="">{allLabel}</option>

      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>

      ))}
    </select>

  );
};

FilterSelect.displayName = "FilterSelect";
