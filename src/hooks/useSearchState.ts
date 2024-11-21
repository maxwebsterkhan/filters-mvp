// src/hooks/useSearchState.ts

import { useState, useEffect, useCallback, useMemo } from "react";
import debounce from "lodash.debounce";
import { Tab, Facet } from "../types";

export interface TabState {
  searchTerm: string;
  selectedFilters: { [key: string]: string[] };
  appliedFilters: { [key: string]: string[] };
  currentPage: number;
}

interface UseSearchStateReturn {
  tab: string;
  setTab: (tab: string) => void;
  searchTerm: string;
  selectedFilters: { [key: string]: string[] };
  appliedFilters: { [key: string]: string[] };
  currentPage: number;
  setTabState: (updates: Partial<TabState>) => void;
}

export function useSearchState(
  defaultTabKey: string,
  allTabs: Tab[],
  facets: Facet[]
): UseSearchStateReturn {
  const [tab, setTab] = useState(defaultTabKey);
  const [tabStates, setTabStates] = useState<{ [key: string]: TabState }>({});

  // Determine which filters are single-select based on facet type
  const singleSelectFilters = useMemo(() => {
    return facets
      .filter((facet) => facet.type === "dropdown")
      .map((facet) => facet.key);
  }, [facets]);

  // Initialize states for all tabs
  useEffect(() => {
    if (allTabs.length === 0) return;

    setTabStates((prev) => {
      const newStates = { ...prev };
      allTabs.forEach((t) => {
        const tabKey = t.key;
        if (!newStates[tabKey]) {
          newStates[tabKey] = {
            searchTerm: "",
            selectedFilters: {},
            appliedFilters: {},
            currentPage: 1,
          };
        }
      });
      return newStates;
    });
  }, [allTabs]);

  // Parse URL to restore active tab's state
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const restoredTab = searchParams.get("tab") || defaultTabKey;
    setTab(restoredTab);

    const searchTerm = searchParams.get("q") || "";
    const currentPage = parseInt(searchParams.get("page") || "1", 10);

    // Extract filters (excluding q, page, tab, order)
    const appliedFilters: { [key: string]: string[] } = {};
    searchParams.forEach((value, key) => {
      if (!["q", "page", "tab", "order"].includes(key)) {
        if (singleSelectFilters.includes(key)) {
          // For single-select filters, keep only the first value
          const firstValue = value.split(",")[0];
          appliedFilters[key] = firstValue ? [firstValue] : [];
        } else {
          // For multi-select filters, keep all values
          appliedFilters[key] = value.split(",");
        }
      }
    });

    setTabStates((prev) => ({
      ...prev,
      [restoredTab]: {
        searchTerm,
        selectedFilters: appliedFilters, // Initially, selectedFilters mirror appliedFilters
        appliedFilters,
        currentPage,
      },
    }));
  }, [defaultTabKey, singleSelectFilters]);

  // Debounced function to sync active tab's state with URL
  const syncUrl = useMemo(() => {
    return debounce((currentTab: string, state: TabState) => {
      const searchParams = new URLSearchParams();

      // Set active tab and its state
      searchParams.set("tab", currentTab);
      searchParams.set("q", state.searchTerm);
      searchParams.set("page", state.currentPage.toString());
      searchParams.set("order", "1"); // Adjust as needed

      Object.entries(state.appliedFilters).forEach(([key, values]) => {
        if (values.length > 0) {
          searchParams.set(key, values.join(","));
        }
      });

      // Workaround: Replace encoded commas with actual commas
      // This ensures the URL displays commas instead of %2C
      const queryString = searchParams.toString().replace(/%2C/g, ",");

      // Update the URL without affecting other tabs' states
      const newUrl = `${window.location.pathname}?${queryString}`;
      window.history.replaceState({}, "", newUrl);
    }, 300);
  }, []);

  const setTabState = useCallback(
    (updates: Partial<TabState>) => {
      setTabStates((prev) => {
        const updatedTabState = {
          ...prev[tab],
          ...updates,
        };
        const updated = {
          ...prev,
          [tab]: updatedTabState,
        };
        syncUrl(tab, updatedTabState);
        return updated;
      });
    },
    [tab, syncUrl]
  );

  // Sync URL when tab changes
  useEffect(() => {
    const currentTabState = tabStates[tab] || {
      searchTerm: "",
      selectedFilters: {},
      appliedFilters: {},
      currentPage: 1,
    };
    syncUrl(tab, currentTabState);
  }, [tab, tabStates, syncUrl]);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      syncUrl.cancel();
    };
  }, [syncUrl]);

  const currentTabState = tabStates[tab] || {
    searchTerm: "",
    selectedFilters: {},
    appliedFilters: {},
    currentPage: 1,
  };

  return {
    tab,
    setTab,
    searchTerm: currentTabState.searchTerm,
    selectedFilters: currentTabState.selectedFilters,
    appliedFilters: currentTabState.appliedFilters,
    currentPage: currentTabState.currentPage,
    setTabState,
  };
}
