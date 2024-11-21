// App.tsx
import React from "react";
import BaseSearch from "./BaseSearch";

const App: React.FC = () => {
  return (
    <>
      {" "}
      <BaseSearch
        endpoint="api/test"
        showTabs={true}
        showFacets={true}
        showPagination={true}
        useMock={true}
      />
    </>
  );
};

export default App;
