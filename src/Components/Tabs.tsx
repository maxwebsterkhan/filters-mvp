// Components/Tabs.tsx

import React, { memo } from "react";

interface TabProps {
  key: string;
  label: string;
}

interface TabsComponentProps {
  tabs: TabProps[];
  selectedTab: string;
  onTabChange: (tabKey: string) => void;
  ariaLabel?: string;
}

const Tabs: React.FC<TabsComponentProps> = ({
  tabs,
  selectedTab,
  onTabChange,
  ariaLabel,
}) => {
  return (
    <div
      className="tabs"
      role="tablist"
      aria-label={ariaLabel || "Search Type Tabs"}
    >
      {tabs.map((tab) => (
        <button
          key={tab.key}
          role="tab"
          aria-selected={selectedTab === tab.key}
          aria-controls={`tabpanel-${tab.key}`}
          id={`tab-${tab.key}`}
          className={`tab-button ${selectedTab === tab.key ? "active" : ""}`}
          onClick={() => onTabChange(tab.key)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              onTabChange(tab.key);
            }
          }}
          tabIndex={selectedTab === tab.key ? 0 : -1}
        >
          {tab.label} ({/* Optionally include total count */})
        </button>
      ))}
    </div>
  );
};

export default memo(Tabs);
