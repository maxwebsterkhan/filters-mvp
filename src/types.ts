// src/types.ts

export interface Result {
  id: string;
  type: string;
  heading: string;
  url: string;
  // Add dynamic fields as needed. For dynamic filtering, you can use an index signature.
  [key: string]: string;
}

export interface Tab {
  heading: string;
  key: string;
  total: number;
  isSelected: boolean;
}

export interface FacetItem {
  label: string;
  value: string;
  total: number;
  isSelected: boolean;
}

export interface Facet {
  heading: string;
  key: string;
  isOpen: boolean;
  type: string;
  order: number;
  items: FacetItem[];
}

export interface Pagination {
  currentPage: number;
  pageSize: number;
  totalPages: number;
}

export interface SearchResponse<T> {
  summaryTabs: Tab[];
  summary: {
    query: string;
    total: number;
    sortOrder: number;
  };
  facets: Facet[];
  results: T[];
  pagination: Pagination;
}
