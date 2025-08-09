import { useEffect, useRef } from "react"
import MQTT from "./components/MQTT";

export default function Nav() {

    const dialog = useRef<HTMLDialogElement>(document.createElement('dialog'));
    useEffect(() => {
        const element = document.getElementById('wallet-dialog');
        if (!element) return;
        dialog.current.replaceWith(element);
    }, [])
    return (<nav className="navbar mt-1">
        <MQTT  />
    </nav>)
}