// src/hooks/useSearchBar.ts

import { useCallback } from "react";

export function useSearchBar(onSearch: (term: string) => void) {
  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onSearch(event.target.value);
    },
    [onSearch] // Include onSearch as a dependency
  );

  return {
    handleInputChange,
  };
}
