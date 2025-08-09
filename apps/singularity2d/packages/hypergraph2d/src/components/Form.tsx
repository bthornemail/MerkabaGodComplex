import { useEffect, useState } from "react";
import { useWs } from "../hooks/useSocket";

function FormSelect({ options, message }: any) {
    const [ data, setData] = useState();
    useEffect(()=>{
        setData(JSON.parse(message));
    },[message]);
    return (<>
        {data && JSON.stringify(data)}
        <label htmlFor="identity" className="form-label">Identity</label>
        <select className="form-select form-select-sm" name="identity">
            <option value="message">{message}</option>
            {
                options.map((option: any, index: number) => <option key={index} value={option.identity}>{options.entity}</option>)
            }
        </select>
    </>);
};
type IDENTITY = {
    entity: string;
    identity: string;
};
export default function Form({ entity ,identity}: any) {
    const [options, setOptions] = useState<IDENTITY[]>([]);
    const {isReady, data, send} = useWs({ url: `ws://127.0.0.1:8000?entity=${entity}&identity=${identity}` }) as any;

    // useEffect(() => {
    //     if (ready && send) {
    //         send(entity)
    //     }
    // }, [ready, send]) // make sure to include send in dependency array

    useEffect(() => {
        if (data) {
            setOptions(data)
        }
    }, [data]) // make sure to include send in dependency array

    return <form className="form">
        {options.length < 0 && <FormSelect options={options} />}

        {isReady && <FormSelect options={options}  message={data} />}
        {/* <div>
            Ready: {JSON.stringify(ready)}, Value: {val}
        </div> */}
        <label htmlFor="entity" className="form-label">Entity</label>
        <input className="form-control form-control-sm" type="text" name="entity"></input>
        <label htmlFor="summary" className="form-label">Summary</label>
        <textarea className="form-control form-control-sm" name="summary"></textarea>
        <button type="button" className="btn btn-sm btn-success">Search</button>
        <button type="submit" className="btn btn-sm btn-primary">Add</button>
    </form>
}

