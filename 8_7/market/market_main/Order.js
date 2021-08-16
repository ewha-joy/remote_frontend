import React, { Component } from 'react';
import './Order.css';
import * as authActions from '../../redux/actions/auth'
import { connect } from 'react-redux'
import Orderbook from './Orderbook'
import Trade from './Trade'


class Order extends Component{
    

    render(){
        return (
            <>
            <div className="Order__Box Section">
              <div className="Order__Inner">
                {/* <Orderbook setOrderbookData={setOrderbookData} code={code} />
                <Trade orderbookData={orderbookData} code={code} /> */}
                {/* <Orderbook/> */}
                <Trade/>
              </div>
            </div>
          </>
        )
    }
}


export default React.memo(Order);