import { useState, useRef, useContext } from "react";
import { ZeroGraphContext } from '../hooks/useZeroGraph';
import { NodeType } from "./ZeroGraph";
import { ControllerContext } from "../hooks/useController";
export default function Search() {
    // ZeroGraph hooks
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

    const {
        addEntry, setQuery, entries, database, query,
        deserialize, serialize, syncPersonalGraph,
        hypergraph, nodes,
        // hypergraph, nodes, wallet,
        searchWithContext, searchInNode,
        getHypergraphStats, findSimilarNodes
    } = useContext(ZeroGraphContext);

    // Handle personal data sync
    const handleSync = () => {
        try {
            syncPersonalGraph([
                'my note about crypto',
                'important project idea',
                'family members'
            ]);
        } catch (err) {
            console.error('Error syncing personal graph:', err);
            setError('Failed to sync personal data');
        }
    };

    // Handle search
    const handleSearch = (searchQuery: string) => {
        setIsLoading(true);
        setError(null);

        try {
            let results: Map<any, number>;

            if (selectedNode === 'tetrahedron') {
                results = useContextualSearch
                    ? searchWithContext(searchQuery, true)
                    : searchInNode('tetrahedron', searchQuery);
            } else {
                results = searchInNode(selectedNode, searchQuery);
            }

            setSearchResults(results);
        } catch (err) {
            console.error('Search error:', err);
            setError('Search failed');
        } finally {
            setIsLoading(false);
        }
    };
    return (<div className="input-group ">
        <div className="zg-node-selector">
            <select
                className="form-control"
                value={selectedNode}
                onChange={(e) => setSelectedNode(e.target.value as NodeType)}
            >
                <option value="tetrahedron">Tetrahedron</option>
                <option value="input">Input Node</option>
                <option value="output">Output Node</option>
                <option value="socket">Socket Node</option>
                <option value="server">Server Node</option>
            </select>
            <label>Active Context</label>
        </div>
        <div className="zg-search-box">
            <input
                className="form-control"
                type="text"
                placeholder="Search knowledge graph..."
                onChange={(e) => handleSearch(e.target.value)}
                disabled={isLoading}
            />
            <label>
                <input
                    className="form-checkbox"
                    type="checkbox"
                    checked={useContextualSearch}
                    onChange={() => setUseContextualSearch(!useContextualSearch)}
                />
                Use Contextual Search
            </label>
        </div>
        <div>
            <button className="btn btn-outline-warning" onClick={handleSync}>Sync</button>
        </div>
    </div>)
}