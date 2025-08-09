const registerForm = document.getElementById('registerForm') as HTMLFormElement;
const loginForm = document.getElementById('loginForm') as HTMLFormElement;

registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = (document.getElementById('registerUsername') as HTMLInputElement).value;

  // Step 1: Get registration options from the server
  const optionsResponse = await fetch('http://localhost:3000/generate-registration-options', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username }),
  });
  const options = await optionsResponse.json();

  console.log('Registration options:', options); // Log the options

  // Convert challenge and user.id to ArrayBuffer
  options.challenge = Uint8Array.from(options.challenge).buffer;
  options.user.id = Uint8Array.from(options.user.id);

  // Step 2: Start WebAuthn registration
  const credential = await navigator.credentials.create({
    publicKey: options,
  });

  console.log('Credential created:', credential); // Log the credential

  // Step 3: Send the credential to the server for verification
  const verificationResponse = await fetch('http://localhost:3000/verify-registration', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: credential?.id,
      rawId: Array.from(new Uint8Array((credential as any).rawId)),
      response: {
        attestationObject: Array.from(new Uint8Array((credential as any).response.attestationObject)),
        clientDataJSON: Array.from(new Uint8Array((credential as any).response.clientDataJSON)),
      },
      userId: Array.from(options.user.id), // Send userId as an array of numbers
    }),
  });
  const verificationResult = await verificationResponse.json();

  console.log('Verification result:', verificationResult); // Log the result

  if (verificationResult.verified) {
    alert('Registration successful!');
  } else {
    alert('Registration failed.');
  }
});

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = (document.getElementById('loginUsername') as HTMLInputElement).value;

  // Step 1: Get authentication options from the server
  const optionsResponse = await fetch('http://localhost:3000/generate-authentication-options', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username }),
  });
  const options = await optionsResponse.json();

  console.log('Authentication options:', options); // Log the options

  // Convert challenge to ArrayBuffer
  options.challenge = Uint8Array.from(options.challenge).buffer;

  // Step 2: Start WebAuthn authentication
  const credential = await navigator.credentials.get({
    publicKey: options,
  });

  console.log('Assertion created:', credential); // Log the assertion

  // Step 3: Send the credential to the server for verification
  const verificationResponse = await fetch('http://localhost:3000/verify-authentication', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: credential?.id,
      rawId: Array.from(new Uint8Array((credential as any).rawId)),
      response: {
        authenticatorData: Array.from(new Uint8Array((credential as any).response.authenticatorData)),
        clientDataJSON: Array.from(new Uint8Array((credential as any).response.clientDataJSON)),
        signature: Array.from(new Uint8Array((credential as any).response.signature)),
      },
      userId: options.userId,
    }),
  });
  const verificationResult = await verificationResponse.json();

  console.log('Verification result:', verificationResult); // Log the result

  if (verificationResult.verified) {
    alert('Login successful!');
  } else {
    alert('Login failed.');
  }
});