/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";


export default function useDataMap(history: Map<string,Map<string,string | number>>) {
    const [record, setRecord] = useState<Map<string,Map<string,string | number>>>(history);
    // const graph = {
    //     nodes: nodes ?? record,
    //     edges: edges ?? history
    // };
    return record
}