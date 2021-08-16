import React from 'react';
import {Component} from 'react';
import AllCard from '../components/AllCard';
import Coin from './Coin_Desc';

class AllTokenList_Desc extends Component {
    render() {
      const { tokens } = this.props;

      tokens.sort(function (a, b) { 
        return a.price < b.price ? -1 : a.price > b.price ? 1 : 0;  
      });
      
      return (
        <div className="card-list">
          {tokens.map((token, idx) => {
              
            return <Coin
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
  
  export default AllTokenList_Desc;