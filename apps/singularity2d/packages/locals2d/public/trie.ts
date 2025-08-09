class TrieNode {
  children: { [key: string]: TrieNode };
  isEndOfWord: boolean;
  data: any;

  constructor() {
    this.children = {};
    this.isEndOfWord = false;
    this.data = null;
  }
}

class Trie {
  root: TrieNode;

  constructor() {
    this.root = new TrieNode();
  }

  // Async search function with generator-like behavior
  async *searchAsync(path: string, onStep: (pathSegment: string) => Promise<boolean>): AsyncGenerator<any> {
    let node = this.root;
    const segments = path.split('/');

    for (let segment of segments) {
      // Perform async action on each step (e.g., encryption, signing, etc.)
      const stepValid = await onStep(segment);
      if (!stepValid) {
        return; // Abort if validation fails
      }

      if (!node.children[segment]) {
        return; // Abort if segment not found
      }
      node = node.children[segment];
    }

    if (node.isEndOfWord) {
      yield node.data; // Return data if path is valid
    }
  }

  async insertAsync(path: string, data: any, onStep: (pathSegment: string) => Promise<void>): Promise<void> {
    let node = this.root;
    const segments = path.split('/');

    for (let segment of segments) {
      // Perform async operation for each step (e.g., encryption, signing)
      await onStep(segment);

      if (!node.children[segment]) {
        node.children[segment] = new TrieNode();
      }
      node = node.children[segment];
    }

    node.isEndOfWord = true;
    node.data = data; // Store the data at the leaf node
  }
}

// Example Usage
const trie = new Trie();

// Async function to handle signing or verification of path segments
async function signSegment(segment: string): Promise<boolean> {
  // Example async action (could be a signature verification or encryption step)
  console.log(`Verifying segment: ${segment}`);
  return segment !== 'invalid'; // Return false if segment is invalid, true otherwise
}

async function encryptSegment(segment: string): Promise<void> {
  console.log(`Encrypting segment: ${segment}`);
  // Example encryption step (no return needed, just an action)
}

// Inserting data with async steps (encryption, signing, etc.)
async function insertData() {
  await trie.insertAsync("m/44'/60'/0'/0/0", "Ethereum Wallet Data", encryptSegment);
}

// Async search with generator to process each step
async function searchData() {
  const searchResult = trie.searchAsync("m/44'/60'/0'/0/0", signSegment);
  for await (const data of searchResult) {
    console.log("Found data:", data);
  }
}

// Example insertion and search
insertData().then(() => {
  searchData();
});