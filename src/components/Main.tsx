import { Button } from "react-bootstrap"

export default function Main({ view, setView, children }: { view: boolean, setView: any, children?: React.ReactNode }) {
    return (
        <div className="container">
            <section style={{ height: "calc(100vh - 30rem)", margin: "1rem auto" }}>
                <label>Search Results
                    <Button onClick={() => { setView(!view) }}>Show</Button>
                </label>
                <div style={{ height: "100%", overflowY: "auto", border: "1px solid #ccc", padding: "10px" }}>
                    {children ? children : <div className="zg-loading">Loading...</div>}
                </div>
            </section>
        </div>)
}