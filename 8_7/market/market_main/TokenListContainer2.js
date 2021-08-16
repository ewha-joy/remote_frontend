import React, { Component, useState } from 'react';
import './TokenListContainer.css';
import * as authActions from '../../redux/actions/auth'
import { connect } from 'react-redux'
import TokenList_Asc from './TokenList_Asc'
import TokenList_Desc from './TokenList_Desc'
import TokenList from './TokenList'

const TokenListContainer2 = () => {
    const [type, setType] = useState('DEFAULT');
    return (
      <div className="Coin__List__Container">
        <div className="Listing__Method">
        <div className="Method">
            <p 
                className={type === 'DEFAULT' ? 'on' : ''} 
                onClick={() => setType('DEFAULT')}
            >
            조회 순
            </p>
          </div>
          <div className="Method">
            <p 
                className={type === 'ASC' ? 'on' : ''} 
                onClick={() => setType('ASC')}
            >
            높은 가격 순
            </p>
          </div>
          <div className="Method">
            <p
                className={type === 'DESC' ? 'on' : ''}
                onClick={() => setType('DESC')}
            >
            낮은 가격 순
            </p>
          </div>
        </div>
        {type === 'DEFAULT' ? <TokenList /> : null}
        {type === 'ASC' ? <TokenList_Asc /> : null}
        {type === 'DESC' ? <TokenList_Desc /> : null}
      </div>
    );
  };
  
  export default TokenListContainer2;