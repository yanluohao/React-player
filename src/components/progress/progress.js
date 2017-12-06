import React, { Component } from "react";
import "./progress.css";

class Progress extends Component {
    static defaultProps = {
        barColor: "#2f9842",
    }
    changeProgress(e) {
        let progressBar = this.refs.progressBar;
        let percent = (e.clientX - progressBar.getBoundingClientRect().left) / progressBar.clientWidth;
        this.props.onProgressChange(percent);
    }
    render () {
        return (
            <div className="progress-box" ref="progressBar" onClick={this.changeProgress.bind(this)}>
                <div className="progress" style={{width: `${this.props.progress}%`,background: this.props.barColor}}></div>
            </div>
        )
    }
}

export default Progress;