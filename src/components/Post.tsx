import { useState, useRef, useContext } from "react";
import { ZeroGraphContext } from '../hooks/useZeroGraph';
import { ControllerContext } from "../hooks/useController";
export default function Post() {
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
    
    // ZeroGraph hooks
    const {
        addEntry, setQuery, entries, database, query,
        deserialize, serialize, syncPersonalGraph,
        hypergraph, nodes,
        // hypergraph, nodes, wallet,
        searchWithContext, searchInNode,
        getHypergraphStats, findSimilarNodes
    } = useContext(ZeroGraphContext);

    // Refs
    const addInput = useRef<HTMLInputElement>(null);
    const fileInput = useRef<HTMLInputElement>(null);

    // Handle adding new entries
    const handleSubmit = (e: any) => {
        e.preventDefault();
        if (!addInput.current?.value.trim()) {
            setError('Please enter some text');
            return;
        }

        try {
            const text = addInput.current.value;
            console.log(addEntry(text));
            addInput.current.value = "";
            setError(null);
            handleSync();
        } catch (err) {
            console.error('Error adding entry:', err);
            setError('Failed to add entry');
        }
    };

    // Handle adding new entries
    const handleAdd = (e: React.MouseEvent) => {
        // e.preventDefault();
        if (!addInput.current?.value.trim()) {
            setError('Please enter some text');
            return;
        }

        try {
            const text = addInput.current.value;
            addEntry(text);
            addInput.current.value = "";
            setError(null);
            handleSync();
        } catch (err) {
            console.error('Error adding entry:', err);
            setError('Failed to add entry');
        }
    };

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

    // Handle file import
    const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const file = files[0];
        const reader = new FileReader();

        reader.onload = async (event) => {
            try {
                const text = event.target?.result as string;
                deserialize(event);
                setError(null);
            } catch (err) {
                console.error('Import error:', err);
                setError('Failed to import data');
            }
        };

        reader.onerror = () => {
            setError('Error reading file');
        };

        reader.readAsText(file);
    };
    return (<div className="input-group">
        <div>
            <button className="btn btn-outline-success" onClick={() => fileInput.current?.click()}>
                Picture
            </button>
            <input
                className="fomr-control"
                ref={fileInput}
                type="file"
                accept=".json"
                onChange={handleFileImport}
                style={{ display: 'none' }}
            />
            <br />
            <label>Picture</label>
        </div>
        <div>
            <button className="btn btn-outline-warning" onClick={handleAdd}>Video</button>
            <br />
            <label>Video</label>
        </div>
        <div>
            <button className="btn btn-outline-danger" onClick={handleAdd}>Audio</button>
            <br />
            <label>Audio</label>
        </div>
        <div>
            <button className="btn btn-outline-secondary" onClick={handleAdd}>File</button>
            <br />
            <label>File</label>
        </div>
        <div style={{ minWidth: "max-content" }}>
            <input
                className="form-control"
                ref={addInput}
                type="text"
                placeholder="Enter new knowledge..."
                onKeyDownCapture={(e)=> e.key === "Enter" && handleSubmit(e)}
            />
            <label>Post Knowledge</label>
        </div>
        <div className="button-group">
            <button className="btn btn-outline-primary"  onClick={handleSubmit}>Post</button>
        </div>
    </div>)
}