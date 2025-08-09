export default async function generateHMAC(secret: string, username: string): Promise<string> {     // Generate HMAC for TURN credentials
  const encoder = new TextEncoder();
  const secretKeyData = encoder.encode(secret);
  const messageData = encoder.encode(username);

  const key = await crypto.subtle.importKey(
    'raw',
    secretKeyData,
    { name: 'HMAC', hash: { name: 'SHA-1' } },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', key, messageData);
  return btoa(String.fromCharCode(...new Uint8Array(signature)));
}