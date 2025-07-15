import { useState, useEffect } from "react";
import SearchBar from "./SearchBar/SearchBar";
import SearchResults from "./SearchResults/SearchResults";
import Playlist from "./Playlist/Playlist";
import Spotify from "../util/Spotify";
import "./App.css";

function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [playlistName, setPlaylistName] = useState("New Playlist");
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    Spotify.getAccessToken();
  }, []);

  const addTrack = (track) => {
    if (playlistTracks.find((t) => t.id === track.id)) return;
    setPlaylistTracks([...playlistTracks, track]);
  };

  const removeTrack = (track) => {
    setPlaylistTracks(playlistTracks.filter((t) => t.id !== track.id));
  };

  const updatePlaylistName = (name) => setPlaylistName(name);

  const savePlaylist = () => {
    const trackURIs = playlistTracks.map((track) => track.uri);
    Spotify.savePlaylist(playlistName, trackURIs).then(() => {
      setPlaylistName("New Playlist");
      setPlaylistTracks([]);
    });
  };

  const search = (term) => {
    setHasSearched(true);
    Spotify.search(term).then(setSearchResults);
  };

  return (
    <div className="App">
      <h1>
        Ja<span className="highlight">mmm</span>ing
      </h1>
      <SearchBar onSearch={search} />
      {hasSearched ? (
        <div className="App-playlist">
          <SearchResults tracks={searchResults} onAdd={addTrack} />
          <Playlist
            playlist={playlistName}
            playlistTracks={playlistTracks}
            onRemove={removeTrack}
            onNameChange={updatePlaylistName}
            onSave={savePlaylist}
          />
        </div>
      ) : null}
    </div>
  );
}

export default App;
