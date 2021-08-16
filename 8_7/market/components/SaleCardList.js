import React from 'react';
import { Component } from 'react';
import SaleCard from './SaleCard';
import caver from '../../klaytn/caver'

import {
  DEPLOYED_ABI, DEPLOYED_ADDRESS,
  DEPLOYED_ABI_TOKENSALES, DEPLOYED_ADDRESS_TOKENSALES
} from '../../constants';

const wttContract = new caver.klay.Contract(DEPLOYED_ABI, DEPLOYED_ADDRESS);
const tsContract = new caver.klay.Contract(DEPLOYED_ABI_TOKENSALES, DEPLOYED_ADDRESS_TOKENSALES);


class SaleCardList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      totaltokenstate: '',
      mysaletokens: [],
      update: false,
    }
  }

  update = async () => {
    const walletFromSession = sessionStorage.getItem('walletInstance');
    //console.log(walletFromSession);
    this.changeUI(JSON.parse(walletFromSession));

    this.setState({
      update: true,
    })

  }

  changeUI = async (walletInstance) => {
    await this.displayMyTokensAndSale(walletInstance);
  }

  displayMyTokensAndSale = async (walletInstance) => {

    var balance = parseInt(await this.getBalanceOf(walletInstance.address));
    var tokenList = new Array();

    if (balance === 0) {
      this.setState({
        tokenstate: "현재 발행된 토큰이 없습니다."
      })
    } else {
      for (var i = 0; i < balance; i++) {

          var tokenId = await this.getTokenOfOwnerByIndex(walletInstance.address, i);
          var wtt = await this.getWTT(tokenId);
          var price = await this.getTokenPrice(tokenId);
          if (price > 0) {
            var data = new Object();
            data.tokenId = tokenId;
            data.title = wtt[0];
            data.episode = wtt[1];
            data.author = wtt[2];
            data.dateCreated = wtt[3];
            data.order = wtt[4];
            data.series = wtt[5];
            data.price = parseFloat(caver.utils.fromPeb(price, 'KLAY') + "KLAY");

            tokenList.push(data);
          }
        }
    }
    this.setState({
      mysaletokens: tokenList
    })
  }

  getTokenByIndex = async (index) => {
    return await wttContract.methods.tokenByIndex(index).call();
  }
  getTokenPrice = async (tokenId) => {
    return await tsContract.methods.tokenPrice(tokenId).call();
  }
  getBalanceOf = async function (address) {
    return await wttContract.methods.balanceOf(address).call();
  }
  getWTT = async (tokenId) => {
    return await wttContract.methods.getWTT(tokenId).call();
  }
  getTokenOfOwnerByIndex = async (address, index) => {
    return await wttContract.methods.tokenOfOwnerByIndex(address, index).call();
  }

  componentDidMount(){
    if (!this.state.update) this.update();
  }
  render() {
    return (
      <div className="card-list">
        {this.state.mysaletokens.map((token, idx) => {
          return <SaleCard
            key={idx}
            tokenID={token.tokenId}
            title={token.title}
            episode={token.episode}
            author={token.author}
            dateCreated={token.dateCreated}
            order={token.order}
            series={token.series}
            price={token.price}
          />
        })}
      </div>
    )


  }
}

export default SaleCardList;