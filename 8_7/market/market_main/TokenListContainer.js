import React, { Component } from 'react';
import './TokenListContainer.css';
import * as authActions from '../../redux/actions/auth'
import { connect } from 'react-redux'
import TokenList from './TokenList'


class TokenListContainer extends Component{
    

    render(){
        return (
            <div className="Coin__List__Container">
                <div className="Listing__Method">
                    <div className="Method">
                        <p 
                        // className={type === 'KRW' ? 'on' : ''} onClick={() => setType('KRW')}
                        >
                        조회 순
                        </p>
                    </div>
                </div>
                <TokenList/>
            </div>
        )
    }
}


export default React.memo(TokenListContainer);