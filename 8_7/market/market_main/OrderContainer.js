import React, { Component } from 'react';
import * as authActions from '../../redux/actions/auth'
import { connect } from 'react-redux'
import Order from './Order'

const OrderContainer = () => {
    // const state = useSummaryState();
    // const { code, name } = state;
    return (
        <Order/>
    );
  };
  
  export default OrderContainer;