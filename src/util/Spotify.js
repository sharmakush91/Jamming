// util/Spotify.js
const clientId = "4eff695c1ca247ad82a2958e84838651";
const redirectUri = "https://sharmakush91.github.io/Jamming/";
const scope = "playlist-modify-private";
const accessTokenKey = "access_token";
let accessToken;

const Spotify = {};

const generateRandomString = (length) => {
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], "");
};

const sha256 = async (plain) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return window.crypto.subtle.digest("SHA-256", data);
};

const base64encode = (input) => {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
};

Spotify.getAccessToken = async function () {
  // Check if accessToken is already available:

  if (accessToken) return accessToken;

  //Check if accessToken is stored in localStorage:

  const storedToken = localStorage.getItem(accessTokenKey);
  if (storedToken) {
    accessToken = storedToken;
    return accessToken;
  }

  //Check for authorization code in URL:

  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");

  //Handle no code in the URL (start authorization process):

  if (!code) {
    const codeVerifier = generateRandomString(64);
    const hashed = await sha256(codeVerifier);
    const codeChallenge = base64encode(hashed);
    localStorage.setItem("code_verifier", codeVerifier);

    const authUrl = new URL("https://accounts.spotify.com/authorize");
    authUrl.search = new URLSearchParams({
      response_type: "code",
      client_id: clientId,
      scope,
      code_challenge_method: "S256",
      code_challenge: codeChallenge,
      redirect_uri: redirectUri,
    }).toString();

    window.location.href = authUrl;
    return;
  }

  //Handle the code in the URL (exchange code for access token):

  const codeVerifier = localStorage.getItem("code_verifier");
  if (!codeVerifier) {
    localStorage.clear();
    window.location.href = redirectUri;
    return;
  }

  //Exchange the code for an access token:

  try {
    const tokenResponse = await fetch(
      "https://accounts.spotify.com/api/token",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: clientId,
          grant_type: "authorization_code",
          code,
          redirect_uri: redirectUri,
          code_verifier: codeVerifier,
        }),
      }
    );

    //Handle the token response and store it:

    const tokenData = await tokenResponse.json();
    if (!tokenResponse.ok) throw new Error(tokenData.error_description);

    accessToken = tokenData.access_token;
    localStorage.setItem(accessTokenKey, accessToken);
    window.history.replaceState({}, document.title, "/");
    return accessToken;
  } catch (err) {
    //Error handling:

    console.error("Token exchange error:", err);
    return null;
  }
};

Spotify.search = function (term) {
  return Spotify.getAccessToken()
    .then((token) => {
      if (!token) return [];

      return fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(
          term
        )}&type=track`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    })
    .then((res) => res.json())
    .then((data) => {
      if (!data.tracks) return [];

      return data.tracks.items.map((track) => ({
        id: track.id,
        name: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        uri: track.uri,
      }));
    })
    .catch((err) => {
      console.error("Search failed:", err);
      return [];
    });
};

Spotify.savePlaylist = function (playlistName, trackURIs) {
  if (!playlistName || !trackURIs.length) {
    return Promise.reject("Missing playlist name or tracks.");
  }

  return Spotify.getAccessToken().then((token) => {
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    // Step 1: Get user ID
    return fetch("https://api.spotify.com/v1/me", { headers }) // <-- RETURN here
      .then((res) => res.json())
      .then((user) => {
        // Step 2: Create Playlist
        return fetch(`https://api.spotify.com/v1/users/${user.id}/playlists`, {
          method: "POST",
          headers,
          body: JSON.stringify({ name: playlistName, public: false }),
        });
      })
      .then((res) => res.json())
      .then((playlist) => {
        // Step 3: Add Tracks
        return fetch(
          `https://api.spotify.com/v1/playlists/${playlist.id}/tracks`,
          {
            method: "POST",
            headers,
            body: JSON.stringify({ uris: trackURIs }),
          }
        );
      })
      .then((res) => res.json())
      .then((result) => {
        console.log("✅ Playlist saved!", result);
        return result;
      })
      .catch((err) => {
        console.error("❌ Save playlist error:", err);
        throw err;
      });
  });
};

export default Spotify;
