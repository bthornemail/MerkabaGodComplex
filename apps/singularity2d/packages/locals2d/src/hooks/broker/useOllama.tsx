import { createContext, useEffect, useRef, useState } from "react"
import ollama, { Ollama } from "ollama"
import defaultModels from "../../assets/default.models";
export const OllamaContext = createContext<{
  readonly isConnected: boolean;
  readonly subscriptions: Map<string, Set<string>>;
  readonly connections: Map<string, any>;
  readonly topic: string | null;
  readonly message: string | null;
  readonly connect: (url: string, key?: string) => Promise<void>;
  readonly register: (topic: string, callback: (...params: any[]) => Promise<any>) => void;
  readonly publish: (topic: string, message: string) => void;
  readonly subscribe: (topic: string) => void;
} & any>(null);

// 3. Provider Component
export const OllamaProvider = ({ children }: any) => {
  const contextValues = useOllama(); // Use the custom hook here

  return (
    <OllamaContext.Provider value={contextValues}>
      {children}
    </OllamaContext.Provider>
  );
};
export const useOllama = (options?: any) => { //: UseOllamaProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [models, setModels] = useState(defaultModels);
  const [model, setModel] = useState("llama3.2:1b");

  async function generate(jsonData: any, interfaceDef: string) {
    // if (!models.has(model)) throw new Error("");
    console.log(jsonData,interfaceDef)
    const { prompt, system } = models.get(model) ?? models.get("root")!;
    console.log(prompt, system)
    const response = await ollama.generate({
      model,
      prompt: prompt(jsonData, interfaceDef),
      stream: false,
      system: system
    });
    console.log(response)
    return response.response
  }
  return { generate } as const
}
