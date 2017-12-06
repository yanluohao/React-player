import React, { Component } from "react";
import Progress from "../progress/progress";
import {Link} from "react-router-dom";
import Pubsub from "pubsub-js";

import "./player.css";


let duration = null;
const $ = window.$;


class Player extends Component {
    constructor() {
        super();
        this.state = {
            progress: 0,
            volume: 0,
            isPlay: true,
            leftTime: 0,
        }
    }
    componentDidMount() {
        $("#player").on($.jPlayer.event.timeupdate, (e) => {
            duration = e.jPlayer.status.duration;
            this.setState({
                progress: Math.round(e.jPlayer.status.currentPercentAbsolute),
                volume: e.jPlayer.options.volume * 100,
                leftTime: this.formatTime(duration * (1 - e.jPlayer.status.currentPercentAbsolute / 100))
            })
        })
    }
    componentWillUnmount() {
        $("#player").off($.jPlayer.event.timeupdate);
    }

    // 接收子级progress上传的参数
    progressHandler(progress) {
        this.syncPlayStatus();
        $("#player").jPlayer('play', duration * progress);
    }

    // 控制音量
    changeVolumeHandler(volume) {
        if(!this.state.isPlay) {
            return;
        }
        $("#player").jPlayer('volume', volume);
    }

    // 调节音量和进度时同步按钮状态
    syncPlayStatus() {
        if(!this.state.isPlay) {
            this.setState({
                isPlay: true
            })
        }
    }

    // 暂停或者播放
    play() {
        if(this.state.isPlay) {
            $("#player").jPlayer('pause');
        }else {
            $("#player").jPlayer('play');
        }
        this.setState({
            isPlay: !this.state.isPlay
        })
    }

    prev() {
        Pubsub.publish("PREV_MUSIC");
    }

    next() {
        Pubsub.publish("NEXT_MUSIC");
    }

    formatTime(time) {
        time = Math.floor(time);
        let miniute = Math.floor(time / 60);
        let seconds = Math.floor(time % 60);

        return miniute + ':' + (seconds < 10 ? '0' + seconds : seconds);
    }

    render() {
        let rt = {
            top: 5,
            left: -5
        }
        let progressContainer = {
            height: 10,
            lineHeight: '10px',
            marginTop: 10,
        }
        return(
            <div className="player-page">
                <h1 className="caption">
                    <Link to="/list">
                        我的私人音乐坊 &gt;
                    </Link>
                </h1>
                <div className="mt20 row">
                    <div className="controll-wrapper">
                        <h2 className="music-title">{this.props.currentMusicItem.title}</h2>
                        <h3 className="music-artist mt10">{this.props.currentMusicItem.artist}</h3>
                        <div className="row mt20">
                            <div className="left-time -col-auto">-{this.state.leftTime}</div>
                            <div className="volume-container">
                                <i className="icon-volume rt" style={rt}></i>
                                <div className="volume-wrapper">
                                    <Progress
                                        progress={this.state.volume}
                                        onProgressChange={this.changeVolumeHandler.bind(this)}
                                        barColor='#000'
                                    >
                                    </Progress>
                                </div>
                            </div>
                        </div>
                        <div style={progressContainer}>
                            <Progress
                                progress={this.state.progress}
                                onProgressChange={this.progressHandler.bind(this)}
                            >
                            </Progress>
                        </div>
                        <div className="mt35 row">
                            <div>
                                <i className="icon prev" onClick={this.prev}></i>
                                <i className={`icon ml20 ${this.state.isPlay ? 'pause' : 'play'}`} onClick={this.play.bind(this)}></i>
                                <i className="icon next ml20" onClick={this.next}></i>
                            </div>
                        </div>
                    </div>
                    <div className="-col-auto cover">
                        <img src={this.props.currentMusicItem.cover} alt={this.props.currentMusicItem.title}/>
                    </div>
                </div>
            </div>
        )
    }
}

export default Player;