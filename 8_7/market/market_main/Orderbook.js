import React, { Component } from 'react';
import './Orderbook.css';
import * as authActions from '../../redux/actions/auth'
import { connect } from 'react-redux'


class Orderbook extends Component{
    

    render(){
        return (
            <div className="Orderbook__Wrap">
                <div className="Orderbook">
                    {/* {orderbook_units.reverse().map(list => (
                        <OrderbookList
                        ask_price={list.ask_price}
                        ask_size={list.ask_size}
                        key={list.ask_price}
                        code={code}
                        setOrderbookData={setOrderbookData}
                        />
                    ))} */}
                    {/* {orderbook_units.reverse().map(list => (
                        <OrderbookList
                        bid_price={list.ask_price}
                        bid_size={list.bid_size}
                        key={list.bid_price}
                        code={code}
                        setOrderbookData={setOrderbookData}
                    />
                    ))} */}
                </div>
            </div>
        )
    }
}


export default React.memo(Orderbook);