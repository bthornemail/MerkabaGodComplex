import { HDNodeWallet } from "ethers";
import { useState } from "react";
// import { useWs } from "../hooks/useSocket";

export default function Wallet({ wallet, setWallet }: any) {
    const [newWallet, setNewWallet] = useState<HDNodeWallet>();
    // const {isReady, data, send}  = useWs({ url: `ws://127.0.0.1:8000?entity=${wallet?.address}` }) as any;

    return <form className="wallet form">
        <label htmlFor="phrase" className="form-label">Generate Root Entity</label>
        <button className="btn btn-primary btn-sm" type="button" name="phrase" value={wallet?.privateKey} onClick={() => {
            const newWallet = HDNodeWallet.createRandom();
            setNewWallet(newWallet);
            try {
                const modal = document.querySelector("#wallet-credentials") as HTMLDialogElement;
                modal?.showModal();
                setWallet(newWallet?.neuter());
            } catch (error) {
                alert(error)
            }
        }}>Generate Wallet</button>
        <dialog id="wallet-credentials">
            <div id="wallet-credentials" className="wallet card">
                <div className="wallet card-header">
                    <div className="card-title">New Generated Wallet Credentials</div>
                    <div className="card-subtitle">Please save or write down, as willl only be shown once</div>
                    <sub>(Beware your account has potetial to be unaccessible if not saved)</sub>
                </div>
                <div className="wallet card-body">
                    <small>Private Key</small>
                    <br />
                    <sup>{newWallet?.privateKey && newWallet.privateKey}</sup>
                    <br />
                    <small>Extendex Key</small>
                    <br />
                    <sup>{newWallet?.extendedKey && newWallet.extendedKey}</sup>
                </div>
                <button className="btn btn-danger btn-sm" onClick={() => {
                    const modal = document.querySelector("#wallet-credentials") as HTMLDialogElement;
                    modal?.close();
                }}>Remove</button>
            </div>
        </dialog>
    </form>;
}
