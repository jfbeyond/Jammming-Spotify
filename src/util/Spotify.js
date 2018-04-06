
let spotifyToken;
let tokenExpiresIn;
const clientId = '8cb37f863e104a7a8b940ae0be1a35cf';
const redirectURI = "http://localhost:3000/";


const Spotify =  {

  getAccessToken() {
    if (spotifyToken) {
      console.log(spotifyToken);
      return spotifyToken;

    } else if (window.location.href.match(/access_token=([^&]*)/) != null) {
			spotifyToken = window.location.href.match(/access_token=([^&]*)/);
			tokenExpiresIn = window.location.href.match(/expires_in=([^&]*)/);
      window.setTimeout(() => spotifyToken = '', tokenExpiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
      console.log(spotifyToken);
    } else {
      window.location = `http://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;

    }
  },
  search(term) {
      if(spotifyToken === undefined) {

        this.getAccessToken();


      }
      console.log(spotifyToken);
       return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`,
           { headers: { Authorization: `Bearer ${spotifyToken}` } }
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
               console.log(tracks);
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
       let accessToken = spotifyToken;
       let userId;

       //id Request
       fetch(`https://api.spotify.com/v1/me`, {headers: {
				Authorization: `Bearer ${accessToken}`
			}}
				).then(response => {return response.json()}
				).then(jsonResponse => {
					userId = jsonResponse.id;
					return userId;
				});

        //POST request that returns a playlist ID
        let playlistID;
        fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
					method: 'POST',
					headers: {
						Authorization: `Bearer ${accessToken}`,
						"Content-Type": 'application/json'
					},
					body: JSON.stringify({name: name})
				}).then(response => {return response.json()}
      ).then(jsonResponse => {
        playlistID = jsonResponse.id;
        return playlistID;
      });

      //POST request to add tracks to a playlist
      fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistID}/tracks`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${accessToken}`,
					"Content-Type": 'application/json'
				},
				body: JSON.stringify({uris: trackURIs})
			});

     }

   }


}

export default Spotify;
