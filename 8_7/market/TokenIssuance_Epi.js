import React, { Component } from 'react';
import { fetchEpi, fetchToonById } from "../util/APIAdmin";
import WebtoonInfo from "./WebtoonInfo";
import EpisodeList from "./EpisodeList";

import './components/TokenTabs.css';

class TokenIssuance_Epi extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 0,
            episodeList: [],
            webtoon: {},
        }
    }

    a11yProps = (index) => {

        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };

    }

    loadInfo = async () => {
        var web = {};
        var epi = []
        await fetchToonById(parseInt(this.props.match.params.id, 10))
            .then(res => {
                //웹툰들 중 ID가 일치하는 웹툰을 state.webtoon에 저장
                web = res
            })
            .catch(error => {
                console.log(error);
            });

        await fetchEpi(parseInt(this.props.match.params.id, 10))
            .then(res => {
                //웹툰ID가 일치하는 에피소들만 state.episodeList에 저장
                epi = res
            })
            .catch(error => {
                console.log(error);
            });

        this.setState({
            webtoon: web,
            episodeList: epi
        }, function () {
            // console.log('(1)web', this.state.webtoon)
            // console.log('(2)epi', this.state.episodeList)
        });

    }

    _getWebtoon() {
        fetchToonById(parseInt(this.props.match.params.id, 10))
            .then(res => {
                //웹툰들 중 ID가 일치하는 웹툰을 state.webtoon에 저장
                this.setState({
                    webtoon: res
                }, function () {
                    // console.log('(1)web', this.state.webtoon)
                });
            })
            .catch(error => {
                console.log(error);
            });
    }

    _getEpisodeList() {

        fetchEpi(parseInt(this.props.match.params.id, 10))
            .then(res => {
                //웹툰ID가 일치하는 에피소들만 state.episodeList에 저장
                this.setState({
                    episodeList: res,
                }, function () {
                    // console.log('(2)epi', this.state.episodeList)
                });
            })
            .catch(error => {
                console.log(error);
            });
    }


    componentWillMount = async () => {
        await this.loadInfo()
    }

    render() {
        return (
            <div>
                <div className="wrap">
                    <div className="main-container">
                        <div className="greenContainer"></div>
                        <div className="TokenContainer">
                            <div className="title">발행 가능한 웹툰 목록</div>
                            <div className="editList-container">
                            </div>
                        </div>
                    </div>
                </div>
                <main>
                    {this.state.webtoon.tno ? (
                        <WebtoonInfo webtoon={this.state.webtoon} />
                    ) : (
                        <span>LOADING...</span>
                    )}

                    {this.state.episodeList.length > 0 ? (
                        <EpisodeList episodes={this.state.episodeList} webtoon={this.state.webtoon} />
                    ) : (
                        <span>LOADING...</span>
                    )}
                </main>
            </div>
        )

    }
}


export default TokenIssuance_Epi;