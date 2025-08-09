
document.getElementById('mint').addEventListener('click', function () {
    const name = prompt("Enter asset name");
    const description = prompt("Enter asset description");
    const value = prompt("Enter asset value in VertCoin");
    // convert prompt inputs into structure to pass to contract function
    var asset = { metadata: { name: name, description: description, value: value } };
    AssetNFT.methods.registerAsset(asset).send({ from: ethereum.selectedAddress });
});

AssetNFT.events.AssetRegistered({}, function (error, event) {
    console.log(event);
});

AssetNFT.methods.getAssetDetails().call()
    .then(function (assets) {
        document.getElementById('assets').innerHTML = JSON.stringify(assets);
    });