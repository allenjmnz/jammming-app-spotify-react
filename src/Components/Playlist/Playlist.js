import React, { Component } from "react";
import "./Playlist.css";
import TrackList from "../TrackList/TrackList";

export default class Playlist extends Component {
  handleNameChange = e => {
    this.props.onNameChange(e.target.value);
  };

  render() {
    return (
      <div className="Playlist">
        <input
          value={this.props.playlistName}
          onChange={this.handleNameChange}
        />
        <TrackList
          tracks={this.props.playlistTracks}
          onRemove={this.props.onRemove}
          isRemoval={true}
        />
        <button
          className="Playlist-save"
          onClick={this.props.onSave}
          style={
            this.props.loggedIn
              ? { opacity: 1, pointerEvents: "auto" }
              : { opacity: 0.4, pointerEvents: "none" }
          }
        >
          SAVE TO SPOTIFY
        </button>
      </div>
    );
  }
}
