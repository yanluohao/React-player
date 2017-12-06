import React, { Component } from "react";
import "./header.css";
import logo from "../../images/logo.png";

class Head extends Component {
    render () {
        return (
            <div className="component-head">
                <img src={logo} width="40" alt=""/>
                <h1 className="caption">Music Player</h1>
            </div>
        )
    }
}

export default Head;