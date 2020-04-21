import React, { Component } from 'react';
import './Track.css'

export default class Track extends Component {
  
  addTrack = () => this.props.onAdd(this.props.track)

  removeTrack = () => this.props.onRemove(this.props.track)

  renderAction = () => {
    if (this.props.isRemoval) {
      return <button className="Track-action" onClick={this.removeTrack}>-</button>
    } else {
      return <button className="Track-action" onClick={this.addTrack}>+</button>
    }
  }

  render() {
    const { name, artist, album } = this.props.track;
    return (
      <div className="Track">
        <div className="Track-information">
          <h3>{name}</h3>
          <p>{artist} | {album}</p>
        </div>
        {this.renderAction()}
      </div>
    )
  }
}