// import { useWallet } from "../hooks/useWallet";

export default function Filter({graph}: any) {
    // const { wallet } = useWallet();
    return (<div style={{ minWidth: "fit-content" }}>
        <div className='input-group mb-2'>
            <button className="btn btn-sm btn-light rounded-3 me-2 text-secondary">Create <span className='text-white'>links</span></button>
            <input className="form-control form-control-sm form-input rounded-3  me-2" placeholder={"Entity"} type="text" />
            <button className="btn btn-sm btn-light rounded-3 me-2 text-secondary">to <span className='text-white'>others</span></button>
            <input className="form-control form-control-sm form-input rounded-3  me-4" placeholder={"Identity"} type="text" />
        </div>
        <div className="input-group">
            <button className="btn btn-sm btn-light rounded-3 me-2 text-secondary">using</button>
            <button className="btn btn-sm btn-outline-primary rounded-3  me-2">questions</button>
            <button className="btn btn-sm btn-outline-secondary rounded-3 me-2">comments</button>
            <button className="btn btn-sm btn-outline-success rounded-3 me-2">statements</button>
            <button className="btn btn-sm btn-outline-warning rounded-3 me-2">ratings</button>
            <button className="btn btn-sm btn-outline-dark rounded-3 me-2" disabled>and</button>
            <button className="btn btn-sm btn-outline-info rounded-3">reviews</button>
        </div>
    </div>)
}