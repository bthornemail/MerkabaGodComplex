import { createContext, useContext, useEffect, useLayoutEffect, useState } from "react";
// import { NodeType } from "../components/ZeroGraph";

export const ControllerContext = createContext<any>(null);

export const ControllerProvider = ({ children }: any) => {
  const contextValues = useController(); // Use the custom hook here

  return (
    <ControllerContext.Provider value={contextValues}>
      {children}
    </ControllerContext.Provider>
  );
};
export const useController = () => {
  const [useContextualSearch, setUseContextualSearch] = useState(true);
  const [selectedNode, setSelectedNode] = useState<any>('tetrahedron');
  const [searchResults, setSearchResults] = useState<Map<any, number>>(new Map());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  return {
    error,
    setError,
    isLoading,
    useContextualSearch,
    selectedNode,
    searchResults,
    setUseContextualSearch,
    setSelectedNode,
    setSearchResults,
    setIsLoading,
  } as const;
};