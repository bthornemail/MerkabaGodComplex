import { harmonize, typedArrayToRay, cosineSimilarity, ZGDEntry } from "./harmonic";

const addInput = document.getElementById("addInput") as HTMLInputElement;
const addBtn = document.getElementById("addBtn") as HTMLButtonElement;
const searchInput = document.getElementById("searchInput") as HTMLInputElement;
const entriesList = document.getElementById("entriesList") as HTMLUListElement;
const exportBtn = document.getElementById("exportBtn") as HTMLButtonElement;
const importFile = document.getElementById("importFile") as HTMLInputElement;

let database: ZGDEntry[] = [];

function renderEntries(filter = "") {
  entriesList.innerHTML = "";
  const queryVector =
    filter.trim() !== ""
      ? typedArrayToRay(new TextEncoder().encode(filter.toUpperCase()))
      : null;

  const scored = database.map((entry) => {
    const sim = queryVector
      ? cosineSimilarity(queryVector, entry.vector)
      : null;
    return { entry, similarity: sim };
  });

  const filtered = scored
    .filter((x) => (filter.trim() === "" ? true : (x.similarity || 0) > 0.1))
    .sort((a, b) => (b.similarity || 0) - (a.similarity || 0));

  for (const { entry, similarity } of filtered) {
    const li = document.createElement("li");
    li.textContent = entry.id;
    if (similarity !== null) {
      const span = document.createElement("span");
      span.textContent = similarity.toFixed(2);
      span.className = "similarity";
      li.appendChild(span);
    }
    entriesList.appendChild(li);
  }
}

function addEntry(text: string) {
  if (!text.trim()) return;
  const hv = harmonize(text);
  const vector = typedArrayToRay(new Uint8Array(hv.buffer));
  const entry: ZGDEntry = {
    id: text,
    buffer: hv.buffer,
    vector,
    metadata: { timestamp: Date.now() },
  };
  database.push(entry);
  renderEntries(searchInput.value);
}

addBtn.onclick = () => {
  addEntry(addInput.value);
  addInput.value = "";
};

searchInput.oninput = () => {
  renderEntries(searchInput.value);
};

exportBtn.onclick = () => {
  const json = JSON.stringify(
    database.map((entry) => ({
      id: entry.id,
      buffer: Array.from(new Uint8Array(entry.buffer)),
      vector: entry.vector,
      metadata: entry.metadata,
    }))
  );
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "zero-graph-db.json";
  a.click();
  URL.revokeObjectURL(url);
};

importFile.onchange = (e) => {
  const files = (e.target as HTMLInputElement).files;
  if (!files || files.length === 0) return;
  const file = files[0];
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const text = reader.result as string;
      const imported = JSON.parse(text);
      for (const item of imported) {
        database.push({
          id: item.id,
          buffer: new Uint8Array(item.buffer).buffer,
          vector: item.vector,
          metadata: item.metadata,
        });
      }
      renderEntries(searchInput.value);
    } catch (err) {
      alert("Failed to load JSON file.");
    }
  };
  reader.readAsText(file);
};

renderEntries();
