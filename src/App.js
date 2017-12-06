import React, {Component} from 'react';
import Head from "./components/header/header";
import Player from "./components/player/player";
import {MUSIC_LIST} from "./static/fileList";
import MusicList from "./components/musicList/musicList";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Pubsub from "pubsub-js";

import './App.css';
import './style/reset.css';
import './style/common.css';

const $ = window.$;

const Test = () => (
    <div>11233</div>
);

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentMusicItem: MUSIC_LIST[4],
            musicList: MUSIC_LIST,
        }
    }

    componentDidMount() {
        var _this = this;
        $("#player").jPlayer({
            supplied: "mp3",
            wmode: "window"
        })
        this.playMusic(this.state.currentMusicItem);

        $("#player").bind($.jPlayer.event.ended, (e) => {
            this.playNext();
        })

        // 接收播放事件
        Pubsub.subscribe("PLAY_MUSIC", function (msg, musicItem) {
            _this.playMusic(musicItem);
        })

        // 接收删除事件
        Pubsub.subscribe("DELETE_MUSIC", function (msg, musicItem) {
            _this.setState({
                musicList: _this.state.musicList.filter((item) => item !== musicItem)
            })
        })

        // 接收上一曲
        Pubsub.subscribe("PREV_MUSIC", function () {
            _this.playNext("prev");
        })

        // 接收下一曲
        Pubsub.subscribe("NEXT_MUSIC", function () {
            _this.playNext("next");
        })
    }

    componentWillUnmount() {
        Pubsub.unsubscribe("PLAY_MUSIC");
        Pubsub.unsubscribe("DELETE_MUSIC");
        $("#player").unbind($.jPlayer.event.ended);
        Pubsub.unsubscribe("NEXT_MUSIC");
        Pubsub.unsubscribe("PREV_MUSIC");
    }

    playMusic(musicItem) {
        $("#player").jPlayer('setMedia', {
            mp3: musicItem.file
        }).jPlayer('play');

        this.setState({
            currentMusicItem: musicItem
        })
    }

    playNext(type = "next") {
        let index = this.findMusicIndex(this.state.currentMusicItem);
        let newIndex;
        if(type === "next") {
            newIndex = index === this.state.musicList.length - 1 ? 0 : index + 1 ;
        }else {
            newIndex = index === 0 ? this.state.musicList.length - 1 : index -1;
        }
        this.playMusic(this.state.musicList[newIndex]);
    }

    findMusicIndex(musicItem) {
        return this.state.musicList.indexOf(musicItem);
    }

    render() {
        const player = () => (
            <Player currentMusicItem={this.state.currentMusicItem} repeatType={this.state.repeatType}></Player>
        )
        const list = () => (
            <MusicList currentMusicItem={this.state.currentMusicItem} musicList={this.state.musicList}></MusicList>
        )
        return (
            <div className="App">
                <Head/>
                <Switch>
                    <Route path="/test" component={Test}></Route>
                    <Route exact path="/" component={player}></Route>
                    <Route path="/list" component={list}></Route>
                </Switch>
            </div>
        );
    }
}


class RootClass extends Component {
    render() {

        return (
            <Router>
                <App>
                </App>
            </Router>
        )
    }
}

export default RootClass;
