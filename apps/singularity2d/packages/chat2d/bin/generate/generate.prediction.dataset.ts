interface DataPoint {
  inputs: number[]
  target: number[]
}

function getRandomNumber (min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
export default function generatePredictionDataset (size: number, min: number, max: number): DataPoint[] {
  const predictionDataset: DataPoint[] = []
  for (let i = 0; i < size; i++) {
    const factor1 = getRandomNumber(min, max)
    const factor2 = getRandomNumber(min, max)

    const product = factor1 * factor2

    predictionDataset.push({
      inputs: [factor1, factor2],
      target: [product]
    })
  }

  return predictionDataset
}
