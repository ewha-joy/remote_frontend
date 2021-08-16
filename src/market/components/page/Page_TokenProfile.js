import React from 'react';
import { Component } from 'react';

import './Page.css'
import caver from '../../../klaytn/caver'
import { connect } from 'react-redux';


import * as authActions from '../../../redux/actions/auth'


import { DEPLOYED_ABI, DEPLOYED_ADDRESS, 
  DEPLOYED_ABI_TOKENSALES, DEPLOYED_ADDRESS_TOKENSALES } from '../../../constants';


import Profile from '../profile/Profile'


class Page_TokenProfile extends Component {
  constructor(props) {
    super(props);
  }


  handleLogout = (e) => {

    const { logout } = this.props;
    logout();

  }


  render() {
    const { role } = this.props;
    return (
      <div>
        <Profile role={role}/>
      </div>
    )
  }
}


const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(authActions.logout()),
})

export default connect(null, mapDispatchToProps)(Page_TokenProfile);