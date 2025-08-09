import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
// import { v4 as uuidv4 } from 'uuid';

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// In-memory storage for users and challenges (replace with a database in production)
const users: any[] = [];
const challenges: { [key: string]: string } = {};
app.use("/", express.static("public"));
// Registration Endpoints
app.post('/generate-registration-options', (req, res) => {
  const userId = crypto.getRandomValues(new Uint8Array(32));
  const username = req.body.username;

  const challenge = crypto.getRandomValues(new Uint8Array(32));

  const options = {
    challenge: Array.from(challenge),
    rp: {
      name: 'WebAuthn Example',
      id: 'localhost',
    },
    user: {
      id: userId,
      name: username,
      displayName: username,
    },
    pubKeyCredParams: [
      { type: 'public-key', alg: -7 }, // ES256
      { type: 'public-key', alg: -257 }, // RS256
    ],
    authenticatorSelection: {
      userVerification: 'preferred',
    },
    timeout: 60000,
    attestation: 'none',
  };

  challenges[ String.fromCharCode(...userId  )] = Buffer.from(challenge).toString('base64');
  // challenges[ userId.toString()] = Buffer.from(challenge).toString('base64');

  users.push({ id: userId, username, authenticators: [] });

  console.log('Registered user:', { userId, username }); // Log the user
  console.log('Users:', users); // Log all users

  res.json(options);
});

app.post('/verify-registration', (req, res) => {
  const { body } = req;

  // Convert the userId from an array of numbers to a string
  const userId = String.fromCharCode(...body.userId);

  console.log(new TextDecoder().decode(new Uint8Array(body.userId)));
  const user = users.find((u) => u.id === userId);

  if (!user) {
    console.error('User not found:', userId); // Log the missing user
    return res.status(404).json({ error: 'User not found' });
  }

  // Verify the registration response
  if (body.id && body.rawId && body.response) {
    user.authenticators.push({
      credentialID: body.id,
      publicKey: body.response.publicKey,
    });
    delete challenges[user.id];
    res.json({ verified: true });
  } else {
    res.status(400).json({ error: 'Verification failed' });
  }
});

app.post('/generate-authentication-options', (req, res) => {
  const username = req.body.username;
  const user = users.find((u) => u.username === username);

  if (!user) {
    console.error('User not found:', username); // Log the missing user
    return res.status(404).json({ error: 'User not found' });
  }

  const options = {
    challenge: Array.from(crypto.getRandomValues(new Uint8Array(32))),
    allowCredentials: user.authenticators.map((auth: any) => ({
      id: auth.credentialID,
      type: 'public-key',
    })),
    userVerification: 'preferred',
    timeout: 60000,
  };

  challenges[user.id] = Buffer.from(options.challenge).toString('base64');

  console.log('Authentication options for user:', { userId: user.id, username }); // Log the user
  res.json(options);
});

app.post('/verify-authentication', (req, res) => {
  const { body } = req;
  console.log(body.userid)
  const user = users.find((u) => u.id === body.userId);
  console.error('User not found:', req.body); // Log the missing user

  if (!user) {
    console.error('User not found:', body.userId); // Log the missing user
    return res.status(404).json({ error: 'User not found' });
  }

  // Verify the authentication response
  if (body.id && body.rawId && body.response) {
    delete challenges[user.id];
    res.json({ verified: true });
  } else {
    res.status(400).json({ error: 'Verification failed' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});