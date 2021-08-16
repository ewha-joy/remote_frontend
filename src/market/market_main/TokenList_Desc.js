import React, { Component, useState } from 'react';
import './TokenList.css';
import * as authActions from '../../redux/actions/auth'
import caver from '../../klaytn/caver'
import AllTokenList from './AllTokenList_Desc';
import { DEPLOYED_ABI, DEPLOYED_ADDRESS, 
    DEPLOYED_ABI_TOKENSALES, DEPLOYED_ADDRESS_TOKENSALES } from '../../constants';
    
const wttContract = new caver.klay.Contract(DEPLOYED_ABI, DEPLOYED_ADDRESS);
const tsContract = new caver.klay.Contract(DEPLOYED_ABI_TOKENSALES, DEPLOYED_ADDRESS_TOKENSALES);
  

class TokenList_Desc extends Component{
  constructor(props) {
      super(props);
      this.state = {
        totaltokenstate: '',
        alltokens: [],
        update: false,
      }
    }
  
    update = () => {

      this.changeUI();
      
      this.setState({
        update: true,
      })
  
    }
  
    changeUI = async () => {
      await this.displayAllTokens();
    }
  
  
    displayAllTokens = async () => {
  
      var totalSupply = parseInt(await this.getTotalSupply());
  
      if (totalSupply === 0) {
        this.setState({
          totaltokenstate: '현재 발행된 토큰이 없습니다'
        })
      } else {
        var tokenList = new Array();
  
        for (var i = 0; i < totalSupply; i++) {
  
          (async () => {
            var tokenId = await this.getTokenByIndex(i);
            var wtt = await this.getWTT(tokenId);
            var price = await this.getTokenPrice(tokenId);
  
            var data = new Object();
            data.tokenId = tokenId;
            data.webtoonId = wtt[0];
            data.title = wtt[1];
            data.episode = wtt[2];
            data.author = wtt[3];
            data.dateCreated = wtt[4];
            data.order = wtt[5];
            data.price = parseFloat(caver.utils.fromPeb(price, 'KLAY') + "KLAY");
  
            tokenList.push(data);
  
            this.setState({
              alltokens: tokenList
            })
  
          })();
        }
      }
    }
  
    handleLogout = (e) => {
  
      const { logout } = this.props;
      logout();
  
    }
  
    getTotalSupply = async () => {
      return await wttContract.methods.totalSupply().call();
    }
    getTokenByIndex = async (index) => {
      return await wttContract.methods.tokenByIndex(index).call();
    }
    getTokenPrice = async (tokenId) => {
      return await tsContract.methods.tokenPrice(tokenId).call();
    }
    getWTT = async (tokenId) => {
      return await wttContract.methods.getWTT(tokenId).call();
    }


    render(){
        if (!this.state.update) this.update();
        const { tokens } = this.props;
        return (
        <div className="Coin__List">
            <div className="List__Head">
                <div className="Coin__Name">
                    <span>웹툰명</span>
                </div>
                <div className="Coin__Price">
                    <span>작가</span>
                </div>
                <div className="Coin__Change__Price">
                    <span>토큰넘버</span>
                </div>
                <div className="Coin__Volume">
                    <span>가격</span>
                </div>
            </div>
            <div className="Coins">
                <AllTokenList tokens={this.state.alltokens} />
            </div>
        </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(authActions.logout()),
})

export default React.memo(TokenList_Desc);