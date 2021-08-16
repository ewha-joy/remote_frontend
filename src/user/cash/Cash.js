import React, { Component } from 'react';
import NotFound from '../../common/NotFound';
import ServerError from '../../common/ServerError';
import LoadingIndicator  from '../../common/LoadingIndicator';
import {Avatar, Table, Button, Form, Input, notification} from 'antd';
import { getAvatarColor } from '../../util/Colors';
import {getUserProfile, chargeCash, getCashRecord, CheckRentIng, chargeCash_user} from '../../util/APIUtils';
import {fetchFav, deleteFavById} from '../../util/APIAdmin';
import {Link, withRouter} from "react-router-dom";
import "./Cash.css";
import { FaCoins } from "react-icons/fa";

const { TextArea } = Input;



class Cash extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            isLoading: false,
            cash : '',
            favs:[],
            cashrecords:[],
            rentrecords:[],
            res11 : null
        }
        this.loadUserProfile = this.loadUserProfile.bind(this);
        this.loadFav = this.loadFav.bind(this);
        this.loadCashRecord = this.loadCashRecord.bind(this);
        this.loadRentRecord = this.loadRentRecord.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.chargeCash = this.chargeCash.bind(this);
        this.seeWebtoon = this.seeWebtoon.bind(this);
        this.onChoice = this.onChoice.bind(this);
    }


    onDelete(fno){
        deleteFavById(fno)
            .then(res => {
                this.setState({favs:this.state.favs.filter(fav => fav.fno !== fno)})
            })
    }

    /*
[
{"id":
    {"timestamp":1624359542,
    "date":"2021-06-22T19:59:02.000+09:00"},
"userid":"1",
"change_amount":1111,
"content":"CHARGE",
"createdAt":"2021-06-22T19:59:01.964",
"toonname":"",
"epiname":"",
"epino":""
}
]
    * */

    onChoice(record){
        console.log(record.content)
        if (record.content === 'RENT_WEBTOON') return '대여';
        else if(record.content === 'CHARGE')return '충전';
        else if(record.content === 'MONTH_REVENUE')return 'NFT수익';
        else return '환불';
    }

    seeWebtoon(epiid){
        window.scrollTo(0, 0);
        this.props.history.push('/viewer/'+epiid)
    }

    loadFav(username){
        fetchFav(username)
            .then(res => {
                this.setState({
                favs : res
                }, function(){
                    console.log(res)
                });
            })
            .catch(error => {
                console.log(error);
            });
    }



    loadCashRecord(){
        getCashRecord()
            .then(res => {
                console.log(res)
                this.setState({
                    cashrecords : res
                }, function(){
                    console.log(res)
                });
            })
            .catch(error => {
                console.log(error);
            });
    }


    loadRentRecord(){
        CheckRentIng()
            .then(res => {
                this.setState({
                    rentrecords : res
                }, function(){
                    console.log(JSON.stringify(res))
                });
            })
            .catch(error => {
                console.log(error);
            });

    }


    loadUserProfile(username) {
        this.setState({
            isLoading: true
        });

        getUserProfile(username)
        .then(response => {
            this.setState({
                user: response,
                isLoading: false
            }, function(){
                console.log(response);
            });
        }).catch(error => {
            if(error.status === 404) {
                this.setState({
                    notFound: true,
                    isLoading: false
                });
            } else {
                this.setState({
                    serverError: true,
                    isLoading: false
                });        
            }
        });        
    }




