
import { useContext, useEffect } from 'react'
import { Outlet } from 'react-router-dom';
import { MQTTContext } from '../hooks/broker/useMqtt';

export default function Portal() {
    const { entity, identity,
        isConnected, subscribe } = useContext(MQTTContext);
    useEffect(() => {
        if (isConnected) {
            console.log("Ready to broadcast");
            subscribe(entity)
        }
    }, [isConnected]);
    return <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        {isConnected && <div >
            <div>{identity}</div>
        </div>}
        <div>
            <Outlet />
        </div>
    </div>
}
