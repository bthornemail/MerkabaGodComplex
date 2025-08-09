// ComponentGenerator.tsx
import { useState } from "react";
import { useOllama } from "../../hooks/broker/useOllama";
export default function ComponentGenerator() {
  const [json, setJson] = useState("");
  const [interfaceDef, setInterfaceDef] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const {generate} = useOllama();
  async function handleGenerate() {
    setGeneratedCode(await generate(json,interfaceDef));
  }

  function downloadFile() {
    const blob = new Blob([generatedCode], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "GeneratedComponent.tsx";
    link.click();
  }

  return (
    <div className="p-4 space-y-4">
      <textarea
        className="w-full p-2 border rounded"
        rows={5}
        placeholder="Paste JSON data here"
        value={json}
        onChange={(e) => setJson(e.target.value)}
      />
      <textarea
        className="w-full p-2 border rounded"
        rows={5}
        placeholder="Paste TypeScript interface here"
        value={interfaceDef}
        onChange={(e) => setInterfaceDef(e.target.value)}
      />
      <button onClick={handleGenerate} className="bg-blue-500 text-white px-4 py-2 rounded">
        Generate
      </button>
      {generatedCode && (
        <>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">{generatedCode}</pre>
          <button onClick={downloadFile} className="bg-green-500 text-white px-4 py-2 rounded">
            Download Component
          </button>
        </>
      )}
    </div>
  );
}