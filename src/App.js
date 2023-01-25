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
import axios from 'axios';

function App() {
  const [searchInput, setSearchInput] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [artistName, setArtistName] = useState('');
  const [albums, setAlbums] = useState([]);

  //run API once so it doesn't refresh every time
  useEffect(() => {
    const getAccessToken = async () => {
      try {
        const result = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/token`
        );
        setAccessToken(result.data.access_token);
      } catch (error) {
        console.log(error);
      }
    };
    getAccessToken();
    alert(
      `If the page doesn't load, refresh to activate/awaken the Heroku Eco Dynos request`
    );
  }, []);

  //Search function
  async function search() {
    //Get request using search to get artist ID
    var searchParams = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer  ${accessToken}`,
      },
    };

    var artistID = await fetch(
      `https://api.spotify.com/v1/search?q=${searchInput}&type=artist`,
      searchParams
    )
      .then((response) => response.json())
      .then((data) => {
        setArtistName(data.artists.items[0].name);
        return data.artists.items[0].id;
      })
      .catch((error) => {
        console.log(error);
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
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && searchInput !== '') search();
            }}
          />
          <Button
            onClick={() => {
              if (searchInput !== '') search();
            }}
          >
            Search
          </Button>
        </InputGroup>
      </Container>
      {artistName !== '' && (
        <h2 style={{ margin: '2rem 0' }}>
          Showing albums by <b>{artistName}</b>
        </h2>
      )}
      <Container>
        <Row className="mx-4 gy-4">
          {albums.map((album, i) => {
            return (
              <Card
                key={i}
                className="card-hover p-0 col-sm-12 col-md-4 col-lg-3"
              >
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
      <div className="bg"></div>
    </div>
  );
}

export default App;
