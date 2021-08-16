import React, { Component } from 'react';
import './Trade.css';
import * as authActions from '../../redux/actions/auth'
import { connect } from 'react-redux'


class Trade extends Component{
    

    render(){
        return (
        <div className="Trade__Box">
            <div className="Trade__Head">
                <div className="Trade__Method">
                    <p>구매</p>
                </div>
            </div>
            {/* <div className="Trade__Head">
                <div className="Trade__Method">
                    <p>매도</p>
                </div>
            </div> */}

            {/* <TradeForm type={type} orderbookData={orderbookData} code={code} /> */}
        </div>
        
        )
    }
}


export default React.memo(Trade);