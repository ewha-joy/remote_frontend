import React, { Component } from 'react';
import './Coin.css';

class Coin extends Component {


  render() {
    const { title, epi_title, artist, volume } = this.props;

    return (
      <div>
        <div className="Coin">
          <div className="Coin__Name">
            <p>{title}</p>
            <span>{epi_title}</span>
          </div>
          {/* <div className="Coin__Price">
            <span>{epi_title}</span>
          </div> */}
          <div className="Coin__Change__Price">
            <span>{artist}</span>
          </div>
          <div className="Coin__Volume">
            <span>{volume}</span>
          </div>
        </div>
      </div>
    )

  }
}

export default React.memo(Coin);
