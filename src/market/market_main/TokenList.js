import React, { Component } from 'react';
import './TokenList.css';
import * as authActions from '../../redux/actions/auth'
import './Coin.css';
import AllTokenList from './AllTokenList';

class TokenList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      totaltokenstate: '',
      alltokens: [],
      update: false,
    }
  }

  handleLogout = (e) => {

    const { logout } = this.props;
    logout();

  }

  toStringByFormatting(term) {
    var date = Date.now();
    var today = new Date(date);
    today.setDate(today.getDate() + term);
    var year = today.getFullYear().toString(); //년도 뒤에 두자리
    var month = ("0" + (today.getMonth() + 1)).slice(-2); //월 2자리 (01, 02 ... 12)
    var day = ("0" + today.getDate()).slice(-2); //일 2자리 (01, 02 ... 31)
    return year + "-" + month + "-" + day
  }

  componentWillMount = async () => {

    const rank = await fetch("http://115.85.183.11:30070/vRank", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        startDate: this.toStringByFormatting(-14), //현재 - 7일
        endDate: this.toStringByFormatting(1)     //현재 + 1일 => 전일 거래량 조회
      }),
    }).then((res) => {
      return res.json(); //Promise 반환
    })
    
    this.setState({
      rank: rank
    })
  }

  render() {
    if(this.state.rank != null){
    return (
      <div className="Coin__List">
        <div className="List__Head">
          <div className="Coin__Name">
            <span>웹툰명</span>
          </div>
          <div className="Coin__Change__Price">
            <span>작가</span>
          </div>
          <div className="Coin__Volume">
            <span>거래량</span>
          </div>
        </div>

        <div className="Coins">
          <AllTokenList tokens={this.state.rank} />
        </div>
      </div>
    )}else {
      return(
        <div>Loading...</div>
      )
    }
  }
}

const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(authActions.logout()),
})

export default React.memo(TokenList);
