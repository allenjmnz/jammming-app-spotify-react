import React, { Component } from "react";
import "./App.css";
import SearchBar from "../SearchBar/SearchBar";
import SearchResults from "../SearchResults/SearchResults";
import Playlist from "../Playlist/Playlist";
import Spotify from "../../util/Spotify";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

if (window.location.href.match(/access_token/)) {
  Spotify.getAccessToken();
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],

      playlistName: "New Playlist",

      playlistTracks: [],

      accessToken: sessionStorage.getItem("access_token")
    };
  }

  addTrack = track => {
    const { playlistTracks } = this.state;
    if (playlistTracks.find(music => music.id === track.id)) {
      return;
    }
    const newAr = [...playlistTracks, track];
    this.setState({
      playlistTracks: newAr
    });
  };

  removeTrack = track => {
    const playlistTracks = this.state.playlistTracks.filter(
      music => track.id !== music.id
    );
    this.setState({
      playlistTracks
    });
  };

  updatePlaylistName = name => {
    this.setState({
      playlistName: name
    });
  };

  savePlaylist = async () => {
    if (this.state.playlistTracks.length && this.state.accessToken) {
      const trackUris = this.state.playlistTracks.map(track => track.uri);
      console.log(trackUris);
      Spotify.savePlaylist(this.state.playlistName, trackUris);
      this.setState({
        playlistTracks: [],
        playlistName: "New Playlist"
      });
    }
  };

  search = async searchTerm => {
    if (this.state.accessToken && searchTerm) {
      const list = await Spotify.search(searchTerm);
      this.setState({
        searchResults: list
      });
    } else {
      Spotify.getAccessToken();
    }
  };

  componentDidMount() {
    if (this.state.accessToken) {
      toast.success("Welcome, you are logged in");
    }
  }

  render() {
    const {
      searchResults,
      playlistName,
      playlistTracks,
      accessToken
    } = this.state;
    const loggedIn = accessToken ? true : false;
    return (
      <>
        <h1>
          Ja<span className="highlight">mmm</span>ing
        </h1>
        <div className="App">
          <SearchBar onSearch={this.search} loggedIn={loggedIn} />

          <div className="App-playlist">
            <SearchResults
              searchResults={searchResults}
              onAdd={this.addTrack}
            />

            <Playlist
              playlistName={playlistName}
              onNameChange={this.updatePlaylistName}
              playlistTracks={playlistTracks}
              onRemove={this.removeTrack}
              onSave={this.savePlaylist}
              loggedIn={loggedIn}
            />
          </div>
        </div>
        <ToastContainer autoClose={3000} hideProgressBar />
      </>
    );
  }
}

export default App;
