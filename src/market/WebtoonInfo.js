
import React, { Component } from 'react';
import "./WebtoonInfo.css";

class WebtoonInfo extends Component {
        state = {
            webtoon : this.props.webtoon,
        };


    render() {
        return (
            <div className="wrap_webtoon">
                <img src={this.state.webtoon.toonThumbnail.fileUri} className="img_webtoon" alt={this.state.webtoon.title} />
                <div className="info_webtoon">
                    <strong className="tit_webtoon">{this.state.webtoon.title}</strong>
                    <span className="txt_genre">{this.state.webtoon.genre}</span>
                </div>
                
            </div>
        );
    }
}

export default WebtoonInfo;

