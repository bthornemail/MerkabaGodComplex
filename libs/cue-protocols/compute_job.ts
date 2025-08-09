/**
 * This is the high-level code that clients compile into a secure WASM binary.
 * This function will be executed by a Compute Provider inside a secure sandbox.
 * It sums an array of 32-bit integers.
 */
export function sum(arr: Int32Array): i32 {
  let total: i32 = 0;
  for (let i = 0; i < arr.length; i++) {
    total += arr[i];
  }
  return total;
}