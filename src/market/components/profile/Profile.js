import React from 'react';
import { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button } from '@material-ui/core';
import ProfileBox from './ProfileBox';
import caver from '../../../klaytn/caver'
import { DEPLOYED_ABI, DEPLOYED_ADDRESS } from '../../../constants';
import './Profile.css'
import { notification, Table } from 'antd';
import { fetchCashByOwner } from '../../../util/APIUtils';

const wttContract = new caver.klay.Contract(DEPLOYED_ABI, DEPLOYED_ADDRESS);
const walletFromSession = JSON.parse(sessionStorage.getItem('walletInstance'));


class Profile extends Component {
    constructor(props) {
        super(props);
    }
    state = {
        klay: '0',
        token: '0',
        visible: false,
    }


    getCash = async () => {
        var cash_sum = 0;
        const walletFromSession = JSON.parse(sessionStorage.getItem('walletInstance'));
        var address = walletFromSession.address
        if (!(this.props.role == 'ROLE_AUTHOR' || this.props.role == 'ROLE_USER')) {
            notification.error({
                message: 'JOY웹툰 로그인이 필요합니다.',
            });
            return
        }
        else {
            await fetchCashByOwner(address)
                .then(res => {
                    var cashList = new Array();
                    for (var i = 0; i < res.length; i++) {
                        var data = new Object();
                        var owner = res[i].owner;
                        var n_owner = owner.length;
                        var count = 0;
                        var cash;
                        for (var j = 0; j < n_owner; j++) {
                            if (owner[j].toUpperCase() == address.toUpperCase()) {
                                count++;
                            }
                        }

                        cash = 10 * (count / n_owner);

                        data.createdAt = res[i].createdAt
                        data.n_token = count
                        data.cash = cash.toFixed(2)
                        data.toonname = res[i].toonname
                        data.epiname = res[i].epiname

                        cash_sum += Number(cash.toFixed(2));

                        cashList.push(data);
                        console.log(cashList);
                        this.setState({
                            cashList: cashList
                        })

                    }
                })

            this.setState({
                cash: cash_sum + " 캐시",
                visible: true
            })
        }
    }



    getKlay = (walletInstance) => {
        if (!walletInstance) return
        caver.klay.getBalance(walletInstance.address).then((klay) => {
            this.setState({
                klay: caver.utils.fromWei(klay),
            })
        })
    }

    getBalanceOf = async function (walletInstance) {

        var balance = parseInt(await wttContract.methods.balanceOf(walletInstance.address).call());
        this.setState({
            token: balance
        })
    }
    componentDidMount() {
        const walletFromSession = JSON.parse(sessionStorage.getItem('walletInstance'));
        this.getKlay(walletFromSession);
        this.getBalanceOf(walletFromSession);
    }


    render() {
        const walletFromSession = JSON.parse(sessionStorage.getItem('walletInstance'));

        const columns1 = [
            {
                title: '날짜',
                dataIndex: 'createdAt',
                key: 'createdAt'
            },
            {
                title: 'nft개수',
                key: 'n_token',
                dataIndex: 'n_token'
            },
            {
                title: '캐시',
                key: 'cash',
                dataIndex: 'cash'
            },
            {
                title: '웹툰',
                key: 'toonname',
                dataIndex: 'toonname'
            },
            {
                title: '회차',
                key: 'epiname',
                dataIndex: 'epiname'
            }
        ]
        if (walletFromSession != null) {
            return (
                <div className="main-container_profile">
                    <div className="wrap_profile">
                        <div class="greenContainer_profile"/>

                        <div class="shippingStatusContainer_profile">
                            <div class="title_profile">
                                보유 자산
                            </div>
                            <div class="status_profile">
                                <div class="item_profile">
                                    <div>
                                        <div class="green number_profile">{Number(this.state.klay).toFixed(2) + ' KLAY'}</div>
                                        <div class="text_profile">Balance</div>
                                    </div>
                                </div>
                                <div class="item_profile">
                                    <div>
                                        <div class="green number_profile">{this.state.token + " 개"}</div>
                                        <div className="text_profile">보유 토큰 개수</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="listContainer_profile">
                            <a href="#" className="item_profile">
                                <div className="icon_profile">:</div>
                                <div className="text_profile" style={{width:'15%'}}>ADDRESS</div>
                                <div className="text_profile"><ProfileBox label="" value={walletFromSession.address} /></div>
                                <div className="right_profile"> : </div>
                            </a>
                            <a href="#" className="item_profile">
                                <div className="icon_profile">:</div>
                                <div className="text_profile" style={{width:'15%'}}>PRIVATE KEY</div>
                                <div className="text_profile"><ProfileBox label="" value={walletFromSession.privateKey} /></div>
                                <div className="right_profile"> : </div>
                            </a>
                            <a href="#" className="item_profile">
                                <div className="icon_profile">:</div>
                                <div className="text_profile" style={{width:'15%'}}>Klaytn Wallet Key</div>
                                <div className="text_profile"><ProfileBox label="" value={walletFromSession.address + "0x000" + walletFromSession.privateKey} /></div>
                                <div className="right_profile"> : </div>
                            </a>
                        </div>
                        <div className="shippingStatusContainer_profile">
                            <div className="favTable_container_profile">
                                <div class="title_profile">
                                캐시 수익
                                </div>
                                    <span className="favTitle"><Button className="button" variant="contained" color="default" onClick={this.getCash}>조회</Button></span>
                                {this.state.visible ?   
                                <div>
                                    <span className="green number_profile"><br></br>{this.state.cash}</span>
                                    <div>
                                        <details>
                                            <summary>내역보기</summary>
                                            <div className="tpt_profile"><Table dataSource={this.state.cashList} columns={columns1} pagination={{ pageSize: 10 }} /></div>
                                        </details>
                                    </div>
                                </div> : null}
                            </div>
                        </div>

                        {/* <div className="favTable_container_profile">
                            <div className="favTitle_container_profile">
                                <span className="favTitle">캐시 수익 <Button className="button" variant="contained" color="default" onClick={this.getCash}>조회</Button></span>

                            </div>
                            {this.state.visible ? <div>
                                <span className="favTitle_profile">{this.state.cash}</span>
                                <div>
                                    <details>
                                        <summary>내역보기</summary>
                                        <div className="tpt_profile"><Table dataSource={this.state.cashList} columns={columns1} pagination={{ pageSize: 10 }} /></div>
                                    </details>
                                </div>
                            </div> : null}
                        </div> */}

                    </div>
                </div>
            )
        }else{
            return(<div>Loading...</div>)
        }
    }
}


export default Profile;