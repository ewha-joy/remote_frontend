import React from 'react';
import { Component } from 'react';

import '../Page.css'
import { connect } from 'react-redux';

import { fetchToonAuthor } from "../../../util/APIAuthor";
import { Table, Divider, Button } from 'antd';
import {Link, withRouter} from "react-router-dom";

import * as authActions from '../../../redux/actions/auth'

class Page_TokenIssuance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tokenstate: '',
      totaltokenstate: '',
      update: false,
      webtoons: []
    }
  }

  update = () => {

    const walletFromSession = sessionStorage.getItem('walletInstance');
    //console.log(walletFromSession);

    this.setState({
      update: true,
    })

  }

  componentDidMount() {
    this.loadToon();
  }

  loadToon() {
    fetchToonAuthor()
      .then((res) => {
        this.setState({ webtoons: res }, function () {
          //console.log(this.state)
        })
      });
  }

  handleLogout = (e) => {

    const { logout } = this.props;
    logout();

  }

  move(record){
    return(<Link to={'tokenissuance_Epi/' + record}/>)
  }

  render() {
    if (!this.state.update) this.update();
    if (this.props.role === "ROLE_AUTHOR") {

      const columns = [
        {
          title: '제목',
          dataIndex: 'title',
          key: 'title',
        },
        {
          title: '작가',
          dataIndex: 'artist',
          key: 'artist',
        },
        {
          title: '요일',
          dataIndex: 'day',
          key: 'day',
        },
        {
          title: '장르',
          dataIndex: 'genre',
          key: 'genre',
        },
        {
          title: '업데이트',
          dataIndex: 'createdAt',
          key: 'createdAt',
        },
        {
          title: '',
          key: 'action',
          className: 'action',
          render: (text, record) => (
            <span>
              <Button>
                <Link to={'tokenissuance_Epi/' + record.tno}>에피소드</Link>
              </Button>
            </span>
          ),
        }
      ];


      return (
        <div class="wrap">
          <div class="main-container">
            <div class="greenContainer"></div>
            <div class="TokenContainer">
              <div class="title">발행 가능한 웹툰 목록</div>
              <div className="editList-container">
                <Table 
                dataSource={this.state.webtoons} 
                columns={columns} 
                pagination={{ pageSize: 8 }}
                onRow={(record) => ({
                  onClick: () =>  this.props.history.push('tokenissuance_Epi/'+`${record.tno}`)
                })}
                 />
              </div>
            </div>
          </div>
        </div>
      )
    }
    else {
      return (
        <div>
          <label>
          토큰 발행은 작가만 할 수 있습니다.<br/>
          JOY TOON 웹툰 계정을 통한 작가 인증이 필요합니다.
          </label>
          <Link to="/tokenissuance/login">Login</Link>
        </div>
      )
    }


  }
}


const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(authActions.logout()),
})

export default connect(null, mapDispatchToProps)(withRouter(Page_TokenIssuance));