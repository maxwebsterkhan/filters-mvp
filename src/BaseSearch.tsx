// src/BaseSearch.tsx

import React, { useCallback } from "react";
import SearchBar from "./Components/SearchBar";
import FacetsAndFilters from "./Components/FacetsAndFilters";
import Tabs from "./Components/Tabs";
import Pagination from "./Components/Pagination";
import Card from "./Components/Card";
import FilterActions from "./Components/FilterActions";

import { useSearchState } from "./hooks/useSearchState";
import { useSearchData } from "./hooks/useSearchData";
import { useSearchRendering } from "./hooks/useSearchRendering";
import { useTabs } from "./hooks/useTabs";

import { Result, Tab, Facet } from "./types";

interface BaseSearchProps {
  endpoint: string;
  showTabs?: boolean;
  showFacets?: boolean;
  showPagination?: boolean;
  useMock?: boolean;
}

const BaseSearch: React.FC<BaseSearchProps> = ({
  endpoint = "api/test",
  showTabs = true,
  showFacets = true,
  showPagination = true,
  useMock = true,
}) => {
  const defaultTabKey = "products";

  // Initial fetch to get summaryTabs and facets
  const {
    data: initialData,
    isLoading: isInitialLoading,
    error: initialError,
  } = useSearchData(endpoint, defaultTabKey, "", {}, 1, useMock);

  // Extract summaryTabs and facets from initialData
  const allTabs: Tab[] = initialData?.summaryTabs || [];
  const facets: Facet[] = initialData?.facets || [];

  // Initialize search state with the fetched tabs and facets
  const {
    tab,
    setTab,
    searchTerm,
    setTabState,
    selectedFilters,
    appliedFilters,
    currentPage,
  } = useSearchState(defaultTabKey, allTabs, facets);

  // Fetch search data based on active tab's state
  const { data, isLoading, error } = useSearchData(
    endpoint,
    tab,
    searchTerm,
    appliedFilters,
    currentPage,
    useMock
  );

  console.log("Initial Data:", initialData);
  console.log("Active Tab:", tab);
  console.log("Search Results Data:", data);
  console.log("Is Loading:", isLoading);
  console.log("Error:", error);

  // Handlers wrapped with useCallback to ensure stable references
  const handleSearch = useCallback(
    (term: string) => {
      setTabState({ searchTerm: term, currentPage: 1 });
    },
    [setTabState]
  );

  const handleTabChange = useCallback(
    (newTab: string) => {
      setTab(newTab);
    },
    [setTab]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      setTabState({ currentPage: page });
    },
    [setTabState]
  );

  const handleFilterChange = useCallback(
    (filters: { [key: string]: string[] }) => {
      setTabState({ selectedFilters: filters });
    },
    [setTabState]
  );

  const handleApplyFilters = useCallback(() => {
    setTabState({ appliedFilters: selectedFilters, currentPage: 1 });
  }, [setTabState, selectedFilters]);

  const handleClearFilters = useCallback(() => {
    setTabState({
      selectedFilters: {},
      appliedFilters: {},
      currentPage: 1,
    });
  }, [setTabState]);

  const { tabs, selectedTab, onTabChange } = useTabs(
    allTabs,
    tab,
    handleTabChange
  );

  // Combine initial and active loading and error states
  const combinedLoading = isInitialLoading || isLoading;
  const combinedError = initialError || error;

  const renderContent = useSearchRendering<Result>({
    isLoading: combinedLoading,
    error: combinedError,
    results: data?.results || [],
    children: (
      <div>
        {/* Render search results here */}
        <ul role="list" aria-label="Search Results">
          {data?.results.map((item: Result) => (
            <li key={item.id} role="listitem">
              <Card
                id={item.id}
                type={item.type}
                heading={item.heading}
                url={item.url}
              />
            </li>
          ))}
        </ul>
        {showPagination &&
          data?.pagination?.totalPages &&
          data.pagination.totalPages > 1 && (
            <Pagination
              currentPage={data.pagination.currentPage}
              totalPages={data.pagination.totalPages}
              onPageChange={handlePageChange}
              ariaLabel="Search Results Pagination"
            />
          )}
      </div>
    ),
  });

  return (
    <div className="search">
      <SearchBar
        initialSearchTerm={searchTerm}
        onSearch={handleSearch}
        ariaLabel="Main Search Bar"
      />
      {showTabs && tabs.length > 0 && (
        <Tabs
          tabs={tabs}
          selectedTab={selectedTab}
          onTabChange={onTabChange}
          ariaLabel="Search Type Tabs"
        />
      )}
      {showFacets && (
        <>
          <FacetsAndFilters
            facets={facets}
            selectedFilters={selectedFilters}
            onFilterChange={handleFilterChange}
            ariaLabel="Search Facets and Filters"
          />
          <FilterActions
            applyFilters={handleApplyFilters}
            clearFilters={handleClearFilters}
            isApplyDisabled={Object.keys(selectedFilters).length === 0}
            isClearDisabled={Object.keys(appliedFilters).length === 0}
          />
        </>
      )}
      {renderContent}
    </div>
  );
};

export default BaseSearch;
