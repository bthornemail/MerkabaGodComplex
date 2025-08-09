/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback, useRef } from "react";
import { Container, Row, Col, FormControl, FormLabel, Image, Button } from "react-bootstrap";
import JournalCard, { JournalCardTitle } from "./components/JournalCard";
import "easymde/dist/easymde.min.css";
import { HDNodeWallet, sha256 } from "ethers";
import frontMatter from "front-matter";
import { MerkleTree } from 'merkletreejs'
import Graphology from "graphology";
import useIO from "./bin/useIO";
import Folder from "./components/Folder";
export type Block = {
  hash: string;
  timestamp: string;
  previousHash: string;
  link?: string;
  data?: string | Uint8Array;
}
export type MATTER = {
  attributes: MATTER_ATTRIBUTES;
  body: string;
  frontmatter?: string;
}

export type MATTER_ATTRIBUTES = {
  title: string;
  path: string;
  identity: string;
  startDate: string;
  lastEdit: string;
};
export function formatMD({ attributes, body }: MATTER) {
  return `---
title: "${attributes.title || "New Journal Entry"}"
path: ${attributes.path}
identity: ${attributes.identity}
startDate: "${attributes.startDate}"
lastEdit: "${new Date().toISOString()}"
documents:
- one
- two
assets:
- one
- two
services:
- one
- two
---

${body}`
}
export function generateNewEntry(): MATTER {
  const wallet = HDNodeWallet.createRandom().neuter();
  return {
    body: "Start writing your entry here.",
    attributes: {
      identity: wallet.extendedKey,
      path: wallet.path ?? "/",
      startDate: new Date().toISOString(),
      lastEdit: new Date().toISOString(),
      title: "New Journal Entry",
    }
  };
}
const LOCAL_STORAGE_KEY = "journalEntries";
const App = () => {
  const [drawerSize, setDrawerSize] = useState("200px");
  const { input } = useIO("new-entry", console.log);
  // const [entries, setEntries] = useState<string[]>([generateNewEntry()]);
  const [focused, setFocused] = useState("");
  const [tree, setTree] = useState<MerkleTree>(new MerkleTree([], sha256));
  const [entries, setEntries] = useState<string[]>(() => {
    // Load entries from localStorage or create a new entry if none exist
    const savedEntries = localStorage.getItem(LOCAL_STORAGE_KEY);
    const entries = savedEntries ? JSON.parse(savedEntries) : [formatMD(generateNewEntry())]
    entries.forEach((entry) => input(entry))
    return entries;
  });
  useEffect(() => {
    // Auto-save entries to localStorage whenever they change
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  const handleAddEntry = () => {
    setEntries((prevEntries) => {
      const newEntry: string = formatMD(generateNewEntry());
      input(newEntry);
      return [newEntry, ...prevEntries]
    });
  };
  const handleExport = () => {
    const graph = new Graphology<MATTER_ATTRIBUTES, any, { root: string, extendedKey: string, signature: string }>();
    const leaves: string[] = [];

    entries.forEach((entry) => {
      const parsed = frontMatter(entry) as MATTER;
      graph.addNode(sha256(new TextEncoder().encode(formatMD(parsed))), parsed.attributes);
      leaves.push(formatMD(parsed));
    });

    const binaryLeaves = leaves.map(x => sha256(new TextEncoder().encode(x)));
    const tree = new MerkleTree(binaryLeaves, sha256);
    setTree(tree);

    const root = tree.getRoot().toString('hex');
    graph.setAttribute("root", root);
    graph.setAttribute("extendedKey", HDNodeWallet.fromPhrase("arrow core arrange note hire decorate wonder situate story faith catch cram").neuter().extendedKey);
    graph.setAttribute("signature", HDNodeWallet.fromPhrase("arrow core arrange note hire decorate wonder situate story faith catch cram").signMessageSync(root));

    // Convert the graph data to JSON and create a Blob
    const exportData = JSON.stringify({ graph: graph.export(), entries });
    const blob = new Blob([exportData], { type: 'application/json' });

    // Create a download link for the Blob
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `export-${new Date().toISOString()}.json`; // Naming the file with a timestamp
    document.body.appendChild(link); // Required for Firefox
    link.click();
    document.body.removeChild(link);

    // Cleanup the object URL after download
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);

        // Check if imported data has the correct structure
        if (importedData.entries && Array.isArray(importedData.entries)) {
          setEntries(importedData.entries);  // Update the entries state
        }
        // Optionally update the Merkle tree
        const binaryLeaves = importedData.entries.map((entry: string) => sha256(new TextEncoder().encode(entry)));
        const tree = new MerkleTree(binaryLeaves, sha256);
        setTree(tree);
        console.log("Merkle Root ", tree.getRoot().toString("hex"))
        console.log("IMported Graph", importedData.graph)
        console.log("IMported Entries ", importedData.entries)
        const graph = new Graphology<MATTER_ATTRIBUTES, any, { root: string, extendedKey: string, signature: string }>();
        graph.import(importedData.graph)
        console.log(graph)
      } catch (error) {
        console.error("Failed to import file:", error);
      }
    };

    reader.readAsText(file);
  };
  // const verifyEntry = (entry: string) => {
  //   // const binaryLeaves = leaves.map(x => sha256(new TextEncoder().encode(x)))
  //   // const tree = new MerkleTree(binaryLeaves, sha256)
  //   const root = tree.getRoot().toString('hex')
  //   const leaf = sha256(new TextEncoder().encode(entry))
  //   const proof = tree.getProof(leaf)
  //   if (!tree.verify(proof, leaf, root)) alert(tree.verify(proof, leaf, root))
  //   return tree.verify(proof, leaf, root);
  // };
  const handleUpdateEntry = (index, updatedContent) => {
    const updatedEntries = [...entries];
    updatedEntries[index] = updatedContent;
    setEntries(updatedEntries);
  };
  const [searchQuery, setSearchQuery] = useState("");
  const searchBar = useRef<HTMLInputElement>(null)
  const filterEntries = useCallback(() => {
    if (searchQuery.trim() !== "") {
      return entries.filter((entry) => {
        const parsedEntry = frontMatter(entry) as MATTER;
        const { title } = parsedEntry.attributes;
        return title.toLowerCase().includes(searchQuery.toLowerCase());
      });
    }
    return entries;
  }, [entries, searchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  return (
    <Container className="py-3">
      <nav>
        <FormLabel>Search</FormLabel>
        <FormControl
          ref={searchBar}
          onChange={handleSearchChange}
          placeholder="Search by title"
          value={searchQuery}
        />
      </nav>
      <main style={{ width: "100%", marginBottom: "3rem", display: "grid", gridTemplateColumns: `${drawerSize} 100%` }}>
        <section style={{ marginBottom: "3rem" }}>
          <Folder setDrawerSize={setDrawerSize} drawerSize={drawerSize} />
        </section>
        <section style={{ marginBottom: "3rem" }}>
          {filterEntries().map((entry, index) => (
            <Row key={index}>
              <Col>
                <JournalCard
                  // verify={verifyEntry}
                  content={entry}
                  onUpdate={(updatedContent) => handleUpdateEntry(index, updatedContent)}
                  focused={focused}
                  setFocused={setFocused}
                />
              </Col>
            </Row>
          ))}

          {filterEntries().length === 0 ? <div>
            <h1>{searchBar.current?.value}</h1>
            <Button>create</Button>
          </div> : <></>}
        </section>
      </main>
      <footer className="fixed-bottom bg-light p-2 text-center" style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: "0.5" }}>
        <div style={{ minWidth: "fit-content" }}>

          <input
            id="import-file-button"
            type="file"
            accept="application/json"
            onChange={handleImport}
            style={{ display: "none" }}
          />
          <Image onClick={() => document.getElementById('import-file-button')?.click()} src="src/img/archive-svgrepo-com (1).svg" width={36} />
          <Image onClick={handleExport} src="/src/img/archive-svgrepo-com.svg" width={36} />
        </div>
        <div style={{ overflowX: "auto", display: "flex" }}>
          {entries.map((entry, index) => (
            <JournalCardTitle
              key={index}
              content={entry}
              setFocused={setFocused}
            />
          ))}
        </div>
        <Image onClick={handleAddEntry} src="src/img/file-svgrepo-com (2).svg" width={36} />
      </footer>
    </Container>
  );
};

export default App;
