import React, { Component } from 'react';
import {Link} from "react-router-dom";
import "./EpisodeList.css";
import {checkEpiRent, checkCash, rentEpisode, rentToon,fetchtoken} from '../util/APIUtils';
import {Button, notification} from "antd";
import {withRouter} from 'react-router-dom';
import {fetchEditEpi} from '../util/APIAdmin'

import caver from '../klaytn/caver'
import { DEPLOYED_ABI, DEPLOYED_ADDRESS, 
    } from '../constants';
const wttContract = new caver.klay.Contract(DEPLOYED_ABI, DEPLOYED_ADDRESS);


class EpisodeList extends Component {
    constructor(props){
        super(props);
        this.state = {
            episodes : this.props.episodes,
        };
        this.CheckRent = this.CheckRent.bind(this);
        this.rentEpi = this.rentEpi.bind(this);
    }


    CheckRent = async (epiid, event) => {
        event.preventDefault();
        await checkEpiRent(epiid)
           .then( res => {
                if(res) {
                    this.props.history.push('/viewer/'+epiid)
                    notification.success({
                        message: 'JOY Toon',
                        description: '대여권이 존재합니다.'
                    });
                }
                else{
                    notification.error({
                        message: 'JOY Toon',
                        description: '대여권이 존재하지 않습니다.'
                    });
                }
            })
            .catch(error => {console.log(error)});
    }


    rentEpi= async (epiid, event) =>{
        event.preventDefault();
        await checkEpiRent(epiid)
            .then( res => {
                if(res) {
                    this.props.history.push('/viewer/'+epiid)
                    notification.success({
                        message: 'JOY Toon',
                        description: '대여권이 이미 존재합니다.'
                    });
                }
                else{
                    // 남은 캐시 조회하기
                    checkCash()
                        .then(response =>{
                            if(response >= 10){ // 캐시가 충분함 -> 서버에 CashRecord save 요청


                                // cashRecord - WEBTOON_RENT 생성
                                fetchEditEpi(epiid)
                                    .then(result =>{
                                        var epititle = result.epiTitle
                                        var toontitle = result.webtoonTitle
                                        fetchtoken(epiid)
                                        .then(async res =>{
                                            console.log(res);
                                            var ownerList = []
                                            for(let i=0;i<res.length;i++){

                                                var owner = await this.getOwnerOf(res[i].tokenId);
                                                ownerList.push(owner);
                                            }

                                            var ownerListstr = ownerList.toString();

                          


                                        
                                            rentEpisode(epiid, epititle, toontitle,ownerListstr)
                                                .then(res => {
                                                        /* 8/7일자 수정
                                                        // rentToon()
                                                        */
                                                        this.props.history.push('/viewer/'+epiid)
                                                    }
                                                )
                                            notification.success({
                                                message: 'JOY Toon',
                                                description: '성공적으로 대여권을 구매하였습니다. 남은 캐시는'+(response-10)+'입니다.'
                                            });

                                            })
                                        })
                                    .catch(error => {
                                        notification.error({
                                            message: 'JOY Toon',
                                            description: error.message || '다시 시도해주세요.'
                                        });
                                    });



                            }

                            else{ //캐시가 부족한 상황
                                notification.error({
                                    message: 'JOY Toon',
                                    description: '캐시가 부족합니다. 충전해주세요'
                                });

                            }
                        })
                }
            })
            .catch(error => {
                notification.error({
                    message: 'JOY Toon',
                    description: error.message || '다시 시도해주세요.'
                });
            });
    }

    getOwnerOf = async (tokenId) => {
        return await wttContract.methods.ownerOf(tokenId).call();
      }

    render() {


        return (
            <div className="wrap_episode">
                <ul className="list_episode">
                    { this.state.episodes.map((episode, index) => (
                        <div className="link_epi">
                            <li key={index} className="episode_line">
                                    <Link to={`/viewer/${episode.eno}`} onClick={ e => {this.CheckRent(episode.eno, e)}} className="link_episode">
                                    <div className="img_episode">
                                        <img src={episode.epiThumbnail.fileUri} alt={episode.epiTitle} className="epi_img"/>
                                    </div>
                                    </Link>
                                    <div className="info_episode">
                                        <strong className="tit_episode">
                                            {episode.epiTitle}
                                        </strong>
                                        <span className="date_episode">
                                            {`${episode.createdAt.substr(0,10)}`}
                                        </span>
                                        <span className="avgStar_epi">
                                            평점 : {Number((Object.values(episode.rate).reduce((acc, current)=> acc + current.rate, 0))/Object.values(episode.rate).length).toFixed(1)}
                                        </span>
                                        <Button type="primary" className="rentButton" onClick={ e => {this.rentEpi(episode.eno, e)}} htmlType="submit" >
                                            대여
                                        </Button>
                                    </div>


                            </li>
                        </div>
                        )) }
                </ul>
            </div>
        );
    }
}

export default withRouter(EpisodeList);