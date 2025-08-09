interface DataPoint {
  inputs: number[]
  target: number[]
}

function getRandomNumber (min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
export default function generateDataset (type: string, size: number, min: number, max: number): DataPoint[] {
  function generateDivisionDataset (size: number, min: number, max: number): DataPoint[] {
    const dataset: DataPoint[] = []

    for (let i = 0; i < size; i++) {
      const dividend = getRandomNumber(min, max)
      let divisor = getRandomNumber(min, max)

      // Avoid division by zero
      while (divisor === 0) {
        divisor = getRandomNumber(min, max)
      }

      const quotient = dividend / divisor

      dataset.push({
        inputs: [dividend, divisor],
        target: [quotient]
      })
    }

    return dataset
  }

  function generateMultiplicationDataset (size: number, min: number, max: number): DataPoint[] {
    const dataset: DataPoint[] = []

    for (let i = 0; i < size; i++) {
      const factor1 = getRandomNumber(min, max)
      const factor2 = getRandomNumber(min, max)

      const product = factor1 * factor2

      dataset.push({
        inputs: [factor1, factor2],
        target: [product]
      })
    }

    return dataset
  }
  function generateAdditionDataset (size: number, min: number, max: number): DataPoint[] {
    const dataset: DataPoint[] = []

    for (let i = 0; i < size; i++) {
      const addend1 = getRandomNumber(min, max)
      const addend2 = getRandomNumber(min, max)
      const sum = addend1 + addend2

      dataset.push({
        inputs: [addend1, addend2],
        target: [sum]
      })
    }

    return dataset
  }

  function generateSubtractionDataset (size: number, min: number, max: number): DataPoint[] {
    const dataset: DataPoint[] = []

    for (let i = 0; i < size; i++) {
      const minuend = getRandomNumber(min, max)
      const subtrahend = getRandomNumber(min, max)
      const difference = minuend - subtrahend

      dataset.push({
        inputs: [minuend, subtrahend],
        target: [difference]
      })
    }

    return dataset
  }
  switch (type) {
    case 'division':
      return generateDivisionDataset(size, min, max)
    //   break
    case 'multiplication':
      return generateMultiplicationDataset(size, min, max)
    //   break
    case 'subtraction':
      return generateSubtractionDataset(size, min, max)
    //   break
    default:
      return generateAdditionDataset(size, min, max)
    //   break
  }
}
