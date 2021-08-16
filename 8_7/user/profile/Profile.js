import React, { Component } from 'react';
import NotFound from '../../common/NotFound';
import ServerError from '../../common/ServerError';
import LoadingIndicator  from '../../common/LoadingIndicator';
import {Avatar, Table, Button, Form, Input, notification} from 'antd';
import { getAvatarColor } from '../../util/Colors';
import {getUserProfile, chargeCash, getCashRecord, CheckRentIng, chargeCash_user} from '../../util/APIUtils';
import {fetchFav, deleteFavById} from '../../util/APIAdmin';
import {Link, withRouter} from "react-router-dom";
import "./Profile.css";

const { TextArea } = Input;



class Profile extends Component {
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



    /*  8/7일자 수정

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
            <div className="main-container">
                { 
                    this.state.user ? (
                        <div className="wrap">
                            <div class="greenContainer"></div>
                            <div class="ProfileContainer">
                                <div class="title">프로필 정보</div>
                                <div className="user-avatar">
                                        <Avatar className="user-avatar-circle" style={{ backgroundColor: getAvatarColor(this.state.user.name)}}>
                                            {this.state.user.name[0].toUpperCase()}
                                        </Avatar>
                                </div>
                                <div class="right1"><br></br>Full Name</div>
                                <div class="right2">{this.state.user.name}</div>
                                <div class="right1"><br></br>User Name</div>
                                <div class="right2">@{this.state.user.username}</div>
                            </div>
                            <div class="ProfileContainer">
                            </div>
                        </div>
                    ): null               
                }
            </div>
        );
    }
}

export default withRouter(Profile);