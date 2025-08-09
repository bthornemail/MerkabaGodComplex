import { HDNodeWallet } from "ethers";
import { Delegate } from "../../../types/marketplace/delegate";
import EventRegister from "../marketplace/event.register";
// import EventRegister from "../bin/event.register";
// import { Delegate, MyDelegate } from "./delegate"; // Ensure you have the correct import path

interface EscrowTerms {
    amount: number;
    asset: string;
    condition: string;
}

class Escrow {
    private delegate: Delegate;
    private terms: EscrowTerms;
    private isFulfilled: boolean;
    private events: EventRegister;

    constructor(delegate: Delegate, terms: EscrowTerms) {
        this.delegate = delegate;
        this.terms = terms;
        this.isFulfilled = false;
        this.events = new EventRegister();

        this.events.on('escrow:start', (data) => {
            console.log('Escrow process started:', data);
        });
        this.events.on('escrow:complete', (data) => {
            console.log('Escrow process completed:', data);
        });
        this.events.on('escrow:failed', (data) => {
            console.log('Escrow process failed:', data);
        });
    }

    static createWithDelegate(delegate: Delegate, terms: EscrowTerms): Escrow {
        return new Escrow(delegate, terms);
    }

    async startEscrow() {
        this.events.emit('escrow:start', { terms: this.terms });
        
        // Logic to initiate the escrow process (e.g., locking assets)

        this.events.emit('escrow:initiated', { terms: this.terms });
    }

    async fulfillCondition(data: string, sharedSecrets: string[]) {
        try {
            const encryptedData = await this.delegate.encrypt(data, sharedSecrets);
            // Additional logic to fulfill the condition (e.g., validate data)
            
            this.isFulfilled = true;
            this.events.emit('escrow:conditionFulfilled', { data: encryptedData });
        } catch (error) {
            this.events.emit('escrow:failed', { error });
            throw new Error('Failed to fulfill escrow condition');
        }
    }

    async releaseAssets(sharedSecrets: string[]) {
        if (!this.isFulfilled) {
            this.events.emit('escrow:failed', { error: 'Conditions not fulfilled' });
            throw new Error('Conditions not fulfilled');
        }

        try {
            const decryptedData = await this.delegate.decrypt(this.terms.asset, sharedSecrets);
            // Logic to release assets (e.g., transfer funds/assets)

            this.events.emit('escrow:complete', { asset: decryptedData });
        } catch (error) {
            this.events.emit('escrow:failed', { error });
            throw new Error('Failed to release assets');
        }
    }
}

// Usage Example
(async () => {
    const provider = {
        phrase: "upgrade injury switch arrive seek usage car library kangaroo path cute brass"
    };
    const delegate = MyDelegate.createFromPhrase(provider.phrase);

    const terms: EscrowTerms = {
        amount: 1000,
        asset: "example asset",
        condition: "Condition to fulfill"
    };

    const escrow = Escrow.createWithDelegate(delegate, terms);

    await escrow.startEscrow();

    const consumer = {
        extendedKey: HDNodeWallet.fromPhrase("yellow observe attend foster mind recipe chalk entire common fancy degree puppy").extendedKey
    };
    const sharedSecret = delegate.computeSharedSecret(consumer.extendedKey);

    await escrow.fulfillCondition("example data", [sharedSecret]);
    await escrow.releaseAssets([sharedSecret]);
})();
