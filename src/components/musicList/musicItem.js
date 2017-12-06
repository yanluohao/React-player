import React, {Component} from "react";
import Pubsub from "pubsub-js";
import "./musicItem.css";

class MusicItem extends Component {
    // 点击播放
    playMusic(musicItem, event) {
        Pubsub.publish("PLAY_MUSIC", musicItem);
    }

    // 删除
    deleteHandler(musicItem, event) {
        event.stopPropagation();
        Pubsub.publish("DELETE_MUSIC", musicItem);
    }

    render() {
        let musicItem = this.props.musicItem;
        return (
            <li className={`row components-listitem${this.props.focus ? ' focus' : ''}`} onClick={this.playMusic.bind(this, musicItem)}>
                <p><span className="bold">{musicItem.title}</span>  -  {musicItem.artist}</p>
                <p className="-col-auto delete" onClick={this.deleteHandler.bind(this, musicItem)}></p>
            </li>
        )
    }
}

export default MusicItem;