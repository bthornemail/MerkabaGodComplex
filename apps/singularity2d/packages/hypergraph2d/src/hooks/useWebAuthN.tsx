import { useState, useEffect, useCallback } from "react";
import { id } from 'ethers';

interface PublicKeyCredentialCreationOptionsJSON {
  challenge: string;
  rp: {
    name: string;
    id?: string;
  };
  user: {
    id: string;
    name: string;
    displayName: string;
  };
  pubKeyCredParams: Array<{
    type: 'public-key';
    alg: number;
  }>;
  timeout?: number;
  attestation?: 'direct' | 'indirect' | 'none';
  excludeCredentials?: Array<{
    type: 'public-key';
    id: string;
  }>;
  authenticatorSelection?: {
    authenticatorAttachment?: 'platform' | 'cross-platform';
    requireResidentKey?: boolean;
    userVerification?: 'required' | 'preferred' | 'discouraged';
  };
}

interface PublicKeyCredentialRequestOptionsJSON {
  challenge: string;
  timeout?: number;
  rpId?: string;
  allowCredentials?: Array<{
    type: 'public-key';
    id: string;
    transports?: Array<'usb' | 'nfc' | 'ble' | 'internal'>;
  }>;
  userVerification?: 'required' | 'preferred' | 'discouraged';
}

export const useWebAuthn = (entity: string = '', identity: string = '') => {
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'registering' | 'authenticating' | 'success' | 'error'>('idle');
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [connectionId, setConnectionId] = useState<string | null>(null);

  // Generate a stable connection ID
  const generateConnectionId = useCallback(() => {
    if (!entity || !identity) return null;
    const now = Date.now();
    const input = `${entity}-${identity}-${now}`;
    // Use ethers.utils.id which is more forgiving than sha256 for strings
    return id(input);
  }, [entity, identity]);

  // Initialize WebSocket connection
  useEffect(() => {
    if (!entity || !identity) {
      setError('Entity and identity must be provided');
      return;
    }

    const connId = generateConnectionId();
    if (!connId) {
      setError('Failed to generate connection ID');
      return;
    }
    setConnectionId(connId);

    try {
      const websocket = new WebSocket(`ws://localhost:8000?entity=${encodeURIComponent(entity)}&identity=${encodeURIComponent(identity)}`);
      setWs(websocket);

      return () => {
        websocket.close();
      };
    } catch (err) {
      setError('Failed to establish WebSocket connection');
    }
  }, [entity, identity, generateConnectionId]);

  // Convert challenge/base64 to ArrayBuffer
  const bufferDecode = useCallback((value: string) =>
    Uint8Array.from(atob(value), c => c.charCodeAt(0)), []);

  // Convert ArrayBuffer to base64
  const bufferEncode = useCallback((value: ArrayBuffer) =>
    btoa(String.fromCharCode(...new Uint8Array(value))), []);

  const sendWebSocketMessage = useCallback((type: string, payload: any) => {
    if (!ws || !connectionId) return Promise.reject('WebSocket not connected');
    
    return new Promise((resolve, reject) => {
      const messageId = Math.random().toString(36).substring(2, 9);
      
      const handleMessage = (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data);
          if (data.messageId === messageId) {
            ws.removeEventListener('message', handleMessage);
            if (data.error) {
              reject(data.error);
            } else {
              resolve(data.payload);
            }
          }
        } catch (err) {
          reject('Invalid server response');
        }
      };
      
      ws.addEventListener('message', handleMessage);
      
      ws.send(JSON.stringify({
        type,
        messageId,
        payload,
        connectionId
      }));
    });
  }, [ws, connectionId]);

  const register = useCallback(async () => {
    try {
      if (!connectionId) {
        throw new Error('Not connected to server');
      }

      setStatus('registering');
      setError(null);

      // Request registration options from server
      const optionsFromServer = await sendWebSocketMessage(
        'webauthn-register-request',
        { entity, identity }
      ) as PublicKeyCredentialCreationOptionsJSON;

      if (!optionsFromServer) {
        throw new Error('Failed to get registration options from server');
      }

      // Convert options for browser API
      const publicKey: PublicKeyCredentialCreationOptions = {
        ...optionsFromServer,
        challenge: bufferDecode(optionsFromServer.challenge),
        user: {
          ...optionsFromServer.user,
          id: bufferDecode(optionsFromServer.user.id)
        }
      };

      // Create credential
      const credential = await navigator.credentials.create({ publicKey }) as PublicKeyCredential;
      
      if (!credential) {
        throw new Error('Credential creation failed');
      }

      const attestationResponse = credential.response as AuthenticatorAttestationResponse;

      // Prepare response for server
      const registrationResponse = {
        id: credential.id,
        rawId: bufferEncode(credential.rawId),
        type: credential.type,
        response: {
          attestationObject: bufferEncode(attestationResponse.attestationObject),
          clientDataJSON: bufferEncode(attestationResponse.clientDataJSON)
        }
      };

      // Send response to server
      const verificationResult = await sendWebSocketMessage(
        'webauthn-register-response',
        registrationResponse
      );

      if (!verificationResult?.success) {
        throw new Error(verificationResult?.error || 'Registration verification failed');
      }

      setStatus('success');
      return credential;
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Registration failed');
      setStatus('error');
      return null;
    }
  }, [bufferDecode, bufferEncode, entity, identity, sendWebSocketMessage, connectionId]);

  const authenticate = useCallback(async () => {
    try {
      if (!connectionId) {
        throw new Error('Not connected to server');
      }

      setStatus('authenticating');
      setError(null);

      // Request authentication options from server
      const optionsFromServer = await sendWebSocketMessage(
        'webauthn-authenticate-request',
        { entity, identity }
      ) as PublicKeyCredentialRequestOptionsJSON;

      if (!optionsFromServer) {
        throw new Error('Failed to get authentication options from server');
      }

      // Convert options for browser API
      const publicKey: PublicKeyCredentialRequestOptions = {
        ...optionsFromServer,
        challenge: bufferDecode(optionsFromServer.challenge),
        allowCredentials: optionsFromServer.allowCredentials?.map(cred => ({
          ...cred,
          id: bufferDecode(cred.id)
        }))
      };

      // Get assertion
      const assertion = await navigator.credentials.get({ publicKey }) as PublicKeyCredential;
      
      if (!assertion) {
        throw new Error('Authentication failed');
      }

      const assertionResponse = assertion.response as AuthenticatorAssertionResponse;

      // Prepare response for server
      const authenticationResponse = {
        id: assertion.id,
        rawId: bufferEncode(assertion.rawId),
        type: assertion.type,
        response: {
          authenticatorData: bufferEncode(assertionResponse.authenticatorData),
          clientDataJSON: bufferEncode(assertionResponse.clientDataJSON),
          signature: bufferEncode(assertionResponse.signature),
          userHandle: assertionResponse.userHandle ? bufferEncode(assertionResponse.userHandle) : null
        }
      };

      // Send response to server
      const verificationResult = await sendWebSocketMessage(
        'webauthn-authenticate-response',
        authenticationResponse
      );

      if (!verificationResult?.success) {
        throw new Error(verificationResult?.error || 'Authentication verification failed');
      }

      setStatus('success');
      return assertion;
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Authentication failed');
      setStatus('error');
      return null;
    }
  }, [bufferDecode, bufferEncode, entity, identity, sendWebSocketMessage, connectionId]);

  return { register, authenticate, status, error, ws };
};