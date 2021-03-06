import React, { Component } from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify.js'


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchResults: [],
      playlistTracks: [],
      playlistName : 'New Playlist',
      term: null
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  updatePlaylistName(name) {
    this.setState({playlistName: name});
  }

  addTrack(track) {
    this.setState(prevState => ({ playlistTracks: [...prevState.playlistTracks, track]}));

  }

  removeTrack(track) {
    this.setState((prevState) => ({
     playlistTracks: prevState.playlistTracks.filter(i => i.id !== track.id)
   }));
 }

 search(term) {
   Spotify.search(term).then(track => {
     this.setState({searchResults: track})
   })
 }

  savePlaylist() {
    let trackURIs = this.state.playlistTracks.map(track => track.uri);

    Spotify.savePlaylist(this.state.playlistName, trackURIs);
    this.setState({playlistName: 'New Playlist', searchResults: []});
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
          <div className="App">
            <SearchBar onSearch={this.search}/>
          <div className="App-playlist">
            <SearchResults searchResults = {this.state.searchResults} onAdd = {this.addTrack}/>
            <Playlist playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks}
                      onNameChange={this.updatePlaylistName}  onSave={this.savePlaylist}
                      onRemove={this.removeTrack} />
          </div>
          </div>
        </div>
    )
  }

}

export default App;
