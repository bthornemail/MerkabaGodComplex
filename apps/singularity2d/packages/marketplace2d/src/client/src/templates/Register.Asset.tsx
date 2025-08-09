export default function RegisterAsset() {
    return (<div className="card">
        <div>
            <div>Image</div>
            <div>Video</div>
        </div>
        <div className="input-group">
            <input placeholder="Title" className="form-control" />
        </div>
        <input placeholder="Summary" className="form-control" />
        <textarea placeholder="Description" className="form-control" />
        <div className="input-group">
            <input type="file" placeholder="Description" className="form-control" />
            <button className="btn btn-primary" type="button">Register</button>
        </div>
    </div>)
}