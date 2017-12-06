import React, {Component} from "react";
import MusicItem from "./musicItem";

class MusicList extends Component {
    render() {
        let list = this.props.musicList.map((item) => {
            return <MusicItem focus={item === this.props.currentMusicItem} key={item.id} musicItem={item}>{item.title}</MusicItem>
        })
        return (
            <ul>
                {list}
            </ul>
        )
    }
}

export default MusicList;