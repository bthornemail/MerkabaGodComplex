import express from 'express';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 8080;

// Directory to serve (adjust as needed)
const publicDir = './html';

app.use(express.static(publicDir));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
