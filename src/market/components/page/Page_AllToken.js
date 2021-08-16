import React from 'react';
import { Component } from 'react';
import './Page.css'
import { connect } from 'react-redux';
import * as authActions from '../../../redux/actions/auth'
import AllCardOnSale from '../alltoken/AllCardOnSale';
import AllCardList from '../alltoken/AllCardList';

class Page_AllToken extends Component {
  constructor(props) {
    super(props);

  }



  handleLogout = (e) => {

    const { logout } = this.props;
    logout();

  }
  

  render() {
    return (
          <div className='AllTokenContainer'>
            <AllCardList />

            <AllCardOnSale/>
          </div>
    )
  }
}


const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(authActions.logout()),
})

export default connect(null, mapDispatchToProps)(Page_AllToken);