/* 8/7일자 수정
    chargeCash(){
        chargeCash(parseInt(this.state.cash))
        chargeCash_user(parseInt(this.state.cash))
    }

    componentDidMount() {
        const username = this.props.match.params.username;
        this.loadUserProfile(username);
        this.loadFav(username);
        this.loadCashRecord();
        this.loadRentRecord();
    }
*/

    chargeCash = e => {
        e.preventDefault();
        var cash_yet = this.state.user.cash;
        var x = 0;
        if(parseInt(this.state.cash) != 0) {
            chargeCash(parseInt(this.state.cash)).then(
                res => {
                    this.setState({
                        isLoading: true
                    }, async function () {
                        while (true) { // mysql 유저정보 cash가 수정이 되었는지 확인
                            await getUserProfile(this.state.user.username)
                                .then(response => {
                                    console.log(response.cash)
                                    if (cash_yet != response.cash) {x = 1;}
                                })
                            if (x == 1) break; //수정이 되었으면  무한반복 종료
                            else continue;
                        }
                        if (x == 1) {
                            //user정보 다시 로드
                            this.componentDidMount()
                        }
                    });
            })
        }
    }
    
    chargeCash1000 = e => {
        e.preventDefault();
        var cash_yet = this.state.user.cash;
        var x = 0;
        if(parseInt("1000") != 0) {
            chargeCash(parseInt("1000")).then(
                res => {
                    this.setState({
                        isLoading: true
                    }, async function () {
                        while (true) { // mysql 유저정보 cash가 수정이 되었는지 확인
                            await getUserProfile(this.state.user.username)
                                .then(response => {
                                    console.log(response.cash)
                                    if (cash_yet != response.cash) {x = 1;}
                                })
                            if (x == 1) break; //수정이 되었으면  무한반복 종료
                            else continue;
                        }
                        if (x == 1) {
                            //user정보 다시 로드
                            this.componentDidMount()
                        }
                    });
            })
        }
    }


    chargeCash5000 = e => {
        e.preventDefault();
        var cash_yet = this.state.user.cash;
        var x = 0;
        if(parseInt("5000") != 0) {
            chargeCash(parseInt("5000")).then(
                res => {
                    this.setState({
                        isLoading: true
                    }, async function () {
                        while (true) { // mysql 유저정보 cash가 수정이 되었는지 확인
                            await getUserProfile(this.state.user.username)
                                .then(response => {
                                    console.log(response.cash)
                                    if (cash_yet != response.cash) {x = 1;}
                                })
                            if (x == 1) break; //수정이 되었으면  무한반복 종료
                            else continue;
                        }
                        if (x == 1) {
                            //user정보 다시 로드
                            this.componentDidMount()
                        }
                    });
            })
        }
    }


    chargeCash10000 = e => {
        e.preventDefault();
        var cash_yet = this.state.user.cash;
        var x = 0;
        if(parseInt("10000") != 0) {
            chargeCash(parseInt("10000")).then(
                res => {
                    this.setState({
                        isLoading: true
                    }, async function () {
                        while (true) { // mysql 유저정보 cash가 수정이 되었는지 확인
                            await getUserProfile(this.state.user.username)
                                .then(response => {
                                    console.log(response.cash)
                                    if (cash_yet != response.cash) {x = 1;}
                                })
                            if (x == 1) break; //수정이 되었으면  무한반복 종료
                            else continue;
                        }
                        if (x == 1) {
                            //user정보 다시 로드
                            this.componentDidMount()
                        }
                    });
            })
        }
    }


    chargeCash100000 = e => {
        e.preventDefault();
        var cash_yet = this.state.user.cash;
        var x = 0;
        if(parseInt("100000") != 0) {
            chargeCash(parseInt("100000")).then(
                res => {
                    this.setState({
                        isLoading: true
                    }, async function () {
                        while (true) { // mysql 유저정보 cash가 수정이 되었는지 확인
                            await getUserProfile(this.state.user.username)
                                .then(response => {
                                    console.log(response.cash)
                                    if (cash_yet != response.cash) {x = 1;}
                                })
                            if (x == 1) break; //수정이 되었으면  무한반복 종료
                            else continue;
                        }
                        if (x == 1) {
                            //user정보 다시 로드
                            this.componentDidMount()
                        }
                    });
            })
        }
    }
    
    componentDidMount() {
        const username = this.props.match.params.username;
        this.loadFav(username);
        this.loadCashRecord();
        this.loadRentRecord();
        this.loadUserProfile(username);
        this.setState({cash:''});
    }

    componentDidUpdate(nextProps) {
        if(this.props.match.params.username !== nextProps.match.params.username) {
            this.loadUserProfile(nextProps.match.params.username);
        }        
    }

    onChange=(e)=>{
        this.setState({cash:e.target.value});
    }

    render() {

        if(this.state.isLoading) {
            return <LoadingIndicator />;
        }

        if(this.state.notFound) {
            return <NotFound />;
        }

        if(this.state.serverError) {
            return <ServerError />;
        }

        const columns =[
            {
                title: '제목',
              dataIndex: 'title',
              key: 'title',
              render: (text, record) => <Link to={'/webtoon/' + record.webtoonId}>{text}</Link>
            },
            {
                title: 'Action',
                key: 'action',
                className: 'action',
                render: (text, record) => (
                  <span>
                    <Button onClick={()=>this.onDelete(record.fno)}>
                        삭제
                    </Button>
                  </span>
                ),
              }
        ]

        const columns1 =[
            {
                title: '날짜',
                dataIndex: 'createdAt',
                key: 'createdAt'
            },
            {
                title: '금액',
                key: 'change_amount',
                dataIndex: 'change_amount'
            },
            {
                title: '내용',
                key: 'content',
                dataIndex: 'content',

                render: (text, record) => (
                    <span>
                        {this.onChoice(record)}
                    </span>
                )

            },
            {
                title: '웹툰',
                key: 'toonname',
                dataIndex: 'toonname'
            },
            {
                title: '회차',
                key: 'epiname',
                dataIndex:'epiname'
            }
        ]


        const columns2 =[
            {
                title: '날짜',
                dataIndex: 'createdAt',
                key: 'createdAt'
            },
            {
                title: '웹툰',
                key: 'toonNumber',
                dataIndex: 'toonname'
            },
            {
                title: '회차',
                key: 'episodeNumber',
                dataIndex:'epiname'
            },
            {
                title: '',
                key: 'action',
                className: 'action',
                render: (text, record) => (
                    <span>
                    <Button className='seeButton' onClick={() => this.seeWebtoon(record.epino)}>
                        보러가기
                    </Button>
                  </span>
                )
            }
        ]


        return (
            <div class="main-container">
                { 
                    this.state.user ? (
                        <div class="wrap">        
                            <div class="greenContainer"></div>
                            <div class="shippingStatusContainer">
                                <div class="title"></div>
                                <div class="item">
                                    <div>
                                        <div class="green number">{this.state.user.cash}</div>
                                        <div class="text">보유 캐시</div>
                                    </div>
                                </div>           
                            </div>

                            <div class="listContainer">
                                <a href="#" class="item">
                                    <div class="icon">:</div>
                                    <div class="text"><FaCoins className="icon" size="20" color="red" onClick={this.chargeCash1000}/>1,000 캐시</div>
                                    <div class="text"></div>
                                    <div class="right2"> 1,000 원 </div>
                                    <div class="right2"> <Button type="primary" className="cashButton" onClick={this.chargeCash1000}>충전하기</Button></div>
                                </a>
                                <a href="#" class="item">
                                    <div class="icon">:</div>
                                    <div class="text"><FaCoins className="icon" size="20" color="red" onClick={this.chargeCash5000}/>5,000 캐시</div>
                                    <div class="text"></div>
                                    <div class="right1"> 5,000 원 </div>
                                    <div class="right2"> 4,500 원 </div>
                                    <div class="right2"> <Button type="primary" className="cashButton" onClick={this.chargeCash5000}>충전하기</Button></div>
                                </a>
                                <a href="#" class="item">
                                    <div class="icon">:</div>
                                    <div class="text"><FaCoins className="icon" size="20" color="red" onClick={this.chargeCash10000}/>10,000 캐시</div>
                                    <div class="text"></div>
                                    <div class="right1"> 10,000 원 </div>
                                    <div class="right2"> 9,000 원 </div>
                                    <div class="right2"> <Button type="primary" className="cashButton" onClick={this.chargeCash10000}>충전하기</Button></div>
                                </a>
                                <a href="#" class="item">
                                    <div class="icon">:</div>
                                    <div class="text"><FaCoins className="icon" size="20" color="red" onClick={this.chargeCash100000}/>100,000 캐시</div>
                                    <div class="text"></div>
                                    <div class="right1"> 100,000 원 </div>
                                    <div class="right2"> 85,000 원 </div>
                                    <div class="right2"> <Button type="primary" className="cashButton" onClick={this.chargeCash100000}>충전하기</Button></div>
                                </a>
                            </div>

                            
                            <div class="listContainer">
                                <div className="favTable_container">
                                    <div className="favTitle_container">
                                        <span className="favTitle">캐시 내역</span>
                                    </div>
                                    <Table dataSource={this.state.cashrecords} columns={columns1} pagination={{pageSize:10}}/>
                                </div>
                            </div>
                            <div class="listContainer">
                                <div className="favTable_container">
                                    <div className="favTitle_container">
                                        <span className="favTitle">웹툰 대여 내역</span>
                                    </div>
                                    <Table dataSource={this.state.rentrecords} columns={columns2} pagination={{pageSize:10}}/>
                                </div>
                            </div>
                        </div>
                    ): null               
                }</div>
        );
    }
}

export default withRouter(Cash);