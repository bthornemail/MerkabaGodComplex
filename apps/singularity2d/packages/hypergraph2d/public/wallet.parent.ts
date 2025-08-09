window.addEventListener('message', (event) => {
  if (event.data.type === 'walletCreated') {
    console.log('New Wallet Address:', event.data.address);
  }
});