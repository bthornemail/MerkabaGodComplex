import { Contract } from "ethers";

export interface ServiceNFTContract extends Contract {
  totalSupply(): Promise<number>;
  tokenByIndex(index: number): Promise<string>;
  services(token: string): Promise<[string, string, string]>;
}
