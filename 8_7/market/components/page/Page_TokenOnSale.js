import React from 'react';
import { Component } from 'react';

import '../Page.css'
import { connect } from 'react-redux';


import * as authActions from '../../../redux/actions/auth'

import TokenTabs from '../tokentabs/TokenTabs_TokenOnSale'


class Page_TokenOnSale extends Component {
  constructor(props) {
    super(props);
  }


 
  handleLogout = (e) => {

    const { logout } = this.props;
    logout();

  }

 
  render() {
    return (
      <div className="wrap">
      <div className="main-container">
        <div className="greenContainer"></div>
        <div className="TokenContainer">
          <div className="title">내 판매중 토큰</div>
          <TokenTabs />
        </div>
      </div>
    </div>
    )
  }
}


const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(authActions.logout()),
})

export default connect(null, mapDispatchToProps)(Page_TokenOnSale);