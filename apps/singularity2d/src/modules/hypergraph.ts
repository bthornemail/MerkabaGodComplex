import { generatePascalTriangle } from "../bin/pascals.triangle";

export default class HyperGraph {
  generationLogic: number[][] = generatePascalTriangle(7)
  constructor(){}
}