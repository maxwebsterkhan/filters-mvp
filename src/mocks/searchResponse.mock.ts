// src/mocks/searchResponse.mock.ts

import { SearchResponse, Result } from "../types";

export const mockSearchResponse: SearchResponse<Result> = {
  summaryTabs: [
    {
      heading: "Products",
      key: "products",
      total: 45,
      isSelected: true,
    },
    {
      heading: "Services",
      key: "services",
      total: 30,
      isSelected: false,
    },
  ],
  summary: {
    query: "compactor",
    total: 75,
    sortOrder: 1,
  },
  facets: [
    {
      heading: "Brand",
      key: "brand",
      isOpen: true,
      type: "checkbox",
      order: 1,
      items: [
        {
          label: "Brand A",
          value: "a",
          total: 20,
          isSelected: false,
        },
        {
          label: "Brand B",
          value: "b",
          total: 15,
          isSelected: true,
        },
        {
          label: "Brand C",
          value: "c",
          total: 10,
          isSelected: false,
        },
      ],
    },
    {
      heading: "Power Type",
      key: "powertype",
      isOpen: false,
      type: "checkbox",
      order: 2,
      items: [
        {
          label: "Electric",
          value: "1",
          total: 35,
          isSelected: true,
        },
        {
          label: "Gasoline",
          value: "2",
          total: 20,
          isSelected: false,
        },
        {
          label: "Manual",
          value: "3",
          total: 20,
          isSelected: false,
        },
      ],
    },
    {
      heading: "Color",
      key: "color",
      isOpen: false,
      type: "checkbox",
      order: 3,
      items: [
        {
          label: "Red",
          value: "red",
          total: 10,
          isSelected: false,
        },
        {
          label: "Blue",
          value: "blue",
          total: 15,
          isSelected: true,
        },
        {
          label: "Green",
          value: "green",
          total: 5,
          isSelected: false,
        },
      ],
    },
  ],
  results: [
    {
      id: "1",
      type: "product",
      heading: "Heavy-Duty Compactor",
      url: "/products/heavy-duty-compactor",
      brand: "a",
      powertype: "1",
      color: "red",
    },
    {
      id: "2",
      type: "product",
      heading: "Electric Mini Compactor",
      url: "/products/electric-mini-compactor",
      brand: "b",
      powertype: "1",
      color: "blue",
    },
    {
      id: "20",
      type: "product",
      heading: "Compact Compactor Pro",
      url: "/products/compact-compactor-pro",
      brand: "c",
      powertype: "2",
      color: "green",
    },
  ],
  pagination: {
    currentPage: 1,
    pageSize: 1,
    totalPages: 3,
  },
};
