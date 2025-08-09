/* eslint-disable @typescript-eslint/no-explicit-any */
export default function DataView(props: any) {
    const { nodeData } = props
    return (<>
        DataView
        { nodeData && <div className="card data-view" >
            <div className="card-title">
                {nodeData.title}
            </div>
            <div className="card-body">
                {nodeData.label}
                {nodeData.html}
                {JSON.stringify(nodeData.data)}
            </div>
        </div>}
    </>)
}
