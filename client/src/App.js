import logo from "./logo.svg";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  InputGroup,
  FormControl,
  Button,
  Row,
  Card,
  Container
} from "react-bootstrap";
import { useState, useEffect } from "react";

const CLIENT_ID = "c9953195c28346428f286190d79205bb";
const CLIENT_SECRET = "4b0e4c07581d4d458a350297b1ae9f18";

function App() {
  const [searchInput, setSearchInput] = useState("");

  //run API once so it doesn't refresh every time
  useEffect(() => {
    var authParams = {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body:
        "grant_type=client_credentials&client_id=" +
        CLIENT_ID +
        "&client_secret" +
        CLIENT_SECRET
    };
    fetch("https://accounts.spotify.com/api/token", authParams)
      .then((result) => result.json())
      .then((data) => console.log(data));
  }, []);

  return (
    <div className="App">
      <Container>
        <InputGroup className="mb-3" size="lg">
          <FormControl
            placeholder="Search for Artist"
            type="input"
            onKeyPress={(event) => {
              if (event.key === "Enter") {
                console.log("Pressed enter");
              }
            }}
            onChange={(event) => setSearchInput(event.target.value)}
          />
          <Button
            onClick={() => {
              console.log("clicked button");
            }}
          >
            Search
          </Button>
        </InputGroup>
      </Container>
      <Container>
        <Row className="mx-2 row row-cols-4">
          <Card>
            <Card.Img src="#" />
            <Card.Body>
              <Card.Title>Album Name Here</Card.Title>
            </Card.Body>
          </Card>
        </Row>
      </Container>
    </div>
  );
}

export default App;
