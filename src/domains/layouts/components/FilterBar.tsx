import type { ReactNode } from "react";
import { SearchBox } from "@umituz/web-design-system/molecules";
import { cn } from "@umituz/web-design-system/utils/cn";
import type { BaseProps } from "@umituz/web-design-system/types";

export interface FilterBarSearch {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export interface FilterBarProps extends BaseProps {
  search?: FilterBarSearch;
    children?: ReactNode;
    actions?: ReactNode;
}

export const FilterBar = ({ search, children, actions, className, ...props }: FilterBarProps) => {
  return (
    <div className={cn("udb-filter-bar", className)} {...props}>
      {search && (
        <SearchBox
          value={search.value}
          onChange={search.onChange}
          placeholder={search.placeholder}
          className="udb-filter-bar__search"
        />
      )}
      {children && <div className="udb-filter-bar__fields">{children}</div>}

      {actions && <div className="udb-filter-bar__actions">{actions}</div>}

    </div>

  );
};

FilterBar.displayName = "FilterBar";
