import React from 'react';
import { Component } from 'react';

import '../Page.css'
import { connect } from 'react-redux';

import * as authActions from '../../../redux/actions/auth'

import TokenTabs from '../tokentabs/TokenTabs_MyToken'



class Page_MyToken extends Component {
  constructor(props) {
    super(props);
  }


  handleLogout = (e) => {

    const { logout } = this.props;
    logout();

  }
  

  render() {
    return (
      <div class="wrap">
      <div class="main-container">
        <div class="greenContainer"></div>
        <div class="TokenContainer">
          <div class="title">내 토큰</div>
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

export default connect(null, mapDispatchToProps)(Page_MyToken);