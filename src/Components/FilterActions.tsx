// Components/FilterActions.tsx

import React, { memo } from "react";

interface FilterActionsProps {
  applyFilters: () => void;
  clearFilters: () => void;
  isApplyDisabled: boolean;
  isClearDisabled: boolean;
  ariaLabel?: string;
}

const FilterActions: React.FC<FilterActionsProps> = ({
  applyFilters,
  clearFilters,
  isApplyDisabled,
  isClearDisabled,
  ariaLabel,
}) => {
  return (
    <div className="filter-actions" aria-label={ariaLabel || "Filter Actions"}>
      <button
        onClick={applyFilters}
        disabled={isApplyDisabled}
        aria-disabled={isApplyDisabled}
        aria-label="Apply Filters"
      >
        Apply Filters
      </button>
      <button
        onClick={clearFilters}
        disabled={isClearDisabled}
        aria-disabled={isClearDisabled}
        aria-label="Clear Filters"
      >
        Clear Filters
      </button>
    </div>
  );
};

export default memo(FilterActions);
