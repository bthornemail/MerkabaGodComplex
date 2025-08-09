export default function PostService() {
    return (<div className="input-group">
          <input placeholder="Title" className="form-control" />
          <input placeholder="Summary" className="form-control" />
          <input type="file" placeholder="Description" className="form-control" />
          <button className="btn btn-primary" type="button">Register</button>
    </div>)
}