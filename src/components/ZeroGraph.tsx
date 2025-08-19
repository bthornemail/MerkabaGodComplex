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
    return (<div className="quantum-search-container">
        <section className="quantum-search-section">
            <div className="search-header">
                <h3>🔍 Quantum Knowledge Search</h3>
                <div className="search-status">
                    {isLoading ? '⏳ Searching...' : `📊 ${searchResults.size} Results`}
                </div>
            </div>
            <div className="search-results-container">
                {isLoading && <div className="search-loading">
                    <div className="loading-spinner"></div>
                    Quantum search in progress...
                </div>}
                {error && <div className="search-error">❌ {error}</div>}
                <div className="search-entries">
                    {searchResults.size === 0 && !isLoading && !error && (
                        <div className="no-results">
                            <div className="no-results-icon">🌌</div>
                            <p>No quantum search results yet.</p>
                            <p>Try using the search functionality in the footer.</p>
                        </div>
                    )}
                    {Array.from(searchResults.entries()).map(([entry, score]: any) => (
                        <div key={entry.id} className="search-entry">
                            <div className="entry-header">
                                <h4>{entry.id}</h4>
                                <span className="entry-score">Score: {score.toFixed(3)}</span>
                            </div>
                            <p className="entry-timestamp">
                                📅 {new Date(entry.metadata.timestamp).toLocaleString()}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        <style jsx>{`
            .quantum-search-container {
                background: linear-gradient(135deg, rgba(15, 15, 35, 0.9), rgba(30, 30, 63, 0.8));
                border: 1px solid rgba(99, 102, 241, 0.3);
                border-radius: 15px;
                padding: 20px;
                margin: 20px 0;
                backdrop-filter: blur(10px);
            }

            .quantum-search-section {
                min-height: 300px;
            }

            .search-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
                color: white;
            }

            .search-header h3 {
                margin: 0;
                font-family: 'Orbitron', monospace;
                color: #00ffff;
            }

            .search-status {
                font-size: 14px;
                color: #aaa;
                font-family: 'Courier New', monospace;
            }

            .search-results-container {
                background: rgba(0, 0, 0, 0.3);
                border-radius: 10px;
                padding: 15px;
                max-height: 400px;
                overflow-y: auto;
                border: 1px solid rgba(99, 102, 241, 0.2);
            }

            .search-loading {
                display: flex;
                align-items: center;
                gap: 10px;
                color: #00ffff;
                font-weight: 600;
                justify-content: center;
                padding: 40px;
            }

            .loading-spinner {
                width: 20px;
                height: 20px;
                border: 2px solid rgba(0, 255, 255, 0.3);
                border-radius: 50%;
                border-top-color: #00ffff;
                animation: spin 1s linear infinite;
            }

            @keyframes spin {
                to { transform: rotate(360deg); }
            }

            .search-error {
                color: #ff6b6b;
                padding: 20px;
                text-align: center;
                font-weight: 600;
            }

            .no-results {
                text-align: center;
                padding: 40px 20px;
                color: #888;
            }

            .no-results-icon {
                font-size: 3rem;
                margin-bottom: 15px;
            }

            .search-entries {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }

            .search-entry {
                background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1));
                border: 1px solid rgba(99, 102, 241, 0.3);
                border-radius: 8px;
                padding: 15px;
                transition: all 0.3s ease;
                color: white;
            }

            .search-entry:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 15px rgba(99, 102, 241, 0.2);
                border-color: rgba(99, 102, 241, 0.6);
            }

            .entry-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 8px;
            }

            .entry-header h4 {
                margin: 0;
                color: #00ffff;
                font-family: 'Exo 2', sans-serif;
            }

            .entry-score {
                background: rgba(16, 185, 129, 0.2);
                color: #10b981;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 12px;
                font-weight: 600;
            }

            .entry-timestamp {
                margin: 0;
                font-size: 12px;
                color: #aaa;
                font-family: 'Courier New', monospace;
            }

            /* Mobile-first responsive design */
            @media (max-width: 768px) {
                .quantum-search-container {
                    margin: 10px;
                    padding: 15px;
                }

                .search-header {
                    flex-direction: column;
                    gap: 10px;
                    text-align: center;
                }

                .search-results-container {
                    max-height: 300px;
                }

                .entry-header {
                    flex-direction: column;
                    gap: 8px;
                    align-items: flex-start;
                }
            }

            @media (max-width: 480px) {
                .quantum-search-container {
                    margin: 5px;
                    padding: 10px;
                }

                .search-header h3 {
                    font-size: 1.2rem;
                }

                .no-results-icon {
                    font-size: 2rem;
                }
            }
        `}</style>
    </div>);
}