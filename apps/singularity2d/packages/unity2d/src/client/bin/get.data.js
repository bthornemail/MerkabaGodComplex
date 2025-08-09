// Example POST method implementation:
async function getData(url = "", data = {}) {
  // Default options are marked with *
  const response = await fetch(url);
  return response.json(); // parses JSON response into native JavaScript objects
}
