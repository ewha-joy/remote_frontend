import React, { useCallback, Component } from 'react';
import './Coin.css';


class Coin extends Component {
  
    state = {
      disable: true,
      isLoading: false,
    }


    render() {
      const { webtoonId, title, episode,order, price } = this.props;

      if (this.state.isLoading) return <Loading />
  
      if (price > 0) {
        return (
          <div className="Coin">
          <div className="Coin__Name">
              <p>{webtoonId}</p>
              <span>{title}</span>
          </div>
          <div className="Coin__Price">
              {/* <p>{webtoonId}</p> */}
              <span>{episode}</span>
          </div>
          <div className="Coin__Change__Price">
              {/* <p>{order}</p> */}
              <span>{order}</span>
          </div>
          <div className="Coin__Volume">
            <div className="price1">
              <span>{price} Klay</span>
            </div>
          </div>
          </div>
        )
  
      } else {
        return ("")
      }  
    }
  }
  
  export default React.memo(Coin);
  