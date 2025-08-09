import Graph from "./components/Graph";

export default function Welcome() {
    return (
        <div className='quadrant'>
            <h1>Welcome to a Semantic Universe</h1>
            <p>Link to others
                <a href="http://"> Documents</a>,
                <a href="http://"> Assets</a>, and
                <a href="http://"> Services</a>
            </p>
            <div className="card">
                <Graph entity="marketplace" identity="0x" />
            </div>
        </div>
    );
}
