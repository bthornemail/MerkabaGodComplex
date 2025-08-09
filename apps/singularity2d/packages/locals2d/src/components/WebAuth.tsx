import { useRef, useState, useEffect } from 'react';
import { startRegistration 
    ,startAuthentication
    ,browserSupportsWebAuthn
} from '@simplewebauthn/browser';

export function WebAuthNClientRegistration({elemSuccess,elemError}: any) {
    //   const startRegistration = useRef();
    const elemBegin = useRef<any>(null);
    const [registrationOptions, setRegistrationOptions] = useState();

    // Start registration when the user clicks a button
    async function onStartRegistration() {
        // Reset success/error messages
        elemSuccess.current.innerHTML = '';
        elemError.current.innerHTML = '';

        // GET registration options from the endpoint that calls
        // @simplewebauthn/server -> generateRegistrationOptions()
        const resp = await fetch('/generate-registration-options');
        const optionsJSON = await resp.json();

        let attResp;
        try {
            // Pass the options to the authenticator and wait for a response
            attResp = await startRegistration({ optionsJSON });
        } catch (error: any) {
            // Some basic error handling
            if (error.name === 'InvalidStateError') {
                elemError.current.innerText = 'Error: Authenticator was probably already registered by user';
            } else {
                elemError.current.innerText = error;
            }

            throw error;
        }

        // POST the response to the endpoint that calls
        // @simplewebauthn/server -> verifyRegistrationResponse()
        const verificationResp = await fetch('/verify-registration', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(attResp),
        });

        // Wait for the results of verification
        const verificationJSON = await verificationResp.json();

        // Show UI appropriate for the `verified` status
        if (verificationJSON && verificationJSON.verified) {
            elemSuccess.current.innerHTML = 'Success!';
        } else {
            elemError.current.innerHTML = `Oh no, something went wrong! Response: <pre>${JSON.stringify(
                verificationJSON,
            )}</pre>`;
        }
    }
    return (<div>
        <button ref={elemBegin}>Register</button>
        <span ref={elemSuccess}></span>
        <span ref={elemError}></span>
    </div>)
}
export function WebAuthNClientAuthentication({elemSuccess,elemError}: any) {
    //   const startRegistration = useRef();
    const elemBegin = useRef<any>(null);
    const [registrationOptions, setRegistrationOptions] = useState();

    // Start registration when the user clicks a button
    async function onStartAuthentication() {
        // Reset success/error messages
        elemSuccess.current.innerHTML = '';
        elemError.current.innerHTML = '';


    // GET authentication options from the endpoint that calls
    // @simplewebauthn/server -> generateAuthenticationOptions()
    const resp = await fetch('/generate-authentication-options');
    const optionsJSON = await resp.json();

    let asseResp;
    try {
      // Pass the options to the authenticator and wait for a response
      asseResp = await startAuthentication({ optionsJSON, useBrowserAutofill: true,
        // verifyBrowserAutofillInput: false
     });
    } catch (error) {
      // Some basic error handling
      elemError.current.innerText = error;
      throw error;
    }

    // POST the response to the endpoint that calls
    // @simplewebauthn/server -> verifyAuthenticationResponse()
    const verificationResp = await fetch('/verify-authentication', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(asseResp),
    });

    // Wait for the results of verification
    const verificationJSON = await verificationResp.json();

    // Show UI appropriate for the `verified` status
    if (verificationJSON && verificationJSON.verified) {
      elemSuccess.current.innerHTML = 'Success!';
    } else {
      elemError.current.innerHTML = `Oh no, something went wrong! Response: <pre>${JSON.stringify(
        verificationJSON,
      )}</pre>`;
    }
    }
    return (<div>
        <label htmlFor="username">Username</label>
        <input type="text" name="username" autoComplete="username webauthn"/>
        <button ref={elemBegin}>Authenticate</button>
        <span ref={elemSuccess}></span>
        <span ref={elemError}></span>
    </div>)
}
export default function WebAuthN() {
    //   const startRegistration = useRef();
    const elemBegin = useRef<any>(null);
    const elemSuccess = useRef<any>(null);
    const elemError = useRef<any>(null);
    const [isSupported, setIsSupported] = useState(browserSupportsWebAuthn());

    useEffect(()=>{
        if (!isSupported) {
            elemBegin.current.display = 'none';
            elemError.current.innerText = 'It seems this browser does not support WebAuthn...';
            return;
          }
    },[])
    return (<div>
        <label htmlFor="username">Username</label>
        <input type="text" name="username" autoComplete="username webauthn"/>
        <WebAuthNClientRegistration elemSuccess={elemSuccess} elemError={elemError} />
        <WebAuthNClientAuthentication elemSuccess={elemSuccess} elemError={elemError} />
    </div>)
}