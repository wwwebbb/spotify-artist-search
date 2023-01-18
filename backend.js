const PORT = 8000;
const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());

const CLIENT_ID = 'c9953195c28346428f286190d79205bb';
const CLIENT_SECRET = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;

const btoa = (str) => {
  return Buffer.from(str).toString('base64');
};

app.get('/token', async (req, res) => {
  try {
    const authHeader = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
    const result = await axios.post(
      'https://accounts.spotify.com/api/token',
      'grant_type=client_credentials',
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${authHeader}`,
        },
      }
    );
    res.json(result.data);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.listen(8000, () => console.log(`Server is running on port ${PORT}`));
