const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();
const createError = require('http-errors');

const app = express();

app.use(
  cors({
    origin: '*',
  })
);

app.get('/', (req, res) => {
  res.send('Server is running!');
});

const CLIENT_ID = 'c9953195c28346428f286190d79205bb';
const CLIENT_SECRET = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;

const btoa = (str) => {
  return Buffer.from(str).toString('base64');
};

app.get('/token', async (req, res, next) => {
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
  } catch (err) {
    console.log(err);
    res.send(err);
    next(err);
  }
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  console.log(err);
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ error: err });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
