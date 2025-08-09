<iframe
  sandbox="allow-scripts"
  style="border: 0; width: 100%; height: 500px;"
  srcdoc="
<!DOCTYPE html>
<html lang='en'>
<head>
  <meta charset='UTF-8'>
  <meta name='viewport' content='width=device-width, initial-scale=1.0'>
  <title>Sandboxed Wallet</title>
  <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css'>
  <script src='https://cdn.ethers.io/lib/ethers-5.6.umd.min.js'></script>
  <script src='https://cdn.jsdelivr.net/npm/merkletreejs@0.2.33/lib/index.min.js'></script>
</head>
<body class='p-3'>
  <div class='container'>
    <h2 class='mb-4'>Wallet</h2>
    
    <!-- Ethers.js Section -->
    <h4>Ethers.js Operations</h4>
    <button id='createWalletBtn' class='btn btn-primary'>Create Wallet</button>
    <button id='signMessageBtn' class='btn btn-secondary'>Sign Message</button>
    <button id='verifyMessageBtn' class='btn btn-success'>Verify Message</button>
    <hr>

    <!-- MerkleTree.js Section -->
    <h4>MerkleTree.js Operations</h4>
    <textarea id='merkleProofInput' class='form-control mb-2' rows='3' placeholder='Enter Merkle Proof'></textarea>
    <button id='verifyProofBtn' class='btn btn-primary'>Verify Proof</button>
  </div>

  <script>
    // Ethers.js Example: Create Wallet
    document.getElementById('createWalletBtn').addEventListener('click', async () => {
      const wallet = ethers.Wallet.createRandom();
      parent.postMessage({ type: 'walletCreated', address: wallet.address }, '*');
    });

    // Ethers.js Example: Sign Message
    document.getElementById('signMessageBtn').addEventListener('click', async () => {
      const wallet = ethers.Wallet.createRandom();
      const message = 'Hello, blockchain!';
      const signature = await wallet.signMessage(message);
      parent.postMessage({ type: 'messageSigned', signature }, '*');
    });

    // Ethers.js Example: Verify Message
    document.getElementById('verifyMessageBtn').addEventListener('click', async () => {
      const message = 'Hello, blockchain!';
      const wallet = ethers.Wallet.createRandom();
      const signature = await wallet.signMessage(message);
      const recoveredAddress = ethers.utils.verifyMessage(message, signature);
      parent.postMessage({ type: 'messageVerified', address: recoveredAddress }, '*');
    });

    // MerkleTree.js Example: Verify Proof
    document.getElementById('verifyProofBtn').addEventListener('click', () => {
      const proofInput = document.getElementById('merkleProofInput').value;
      const proof = JSON.parse(proofInput || '[]');
      const tree = new MerkleTree(['a', 'b', 'c'], ethers.utils.keccak256);
      const root = tree.getRoot().toString('hex');
      const isValid = tree.verify(proof, 'a', root);
      parent.postMessage({ type: 'proofVerified', valid: isValid }, '*');
    });
  </script>
</body>
</html>
">
</iframe>