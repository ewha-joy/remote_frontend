import React, { Component } from 'react';
import './Market.css';
import * as authActions from '../redux/actions/auth'
import { connect } from 'react-redux'
import TokenDetail from './market_main/TokenDetail'
import TokenListContainer from './market_main/TokenListContainer'
import TokenListContainer2 from './market_main/TokenListContainer2'

class Market extends Component{
    

    render(){

        return (
            <div className="Trading__Simulator">
                <TokenDetail/>
                {/* <TokenListContainer/> */}
                <TokenListContainer2/>
            </div>
        )
    }
}


export default Market;