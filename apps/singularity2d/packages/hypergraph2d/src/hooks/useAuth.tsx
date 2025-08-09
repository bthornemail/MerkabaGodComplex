import { useState } from "react"

export default function useAuthN(){
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<'idle' | 'registering' | 'authenticating' | 'success' | 'error'>('idle')

  // Convert challenge/base64 to ArrayBuffer
  const bufferDecode = (value: string) =>
    Uint8Array.from(atob(value), c => c.charCodeAt(0))

  const register = async (optionsFromServer: PublicKeyCredentialCreationOptionsJSON) => {
    try {
      setStatus('registering')
      setError(null)

      const publicKey: PublicKeyCredentialCreationOptions = {
        ...optionsFromServer,
        challenge: bufferDecode(optionsFromServer.challenge),
        user: {
          ...optionsFromServer.user,
          id: bufferDecode(optionsFromServer.user.id)
        }
      }

      const credential = await navigator.credentials.create({ publicKey }) as PublicKeyCredential
      setStatus('success')
      return credential
    } catch (err) {
      console.error(err)
      setError('Registration failed')
      setStatus('error')
      return null
    }
  }

  const authenticate = async (optionsFromServer: PublicKeyCredentialRequestOptionsJSON) => {
    try {
      setStatus('authenticating')
      setError(null)

      const publicKey: PublicKeyCredentialRequestOptions = {
        ...optionsFromServer,
        challenge: bufferDecode(optionsFromServer.challenge),
        allowCredentials: optionsFromServer.allowCredentials?.map(cred => ({
          ...cred,
          id: bufferDecode(cred.id)
        }))
      }

      const assertion = await navigator.credentials.get({ publicKey }) as PublicKeyCredential
      setStatus('success')
      return assertion
    } catch (err) {
      console.error(err)
      setError('Authentication failed')
      setStatus('error')
      return null
    }
  }
  const create = async ()=>{
    let credential = await navigator.credentials.create({
      publicKey: {
        challenge: new Uint8Array([117, 61, 252, 231, 191, 241 /* … */]),
        rp: { id: "localhost", name: "ACME Corporation" },
        user: {
          id: new Uint8Array([79, 252, 83, 72, 214, 7, 89, 26]),
          name: "jamiedoe",
          displayName: "Jamie Doe",
        },
        pubKeyCredParams: [{ type: "public-key", alg: -7 },{ type: "public-key", alg: -8 },{ type: "public-key", alg: -257 }],
      },
    });
  }
  const auto = () => {
    // sample arguments for registration
    const createCredentialDefaultArgs = {
      publicKey: {
        // Relying Party (a.k.a. - Service):
        rp: { id: "localhost", name: "Univere 2D" },
        // User:
        user: {
          id: new Uint8Array(16),
          name: "contact@bthorne.org",
          displayName: "Brian Thorne",
        },
        pubKeyCredParams: [
          { type: "public-key", alg: -7 },{ type: "public-key", alg: -8 },{ type: "public-key", alg: -257 }
        ],
        attestation: "direct",
        timeout: 60000,
        challenge: new Uint8Array([
          // must be a cryptographically random number sent from a server
          0x8c, 0x0a, 0x26, 0xff, 0x22, 0x91, 0xc1, 0xe9, 0xb9, 0x4e, 0x2e, 0x17,
          0x1a, 0x98, 0x6a, 0x73, 0x71, 0x9d, 0x43, 0x48, 0xd5, 0xa7, 0x6a, 0x15,
          0x7e, 0x38, 0x94, 0x52, 0x77, 0x97, 0x0f, 0xef,
        ]).buffer,
      },
    };

    // sample arguments for login
    const getCredentialDefaultArgs = {
      publicKey: {
        timeout: 60000,
        // allowCredentials: [newCredential] // see below
        challenge: new Uint8Array([
          // must be a cryptographically random number sent from a server
          0x79, 0x50, 0x68, 0x71, 0xda, 0xee, 0xee, 0xb9, 0x94, 0xc3, 0xc2, 0x15,
          0x67, 0x65, 0x26, 0x22, 0xe3, 0xf3, 0xab, 0x3b, 0x78, 0x2e, 0xd5, 0x6f,
          0x81, 0x26, 0xe2, 0xa6, 0x01, 0x7d, 0x74, 0x50,
        ]).buffer,
      },
    };

    // register / create a new credential
    navigator.credentials
      .create(createCredentialDefaultArgs)
      .then((cred) => {
        console.log("NEW CREDENTIAL", cred);
        // normally the credential IDs available for an account would come from a server
        // but we can just copy them from above…
        const idList = [
          {
            id: cred.rawId,
            transports: ["usb", "nfc", "ble"],
            type: "public-key",
          },
        ];
        getCredentialDefaultArgs.publicKey.allowCredentials = idList;
        return navigator.credentials.get(getCredentialDefaultArgs);
      })
      .then((assertion) => {
        console.log("ASSERTION", assertion);
      })
      .catch((err) => {
        console.log("ERROR", err);
      });

  }
  return { auto,create, register, authenticate, status, error }
}
