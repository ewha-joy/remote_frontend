import React, { Component } from 'react';
import './Market.css';
import TokenListContainer from './market_main/TokenListContainer'
import TokenRecommend from './market_main/TokenRecommend';

class Market extends Component{
    

    render(){

        return (
            <div className="Trading__Simulator">
                <TokenListContainer/>
                <TokenRecommend/>
            </div>
        )
    }
}


export default Market;