// src/hooks/useSearchRendering.tsx

import React from "react";

interface RenderProps<T> {
  isLoading: boolean;
  error: Error | null;
  results: T[];
  children: React.ReactNode;
}

export function useSearchRendering<T>({
  isLoading,
  error,
  results,
  children,
}: RenderProps<T>) {
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data: {error.message}</div>;
  if (results.length === 0) return <div>No results found.</div>;
  return <>{children}</>;
}
