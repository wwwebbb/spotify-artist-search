import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  InputGroup,
  FormControl,
  Button,
  Row,
  Card,
  Container,
} from 'react-bootstrap';
import spotifyLogo from './Spotify_Logo_RGB_Green.png';
import { useState, useEffect } from 'react';

const CLIENT_ID = 'c9953195c28346428f286190d79205bb';
const CLIENT_SECRET = '4b0e4c07581d4d458a350297b1ae9f18';

function App() {
  const [searchInput, setSearchInput] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [albums, setAlbums] = useState([]);

  //run API once so it doesn't refresh every time
  useEffect(() => {
    var authParams = {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`,
    };
    fetch('https://accounts.spotify.com/api/token', authParams)
      .then((result) => result.json())
      .then((data) => setAccessToken(data.access_token));
  }, []);

  //Search function
  async function search() {
    //Get request using search to get artist ID
    var searchParams = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + accessToken,
      },
    };

    var artistID = await fetch(
      `https://api.spotify.com/v1/search?q=${searchInput}&type=artist`,
      searchParams
    )
      .then((response) => response.json())
      .then((data) => {
        return data.artists.items[0].id;
      });

    //Get request with artist ID to grab all the albums from that artist
    await fetch(
      `https://api.spotify.com/v1/artists/${artistID}/albums?include_groups=album&market=US&limit=50`,
      searchParams
    )
      .then((response) => response.json())
      .then((data) => {
        setAlbums(data.items);
      });

    //Display those albums to the user
  }
  return (
    <div className="App">
      <Container className="mt-3">
        <img
          src={spotifyLogo}
          alt="Spotify Logo"
          style={{ height: '50px', width: '200px', objectFit: 'contain' }}
        />
        <InputGroup className="mb-3 mt-3" size="lg">
          <FormControl
            placeholder="Search for Artist"
            type="input"
            onKeyDown={(event) => {
              if (event.key === 'Enter') search();
            }}
            onChange={(event) => setSearchInput(event.target.value)}
          />
          <Button onClick={search}>Search</Button>
        </InputGroup>
      </Container>
      <Container>
        <Row className="mx-4 row">
          {albums.map((album, i) => {
            return (
              <Card className="mb-3 col-sm-12 col-md-4 col-lg-3">
                <a
                  href={album.external_urls.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Card.Img src={album.images[0].url} />
                </a>
                <Card.Body>
                  <Card.Title>{album.name}</Card.Title>
                </Card.Body>
              </Card>
            );
          })}
        </Row>
      </Container>
    </div>
  );
}

export default App;
