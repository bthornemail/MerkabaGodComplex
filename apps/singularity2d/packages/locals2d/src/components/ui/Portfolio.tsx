import { HDNodeWallet } from 'ethers';
import logo from '../../assets/react.svg'
import { SchemaEditorForm } from './SchemaEditorForm';
import { SchemaInspector } from './SchemaInspector';
import { exampleData } from '../../assets/exampleData';
export type PORTOFOLIO_ATTRIBUTES = {
    query: string;
    rows: number;
    cols: number;
    isScrollable?: boolean;
}
function ScrollableButton() {
    return <div className='btn btn-goup'>
        <button type="button" className="btn btn-outline-primary category-button">Left</button>
        <button type="button" className="btn btn-outline-primary category-button">Right</button>
    </div>
}
export default function Portfolio({ query, rows, cols, isScrollable }: PORTOFOLIO_ATTRIBUTES = { query: "categories", rows: 4, cols: 4, isScrollable: false }) {
    const {
        entity,
        identity,
        data,
        description,
        details,
        definitions,
    } = exampleData
    return <section id="category-section card">
        <div className="category card-header">
            <div className="category card-title">Title</div>
            <div className="category card-summary">Summary</div>
            {!isScrollable ? <button type="button" className="btn btn-outline-primary category-button">View</button> : <ScrollableButton />}
        </div>
        <div className="category-grid card-body" style={{
            display: "grid", gridTemplateColumns: `repeat(${cols},1fr)`, gridTemplateRows: `repeat(${rows},1fr)`
        }}>
            <div className="category card">
                <div className="category card-title">Title</div>
                <div className="category card-summary">Summary</div>
                <img className="category card-image" src={logo} alt="IMage" />
            </div>
        </div>
        <SchemaEditorForm onChange={(field: string, value: any) => { console.log(field, value) }} onSubmit={() => { }} key={HDNodeWallet.createRandom().address} entity={entity} identity={identity} data={data} definitions={definitions} description={description} details={details} />
        <SchemaInspector entity={entity} identity={identity} data={data} definitions={definitions} description={description} details={details} />
    </section>
}