// src/Components/SearchBar.tsx

import React from "react";
import { useSearchBar } from "../hooks/useSearchBar";

interface SearchBarProps {
  initialSearchTerm: string;
  onSearch: (term: string) => void;
  ariaLabel?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  initialSearchTerm,
  onSearch,
  ariaLabel,
}) => {
  const { handleInputChange } = useSearchBar(onSearch);

  return (
    <input
      type="text"
      defaultValue={initialSearchTerm}
      onChange={handleInputChange}
      aria-label={ariaLabel || "Search"}
      placeholder="Search..."
    />
  );
};

export default SearchBar;
