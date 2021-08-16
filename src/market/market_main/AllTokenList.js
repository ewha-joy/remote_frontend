import React from 'react';
import {Component} from 'react';
import Coin from './Coin';

class AllTokenList extends Component {
    render() {
      const { tokens } = this.props;

        return (
          <div className="card-list">
            {tokens.slice(0,10).map((token, idx) => {

              return <Coin
                  key={idx}
                  title={token.title}
                  epi_title={token.epi_title}
                  artist={token.artist}
                  volume={token.volume}
              />
            })}
          </div>
        )
      }
  }
  
  export default AllTokenList;