import React, { Component } from 'react';
import './TokenSummary.css';
import * as authActions from '../../redux/actions/auth'
import { connect } from 'react-redux'
import Coin from './Coin';
import AllCard_main from './AllCard_main';

class TokenSummary extends Component{
  render() {
    const { tokens } = this.props;
    
    return (
      <div className="Coin__Summary">
        {tokens.slice(0,6).map((token, idx) => {
            
          return <AllCard_main
              key={idx}
              tokenID={token.tokenId}
              src={token.src}
              webtoonId={token.webtoonId}
              title={token.title}
              episode={token.episode}
              author={token.author}
              dateCreated={token.dateCreated}
              order={token.order}
              price={token.price}
              owner={token.owner}
              // walletInstance={token.walletInstance}
          />
        })}
      </div>
    )
  }
}


export default TokenSummary;