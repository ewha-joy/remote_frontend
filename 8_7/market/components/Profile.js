import React from 'react';
import { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button } from '@material-ui/core';
import ProfileBox from './ProfileBox';
import caver from '../../klaytn/caver'
import { DEPLOYED_ABI, DEPLOYED_ADDRESS } from '../../constants';
import './Profile.css'
import {notification, Table} from 'antd';
import {fetchCashByOwner} from '../../util/APIUtils';

// import {getUserProfile, chargeCash, getCashRecord, CheckRentIng, chargeCash_user} from '../../util/APIUtils';
// import {fetchFav, deleteFavById} from '../../util/APIAdmin';

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


       getCash= async ()=> {
            var cash_sum=0;
            var address = walletFromSession.address
            if(!(this.props.role=='ROLE_AUTHOR' || this.props.role == 'ROLE_USER')){
                notification.error({
                    message: 'JOY웹툰 로그인이 필요합니다.',
                });
                return 
            }
            else{
            await fetchCashByOwner(address)
                .then(res =>{
                    var cashList = new Array();
                    for(var i =0;i<res.length;i++){
                        var data = new Object();
                        var owner = res[i].owner;
                        var n_owner = owner.length;
                        var count=0;
                        var cash;
                        for(var j=0;j<n_owner;j++){
                            if(owner[j].toUpperCase()==address.toUpperCase()){
                                count++;
                            }
                        }
    
                        cash=10*(count/n_owner);
    
                        data.createdAt= res[i].createdAt
                        data.n_token = count
                        data.cash = cash
                        data.toonname = res[i].toonname
                        data.epiname = res[i].epiname
    
                        cash_sum+=cash;
    
                        cashList.push(data);
                        console.log(cashList);
                        this.setState({
                            cashList: cashList
                        })
                        
                    }
                })
    
            this.setState({
                cash: cash_sum+" 캐시",
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
          token : balance
        })  
    }

    componentDidMount() {
        this.getKlay(walletFromSession);
        this.getBalanceOf(walletFromSession);
    }

    
    render() {
        const columns1 =[
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
        return (
            <div class="main-container">
                <div class="wrap">
                    <div class="greenContainer">
                        <div>
                            {/* <div class="grade">@joy1</div>
                            <div class="name">joy1<function></function></div> */}
                        </div>       
                    </div>

                    <div class="shippingStatusContainer">
                        <div class="title">
                            보유 자산
                        </div>
                        <div class="status">
                            <div class="item">
                                <div>
                                    <div class="green number">{this.state.klay + ' KLAY'}</div>
                                    <div class="text">Balance</div>
                                </div>
                            </div>       
                            <div class="item">
                                <div>
                                    <div class="green number">{this.state.token + " 개"}</div>
                                    <div class="text">보유 토큰 개수</div>
                                </div>
                            </div>      
                        </div>
                    </div>  
  
                    <div class="listContainer">
                        <a href="#" class="item">
                            <div class="icon">:</div>
                            <div class="text">ADDRESS</div>
                            <div class="text"><ProfileBox label="" value={walletFromSession.address} /></div>
                            <div class="right"> : </div>
                        </a>
                        <a href="#" class="item">
                            <div class="icon">:</div>
                            <div class="text">PRIVATE KEY</div>
                            <div class="text"><ProfileBox label="" value={walletFromSession.privateKey} /></div>
                            <div class="right"> : </div>
                        </a>
                        <a href="#" class="item">
                            <div class="icon">:</div>
                            <div class="text">Klaytn Wallet Key</div>
                            <div class="text"><ProfileBox label="" value={walletFromSession.address || "0x000" || walletFromSession.privateKey} /></div>
                            <div class="right"> : </div>
                        </a>
                    </div>

                    <div className="favTable_container">
                                <div className="favTitle_container">
                                    <span className="favTitle">캐시 수익 <Button className="button" variant="contained" color="default" onClick={this.getCash}>조회</Button></span>

                                </div>
                                { this.state.visible ? <div>
                                    <span className="favTitle">{this.state.cash}</span>
                                    <div>
                                    <details>
                                    <summary>내역보기</summary>
                                    <div class="tpt"><Table dataSource={this.state.cashList} columns={columns1} pagination={{pageSize:10}} /></div>
                                    </details>
                                    </div>
                                    </div> : null }

                           


                        </div>
                </div>
            </div>
        )
    }
}


export default Profile;