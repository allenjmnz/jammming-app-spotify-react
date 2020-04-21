const cliendID = "eea905e3a1c54173956ad48889608d86";
const redirectURI = "https://jammmingmx.surge.sh";

const Spotify = {
  getAccessToken() {
    // Store access token locally
    if (sessionStorage.getItem("access_token")) {
      if (window.location.href.match(/access_token/)) {
        window.location = redirectURI;
        return sessionStorage.getItem("access_token");
      } else {
        return sessionStorage.getItem("access_token");
      }
    }

    const url = window.location.href;
    const accessTokenMatch = url.match(/access_token=([^&]*)/);
    const expiresInMatch = url.match(/expires_in=([^&]*)/);

    if (accessTokenMatch && expiresInMatch) {
      sessionStorage.setItem("access_token", accessTokenMatch[1]);
      const expiresIn = Number(expiresInMatch[1]);
      window.setTimeout(
        () => sessionStorage.removeItem("access_token"),
        expiresIn * 1000
      );
      window.history.pushState("Access Token", null, "/");
      return sessionStorage.getItem("access_token");
    }

    window.location = `https://accounts.spotify.com/authorize?client_id=${cliendID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
  },

  async search(term) {
    const accessToken = this.getAccessToken();
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/search?type=track&q=${term}`,
        {
          method: "get",
          headers: {
            Authorization: "Bearer " + accessToken
          }
        }
      );
      if (response.ok) {
        const jsonResponse = await response.json();
        if (!jsonResponse.tracks) {
          return [];
        } else {
          return jsonResponse.tracks.items.map(track => {
            return {
              id: track.id,
              name: track.name,
              artist: track.artists[0].name,
              album: track.album.name,
              uri: track.uri
            };
          });
        }
      } else {
        return [];
      }
    } catch (err) {
      console.log(err);
    }
  },

  async savePlaylist(name, uris) {
    const accessToken = this.getAccessToken();
    let userID;
    let playlistID;
    const headers = { Authorization: "Bearer " + accessToken };
    try {
      // GET Request USER ID
      const resUserID = await fetch("https://api.spotify.com/v1/me", {
        headers: headers
      });
      if (resUserID.ok) {
        const jsonResUserID = await resUserID.json();
        userID = jsonResUserID.id;
      }

      // POST Request Create Playlist
      const resNewPL = await fetch(
        "https://api.spotify.com/v1/users/" + userID + "/playlists",
        {
          method: "post",
          headers: {
            ...headers,
            "Content-type": "json/application"
          },
          body: JSON.stringify({ name })
        }
      );
      if (resNewPL.ok) {
        const jsonResNewPL = await resNewPL.json();
        playlistID = jsonResNewPL.id;
      }

      // POST Request Add Songs to Created Playlist
      const resAddTracks = await fetch(
        `https://api.spotify.com/v1/playlists/${playlistID}/tracks`,
        {
          method: "post",
          headers: {
            ...headers,
            "Content-type": "json/application"
          },
          body: JSON.stringify({ uris })
        }
      );
      if (resAddTracks.ok) {
        console.log("Playlist Successfully Created!");
      }
    } catch (err) {
      console.log(err);
    }
  }
};

export default Spotify;
