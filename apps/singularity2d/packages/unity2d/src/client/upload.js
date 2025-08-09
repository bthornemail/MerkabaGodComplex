import { decryptKeystoreJson } from './modules/ethers/ethers.min.js';
import { ethers, Wallet, HDNodeWallet, id } from "/modules/ethers/ethers.min.js";
// let wallet = HDNodeWallet.createRandom();
// sessionStorage.clear()

// if (sessionStorage.getItem("extendedKey")) {
//     wallet = HDNodeWallet.fromExtendedKey(sessionStorage.getItem("extendedKey"));
// } else {
//     if (sessionStorage.getItem("mnemonic")) {
//         wallet = HDNodeWallet.fromPhrase(sessionStorage.getItem("mnemonic"));
//     } else {
//         console.log(wallet)
//         sessionStorage.setItem("mnemonic", wallet.mnemonic.phrase);
//     }
// }
let jsonData;
function updateUserData(jsonData, id){
    document.getElementById(id ?? "current-wallet-json").innerHTML = `<section>` + Object.entries(jsonData).reduce((accum, [key, value]) => {
        if (typeof value !== "string") return accum;
        if (key === "address") return accum + `<strong style="font-size:12px;">${key}</strong>
        <small style="font-size:10px;"><a href="/${value}">${value}</a></small>`;
        return accum + `<strong style="font-size:12px;">${key}</strong><small style="font-size:10px;">${value}</small>`
    }, "") + "</section>";
}

document.getElementById('fileInput').addEventListener('change', function (e) {
    const fileInput = e.currentTarget;
    const file = fileInput.files[0];

    const reader = new FileReader();
    reader.onload = function (event) {
        jsonData = event.target.result;
        sessionStorage.setItem("encrypted-wallet-json-data",jsonData);
        updateUserData(jsonData)
    };
    reader.readAsText(file);
});
document.getElementById('uploadButton').addEventListener('click', async function () {
    const passwordInput = document.getElementById('passwordInput');
    const password = passwordInput.value;
    const decryptedData = await decryptKeystoreJson(sessionStorage.getItem("uencrypted-wallet-json-data"), password, console.log);
    if (decryptedData) {
        sessionStorage.setItem('userWallet', JSON.stringify(decryptedData));
        alert('Wallet uploaded and stored in session.');
        document.getElementById("data-dialog").close();
    } else {
        alert('Failed to decrypt wallet. Please check your password.');
    }
});
async function encryptWallet(wallet, e) {
    if (e) {
        const progress = document.createElement("div")
        progress.classList.add("progress")
        const progressBar = document.createElement("div")
        progressBar.classList.add("progress-bar")
        progressBar.setAttribute("aria-valuenow", 0);
        progressBar.setAttribute("aria-valuemin", 0);
        progressBar.setAttribute("aria-valuemax", 100);
        progressBar.setAttribute("role", "progressbar");
        // document.getElementById("wallet-form").setAttribute("hidden", "hidden");
        progress.append(progressBar)
        e.target.append(progress)
        return await wallet.encrypt(document.getElementById("mnemonic-submit-input").value, (status) => {
            progressBar.style.width = `${status * 100}px`
        });
    }
    return wallet.encrypt(document.getElementById("mnemonic-submit-input").value, console.log);
}
document.getElementById("wallet-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log(Array.from(new FormData(e.target).values()))
    // alert(Array.from(new FormData(e.target).values()).join(" "))
    const wallet = HDNodeWallet.fromPhrase(Array.from(new FormData(e.target).values()).join(" "));
    var oQRCode = new QRCode("qr-code", {
        text: wallet.extendedKey,
        width: 128,
        height: 128
    });
    document.getElementById("address").textContent = wallet.address;
    document.getElementById("extendedKey").textContent = wallet.extendedKey;
    document.getElementById("current-address").textContent = wallet.address;
    updateUserData(wallet)
    console.log(wallet)
    const encryptedWallet = await encryptWallet(wallet)
    window.localStorage.setItem("wallet", encryptedWallet);
    sessionStorage.setItem("wallet", encryptedWallet);
    const link = document.getElementById("qr-code-link");

    link.href = URL.createObjectURL(
        new Blob([encryptedWallet], { type: "application/json", endings: "native" }),
    );
    link.download = "encrypted.wallet.json";
    // link.click();
    async function handleClick(e) {
        e.preventDefault();
        updateUserData(JSON.parse(encryptedWallet),"wallet-form")
        document.getElementById("local-address").innerHTML = `<sup>address</sup><br/><small>${JSON.parse(encryptedWallet).address}</small>`;

        oQRCode.clear(); // Clear the QRCode.
        oQRCode.makeCode(wallet.neuter().extendedKey); // Re-create the QRCode.
        document.getElementById("extendedKey").textContent = wallet.neuter().extendedKey;
        link.click();
    }
    // document.getElementById("qr-code").addEventListener("click", handleClick);
    sessionStorage.setItem("extendedKey", wallet.extendedKey);

    e.target.innerHTML = Object.entries(wallet).reduce((accum, [key, value]) => {
        if (key === "mnemonic") { value = value.phrase }
        return accum + `<strong style="font-size:12px;">${key}</strong><small style="font-size:10px;">${value}</small>`
    }, "") + `<div><button id="registration-button" class="btn btn-success">Encrypt</button></div>`

    document.getElementById("registration-button").addEventListener("click", handleClick)
})