
let spotifyToken;
let tokenExpiresIn;
const clientId = 'Insert Spotify Client ID here';
const redirectURI = "http://localhost:3000/";


const Spotify =  {

  getAccessToken() {
    if (spotifyToken) {
      console.log(spotifyToken);
      return spotifyToken;

    } else if (window.location.href.match(/access_token=([^&]*)/) != null) {
			spotifyToken = window.location.href.match(/access_token=([^&]*)/)[1];
			tokenExpiresIn = window.location.href.match(/expires_in=([^&]*)/)[1];
      window.setTimeout(() => spotifyToken = '', tokenExpiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
      //console.log(tokenExpiresIn);
      //console.log(`The access token is ${spotifyToken}`);
      return spotifyToken;

    } else {
      window.location = `http://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
    }
  },

  search(term) {
      if(spotifyToken === undefined) {
        const spotifyToken=Spotify.getAccessToken();
      }
      console.log(this.spotifyToken);
      const headers = { Authorization: `Bearer ${spotifyToken}` }
       return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`,

           { headers: headers}
       ).then(response => { return response.json(); }
       ).then(jsonResponse => {
           if (jsonResponse.tracks) {
               let tracks = jsonResponse.tracks.items.map(track => ({

                       id: track.id,
                       name: track.name,
                       artist: track.artists[0].name,
                       album: track.album.name,
                       uri: track.uri
               }));
               //console.log(tracks);
              return tracks;
           } else {
               return [];
           }
       });


   },

   savePlaylist(name, trackURIs) {
     if(spotifyToken === undefined) {
       this.getAccessToken();
      console.log(spotifyToken);
     }

     if (name === undefined || trackURIs === undefined) {
       return;
     }  else {
       console.log(spotifyToken);
       let accessToken = spotifyToken;
       //id Request
       const headers = { Authorization: `Bearer ${accessToken}` }
       let userId;
       return fetch('https://api.spotify.com/v1/me', {headers: headers}
     ).then(response => response.json()
     ).then(jsonResponse => {
       userId = jsonResponse.id;
       return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
         headers: headers,
         method: 'POST',
         body: JSON.stringify({name: name})
       }).then(response => response.json()
       ).then(jsonResponse => {
         const playlistId = jsonResponse.id;
         return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
           headers: headers,
           method: 'POST',
           body: JSON.stringify({uris: trackURIs})
         });
       });
     });
}

   }


}

export default Spotify;
