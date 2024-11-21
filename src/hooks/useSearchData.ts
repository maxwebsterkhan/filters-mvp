// src/hooks/useSearchData.ts

import { useQuery } from "@tanstack/react-query";
import { mockSearchResponse } from "../mocks/searchResponse.mock";
import { fetchFromApi } from "../utils/api";
import { SearchResponse, Result } from "../types";
import { useCallback } from "react";

export interface AppliedFilters {
  [key: string]: string[];
}

export interface FetchSearchDataParams {
  endpoint: string;
  tab: string;
  searchTerm: string;
  appliedFilters: AppliedFilters;
  currentPage: number;
}

async function fetchMockSearchData({
  currentPage,
  searchTerm,
  appliedFilters,
}: {
  currentPage: number;
  searchTerm: string;
  appliedFilters: AppliedFilters;
}): Promise<SearchResponse<Result>> {
  const pageSize = mockSearchResponse.pagination.pageSize;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  // Apply search term filter
  let filteredResults = mockSearchResponse.results.filter((result) =>
    result.heading.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Apply dynamic filters
  Object.entries(appliedFilters).forEach(([key, values]) => {
    filteredResults = filteredResults.filter((result) => {
      const resultValue = result[key];
      if (!resultValue) return false;
      if (Array.isArray(resultValue)) {
        return values.some((val) => resultValue.includes(val));
      }
      return values.includes(resultValue.toString());
    });
  });

  const paginatedResults = filteredResults.slice(startIndex, endIndex);

  const totalResults = filteredResults.length;
  const totalPages = Math.ceil(totalResults / pageSize);

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        ...mockSearchResponse,
        results: paginatedResults,
        pagination: {
          ...mockSearchResponse.pagination,
          currentPage,
          totalPages,
        },
      });
    }, 500); // Simulated delay
  });
}

async function fetchApiSearchData({
  endpoint,
  tab,
  searchTerm,
  appliedFilters,
  currentPage,
}: FetchSearchDataParams): Promise<SearchResponse<Result>> {
  const queryParams = new URLSearchParams();
  queryParams.set("q", searchTerm);
  queryParams.set("page", currentPage.toString());
  queryParams.set("tab", tab);
  queryParams.set("order", "1"); // Adjust as needed

  Object.entries(appliedFilters).forEach(([key, values]) => {
    if (values.length > 0) {
      queryParams.set(key, values.join(","));
    }
  });

  const url = `${endpoint}/search?${queryParams.toString()}`; // Assuming /search endpoint
  return fetchFromApi<SearchResponse<Result>>(url);
}

export function useSearchData(
  endpoint: string,
  tab: string,
  searchTerm: string,
  appliedFilters: AppliedFilters,
  currentPage: number,
  useMock: boolean = false
) {
  const fetchSearchData = useCallback(async (): Promise<
    SearchResponse<Result>
  > => {
    if (useMock) {
      return fetchMockSearchData({ currentPage, searchTerm, appliedFilters });
    }
    return fetchApiSearchData({
      endpoint,
      tab,
      searchTerm,
      appliedFilters,
      currentPage,
    });
  }, [endpoint, tab, searchTerm, appliedFilters, currentPage, useMock]);

  return useQuery<SearchResponse<Result>, Error>({
    queryKey: ["searchData", tab, searchTerm, appliedFilters, currentPage],
    queryFn: fetchSearchData,
    staleTime: 5 * 60 * 1000, // Data is fresh for 5 minutes
    retry: 2, // Retry up to 2 times on failure
  });
}
