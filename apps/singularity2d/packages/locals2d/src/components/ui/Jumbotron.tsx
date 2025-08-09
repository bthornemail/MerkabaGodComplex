import logo from '../../assets/react.svg'
export default function Jumbotron({ input, action, reaction }: any) {
    return <section id="category-section card" style={{ display: "flex", flexDirection: "row" }}>
        <div className="category card-header" style={{ display: "flex", flexDirection: "column" }}>
            <div className="category card-title">Title</div>
            <div className="category card-summary">Summary</div>
            <div className='btn-group'>
                {input && <button type="button" className="btn btn-primary category-button" onClick={action}>Post</button>}
                {reaction && <button type="button" className="btn btn-primary category-button" onClick={action}>View</button>}
                {action && <button type="button" className="btn btn-primary category-button" onClick={action}>Query</button>}
            </div>
        </div>
        <img className="category card-image" src={logo} alt="IMage" />
    </section>
}