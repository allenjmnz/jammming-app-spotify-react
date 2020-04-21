import React, { Component } from "react";
import "./SearchBar.css";

export default class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      term: ""
    };
  }

  search = () => {
    this.props.onSearch(this.state.term);
  };

  handleTermChange = e => {
    this.setState({
      term: e.target.value
    });
  };

  render() {
    return (
      <div className="SearchBar">
        <input
          disabled={this.props.loggedIn ? false : true}
          style={this.props.loggedIn ? { opacity: 1 } : { opacity: 0.4 }}
          placeholder="Enter A Song, Album, or Artist"
          onChange={this.handleTermChange}
        />
        <button className="SearchButton" onClick={this.search}>
          {this.props.loggedIn ? "SEARCH" : "SIGN UP"}
        </button>
      </div>
    );
  }
}
