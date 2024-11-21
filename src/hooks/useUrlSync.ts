// useUrlSync.ts
import { useEffect } from "react";

export function useUrlSync({
  tab,
  searchTerm,
  appliedFilters,
  currentPage,
}: {
  tab: string | undefined;
  searchTerm: string;
  appliedFilters: { [key: string]: string[] };
  currentPage: number;
}) {
  // Sync URL with the state
  useEffect(() => {
    const searchParams = new URLSearchParams();

    if (tab && tab !== "default") {
      searchParams.set("tab", tab);
    }
    if (searchTerm) searchParams.set("q", searchTerm);
    if (currentPage > 1) searchParams.set("page", currentPage.toString());
    searchParams.set("order", "1");

    Object.entries(appliedFilters).forEach(([key, values]) => {
      if (values.length > 0) {
        searchParams.set(key, values.join(","));
      }
    });

    const newUrl = `${window.location.pathname}?${searchParams
      .toString()
      .replace(/%2C/g, ",")}`;
    window.history.replaceState({}, "", newUrl);
  }, [tab, searchTerm, appliedFilters, currentPage]);
}
