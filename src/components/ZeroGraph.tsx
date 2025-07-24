import { useContext } from "react";
import { ControllerContext } from "../hooks/useController";

export type NodeType = 'input' | 'output' | 'socket' | 'server' | 'tetrahedron';

export default function ZeroGraph() {
    const {
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
    } = useContext(ControllerContext);
    return (<div className="container">
        <section style={{ height: "50vh", margin: "1rem auto" }}>
            <label>Search Results</label>
            <div style={{ height: "100%", overflowY: "auto", border: "1px solid #ccc", padding: "10px" }}>
                {isLoading && <div className="zg-loading">Searching...</div>}
                {error && <div className="zg-error">{error}</div>}
                <div className="zg-entries">
                    {Array.from(searchResults.entries()).map(([entry, score]: any) => (
                        <div key={entry.id} className="zg-entry">
                            <h3>{entry.id}</h3>
                            <p>Score: {score.toFixed(3)}</p>
                            <p className="zg-meta">
                                {new Date(entry.metadata.timestamp).toLocaleString()}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    </div>);
}