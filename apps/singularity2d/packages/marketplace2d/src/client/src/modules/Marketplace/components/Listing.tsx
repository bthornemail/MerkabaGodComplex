import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { CID } from 'multiformats/cid'
export type LISTING = { cid: string, title: string, summary?: string, description?: string, imgSrc?: string }
export default function Listing() {
    const [listing, setListing] = useState()
    const params = useParams()
/*    useEffect(() => {
        (async () => {
            const cid = await dag?.add(params.CID)
            const id = cid?.toString()
            setListing(await dag?.get(CID.parse(id!)))
        })()
    }, [params.CID, dag])*/
    return (<div className="marketplace-listings">
        Listing {params.CID}
        {JSON.stringify(listing)}
    </div>)
}