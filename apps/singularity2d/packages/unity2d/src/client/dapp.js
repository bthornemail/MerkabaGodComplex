// Listen for wallet initialization
window.addEventListener('message', (event) => {
  console.log(event.origin, 'event from your-parent-origin');
  if (event.origin !== location.origin) return;

  const { type, payload } = event.data;

  if (type === 'WALLET_INIT') {
    initializeApp(payload.publicKey);
  }
  // Handle other message types
});

// Example function to request transaction signing
function requestConnectWallet(wallet) {
  window.parent.postMessage({ type: 'CONNECT_WALLET', payload: { wallet } }, '*');
}

// Example function to request transaction signing
function requestSignTransaction(transaction) {
  window.parent.postMessage({ type: 'SIGN_TRANSACTION', payload: { transaction } }, '*');
}

// Example function to request data encryption
function requestEncryptData(data) {
  window.parent.postMessage({ type: 'ENCRYPT_DATA', payload: { data } }, '*');
}

// Listen for signed transaction or encrypted data
window.addEventListener('message', (event) => {
  console.log(event.origin, 'event from your-parent-origin');
  if (event.origin !== location.origin) return;

  const { type, payload } = event.data;

  switch (type) {
    case 'TRANSACTION_SIGNED':
      handleSignedTransaction(payload.signedTransaction);
      break;
    case 'DATA_ENCRYPTED':
      handleEncryptedData(payload.encryptedData);
      break;
    // Handle other message types
  }
});

function initializeApp(publicKey) {
  // Initialize app with wallet public key
  console.log('App initialized with public key:', publicKey);
}

function handleSignedTransaction(signedTransaction) {
  // Process the signed transaction
  console.log('Signed Transaction:', signedTransaction);
}

function handleEncryptedData(encryptedData) {
  // Process the encrypted data
  console.log('Encrypted Data:', encryptedData);
}
