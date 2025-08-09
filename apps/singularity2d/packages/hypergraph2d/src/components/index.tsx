function FloatingInput() {
    return <div className="fixed-top m-3">
        <button className="btn btn-primary" id="wordLookupBtn">
            <i className="bi bi-search"></i> Word Lookup
        </button>
        <button className="btn btn-secondary ms-2" id="manualEntryBtn">
            <i className="bi bi-pencil"></i> Manual Entry
        </button>
        <button className="btn btn-info ms-2" id="sentenceBuilderBtn">
            <i className="bi bi-diagram-3"></i> Sentence Builder
        </button>
    </div>;
}
function TetrahedronInfo() {
    return (<div id="tetrahedronInfo" className="tetrahedron-info d-none">
        <h5>Tetrahedron Info</h5>
        <div id="tetrahedronWords"></div>
        <div id="tetrahedronDefinitions" className="mt-2"></div>
    </div>);
}
