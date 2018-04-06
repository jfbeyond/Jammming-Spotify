import React, { Component } from 'react';
import './Track.css';


class Track extends Component {
  constructor(props) {
    super(props);
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.renderAction = this.renderAction.bind(this);
  }
  render() {
    return (
      <div className="Track">
        <div className="Track-information">
          <h3>{this.props.name}</h3>
          <p>{this.props.artist} | {this.props.album}</p>
        </div>
        <a className="Track-action" >{this.renderAction()}</a>
      </div>
    )
  }
  renderAction() {
    if (this.props.isRemoval) {
        return (<a onClick = {this.removeTrack}> - </a>);
    } else {
      return (<a onClick = {this.addTrack}> + </a>);
    }
  }

  addTrack() {
    this.props.onAdd(this.props.track);
  }

  removeTrack() {
    this.props.onRemove(this.props.track);
  }
}

export default Track;
