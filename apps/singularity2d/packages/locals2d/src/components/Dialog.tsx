export default function Dialog() {
    return (<div className="container">
        <dialog>
            <div className="input-group">
                <button id="connect" className="btn btn-success btn-sm">Connect</button>
                <input type="file" placeholder="url" className="form-control form-control-sm" id="fileSelect" />
                <input type="file" placeholder="address" className="form-control form-control-sm" id="fileElem" />
            </div>
        </dialog>
        <dialog id="wallet-dialog">
            <section className="container">
                <h1>Vault 2D</h1>
                <div id="qrcode"></div>
                <div className="input-group">
                    <button id="connect" className="btn btn-success btn-sm">Connect</button>
                    <input type="text" placeholder="url" className="form-control form-control-sm" id="host-url" />
                    <input type="text" placeholder="address" className="form-control form-control-sm" id="host-address" />
                </div>
                <div id="wallet-graph"></div>
                <button id="create" className="btn btn-warning btn-sm">Create</button>
                <input type="text" placeholder="ExtendedKey" className="form-control form-control-sm" id="key" />
                <button id="register" className="btn btn-success btn-sm">Register</button>
                <button id="activate" className="btn btn-primary btn-sm">Activate</button>
            </section>
            <button className="btn btn-danger m-2" type="button" onClick={() => { (document.getElementById('wallet-dialog') as HTMLDialogElement)?.close() }}>Close</button>
        </dialog>
        <dialog id="login-dialog">
            <section id="login" className='container'>
                <div id="qrcode">
                    <img src="src/images/http.wallet.png" id="get-qrcode"></img>
                </div>
                <hr />
                <button id='createWalletBtn' className='btn btn-primary'>Create Wallet</button>
            </section>
        </dialog>
        <dialog id="sign-dialog">
            <section id="sign" className='container' style={{ display: "flex", flexDirection: "column" }}>
                <textarea className="form-control" defaultValue={"Ethers.js Operations"}></textarea>
                <div className='btn-group'>
                    <button id='signMessageBtn' className='btn btn-secondary'>Sign Message</button>
                    <button id='verifyMessageBtn' className='btn btn-success'>Verify Message</button>
                </div>
            </section>
        </dialog>
    </div>)
}