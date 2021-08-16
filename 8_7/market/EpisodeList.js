import React, { Component } from 'react';
import "./EpisodeList.css";
import { withRouter } from 'react-router-dom';
import Episode from './Episode'


class EpisodeList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            episodes: this.props.episodes,
            webtoon: this.props.webtoon,
        };
    }

    render() {
        return (
            <div className="wrap_episode">
                <ul className="list_episode">
                    {this.state.episodes.map((episode, index) => (
                        <li key={index} className="episode_line">
                        <Episode webtoon={this.state.webtoon} episode={episode}/>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
}

export default withRouter(EpisodeList);