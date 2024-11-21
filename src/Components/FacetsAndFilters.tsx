// src/Components/FacetsAndFilters.tsx

import React from "react";
import { Facet } from "../types";

interface FacetsAndFiltersProps {
  facets: Facet[];
  selectedFilters: { [key: string]: string[] };
  onFilterChange: (filters: { [key: string]: string[] }) => void;
  ariaLabel?: string;
}

const FacetsAndFilters: React.FC<FacetsAndFiltersProps> = ({
  facets,
  selectedFilters,
  onFilterChange,
  ariaLabel = "Facets and Filters",
}) => {
  // Determine which filters are single-select
  const singleSelectFilters = facets
    .filter((facet) => facet.type === "dropdown")
    .map((facet) => facet.key);

  const handleCheckboxChange = (facetKey: string, value: string) => {
    const currentValues = selectedFilters[facetKey] || [];
    let updatedValues: string[] = [];

    if (currentValues.includes(value)) {
      updatedValues = currentValues.filter((v) => v !== value);
    } else {
      updatedValues = [...currentValues, value];
    }

    onFilterChange({
      ...selectedFilters,
      [facetKey]: updatedValues,
    });
  };

  const handleDropdownChange = (facetKey: string, value: string) => {
    // For single-select filters, set only one value
    onFilterChange({
      ...selectedFilters,
      [facetKey]: value ? [value] : [],
    });
  };

  return (
    <div className="facets-and-filters" aria-label={ariaLabel}>
      {facets.map((facet) => (
        <div key={facet.key} className="facet">
          <h3>{facet.heading}</h3>
          {facet.type === "checkbox" && (
            <ul>
              {facet.items.map((item) => (
                <li key={item.value}>
                  <label>
                    <input
                      type="checkbox"
                      checked={
                        selectedFilters[facet.key]?.includes(item.value) ||
                        false
                      }
                      onChange={() =>
                        handleCheckboxChange(facet.key, item.value)
                      }
                    />
                    {item.label} ({item.total})
                  </label>
                </li>
              ))}
            </ul>
          )}
          {facet.type === "dropdown" && (
            <select
              value={selectedFilters[facet.key]?.[0] || ""}
              onChange={(e) => handleDropdownChange(facet.key, e.target.value)}
              aria-label={`Select ${facet.heading}`}
            >
              <option value="">Select {facet.heading}</option>
              {facet.items.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label} ({item.total})
                </option>
              ))}
            </select>
          )}
        </div>
      ))}
    </div>
  );
};

export default FacetsAndFilters;
