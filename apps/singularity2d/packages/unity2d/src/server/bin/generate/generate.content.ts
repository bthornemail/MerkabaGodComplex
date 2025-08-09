// Uses a constructor to activate node async
// The node builds itself and once completed it becomes an active node with a 1 statuts
export default async function* generateContent(init: Record<string, any>): AsyncGenerator<(description: Record<string, any>) => Promise<void>, Record<string, any>, void> {
    // const protocol = this.protocols[Math.floor(Math.random() * this.protocols.length)];
    const getIdentity = async (data: Record<string, any>) => {
        return;
    }
    yield getIdentity;
    const getClient = async (data: Record<string, any>) => {
        return;
    }
    yield getClient;
    const getConnection = async (data: Record<string, any>) => {
        return;
    }
    yield getConnection;
    const getPeer = async (data: Record<string, any>) => {
        return;
    }
    yield getPeer;
    const getConsumer = async (data: Record<string, any>) => {
        return;
    }
    yield getConsumer;
    const getDelegate = async (data: Record<string, any>) => {
        return;
    }
    yield getDelegate;
    const getEscrow = async (data: Record<string, any>) => {
        return;
    }
    yield getEscrow;
    const getHost = async (data: Record<string, any>) => {
        return;
    }
    yield getHost;
    const getProvider = async (data: Record<string, any>) => {
        return;
    }
    yield getProvider;
    const getSigner = async (data: Record<string, any>) => {
        return;
    }
    yield getSigner;
    const getWorker = async (data: Record<string, any>) => {
        return;
    }
    yield getWorker;
    return {
        record: this.vault.memory.record,
        definitions: this.vault.memory.definitions,
        state: this.vault.memory.state
    }
}