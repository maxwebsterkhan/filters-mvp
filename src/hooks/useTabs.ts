// src/hooks/useTabs.ts

import { useMemo } from "react";
import { Tab } from "../types";

interface ProcessedTab {
  key: string;
  label: string;
}

interface UseTabsReturn {
  tabs: ProcessedTab[];
  selectedTab: string;
  onTabChange: (tabKey: string) => void;
}

export function useTabs(
  allTabs: Tab[],
  selectedTab: string,
  onTabChange: (tabKey: string) => void
): UseTabsReturn {
  const processedTabs = useMemo(
    () =>
      allTabs.map((tab) => ({
        key: tab.key,
        label: tab.heading,
      })),
    [allTabs]
  );

  return {
    tabs: processedTabs,
    selectedTab,
    onTabChange,
  };
}
