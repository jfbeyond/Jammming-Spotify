import React, { Component } from 'react';
import './SearchBar.css';

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.search = this.search.bind(this);
    this.handleTermChange = this.handleTermChange.bind(this);
    this.handleEnterDown = this.handleEnterDown.bind(this);

  }

  search() {
    this.props.onSearch(this.state.term);
  }

  handleTermChange(event) {
    this.setState({term: event.target.value});
  }

  //I created this function to handle the pressing of 'ENTER'
  //Below in the input element I added a new attribute onKeyDown
  handleEnterDown(event) {
    if (event.keyCode === 13) {
      this.search(event);
    }
  }


  render() {
    return (
      <div className="SearchBar">
        <input placeholder="Enter A Song, Album, or Artist"
        onChange={this.handleTermChange} onKeyDown={this.handleEnterDown}
        />
        <a id='searchBtn' onClick={this.search}>SEARCH</a>
      </div>
    )
  }
}

export default SearchBar;
