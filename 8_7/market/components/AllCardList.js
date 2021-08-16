import React from 'react';
import { Component } from 'react';
import AllCard from './AllCard';
import Loading from './Loading'
import caver from '../../klaytn/caver'

import {
  DEPLOYED_ABI, DEPLOYED_ADDRESS,
  DEPLOYED_ABI_TOKENSALES, DEPLOYED_ADDRESS_TOKENSALES
} from '../../constants';

const wttContract = new caver.klay.Contract(DEPLOYED_ABI, DEPLOYED_ADDRESS);
const tsContract = new caver.klay.Contract(DEPLOYED_ABI_TOKENSALES, DEPLOYED_ADDRESS_TOKENSALES);


class AllCardList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      totaltokenstate: '',
      alltokens: [],
      update: false,
      isLoading: false,
    }
  }

  update = async () => {
    const walletFromSession = sessionStorage.getItem('walletInstance');
    this.changeUI(JSON.parse(walletFromSession));

    this.setState({
      update: true,
    })
  }

  changeUI = async (walletInstance) => {
    await this.displayAllTokens(walletInstance);
  }

  displayAllTokens = async (walletInstance) => {

    var totalSupply = parseInt(await this.getTotalSupply());
    var tokenList = new Array();

    if (totalSupply === 0) {
      this.setState({
        totaltokenstate: '현재 발행된 토큰이 없습니다'
      })
    } else {

      for (var i = 0; i < totalSupply; i++) {


        var tokenId = await this.getTokenByIndex(i);
        var wtt = await this.getWTT(tokenId);
        var price = await this.getTokenPrice(tokenId);
        var owner = await this.getOwnerOf(tokenId);

        var data = new Object();
        data.tokenId = tokenId;
        data.title = wtt[0];
        data.episode = wtt[1];
        data.author = wtt[2];
        data.dateCreated = wtt[3];
        data.order = wtt[4];
        data.series = wtt[5];
        data.price = parseFloat(caver.utils.fromPeb(price, 'KLAY') + "KLAY");
        data.owner = owner.toUpperCase();
        data.walletInstance = walletInstance.address;


        tokenList.push(data);
      }
    }
    this.setState({
      alltokens: tokenList
    })
  }

  getTotalSupply = async () => {
    return await wttContract.methods.totalSupply().call();
  }
  getOwnerOf = async (tokenId) => {
    return await wttContract.methods.ownerOf(tokenId).call();
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


  render() {
    if (!this.state.update) this.update();
    if (this.state.isLoading) return <Loading />
    return (
      <div className="card-list">
        {this.state.alltokens.map((token, idx) => {

          return <AllCard
            key={idx}
            tokenID={token.tokenId}
            src={token.src}
            title={token.title}
            episode={token.episode}
            author={token.author}
            dateCreated={token.dateCreated}
            order={token.order}
            series={token.series}
            price={token.price}
            owner={token.owner}
            walletInstance={token.walletInstance}
          />
        })}
      </div>
    )


  }
}

export default AllCardList;