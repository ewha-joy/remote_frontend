import React, { Component } from 'react';
import './TokenDetail.css';
import * as authActions from '../../redux/actions/auth'

import TokenSummary from './TokenSummary';
import caver from '../../klaytn/caver'
import { DEPLOYED_ABI, DEPLOYED_ADDRESS, 
    DEPLOYED_ABI_TOKENSALES, DEPLOYED_ADDRESS_TOKENSALES } from '../../constants';
    
const wttContract = new caver.klay.Contract(DEPLOYED_ABI, DEPLOYED_ADDRESS);
const tsContract = new caver.klay.Contract(DEPLOYED_ABI_TOKENSALES, DEPLOYED_ADDRESS_TOKENSALES);
    


class TokenDetail extends Component{
    constructor(props) {
        super(props);
        this.state = {
          totaltokenstate: '',
          alltokens: [],
          update: false,
          seriesList:[],
        }
      }
    
      update = () => {

        const walletFromSession = sessionStorage.getItem('walletInstance');
        this.changeUI(JSON.parse(walletFromSession));
        
        this.setState({
          update: true,
        })
    
      }
    
      changeUI = async (walletInstance) => {
        await this.displayAllTokens(walletInstance);
        await this.getKlay(walletInstance);
      }
    
    
      displayAllTokens = async (walletInstance) => {
    
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
              var owner = await this.getOwnerOf(tokenId);
    
              var data = new Object();
              data.tokenId = tokenId;
              data.webtoonId = wtt[0];
              data.title = wtt[1];
              data.episode = wtt[2];
              data.author = wtt[3];
              data.dateCreated = wtt[4];
              data.order = wtt[5];
              data.price = parseFloat(caver.utils.fromPeb(price, 'KLAY') + "KLAY");
              data.owner = owner.toUpperCase();
              // data.walletInstance = walletInstance.address;
    
    
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
    
      getWallet = () => {
        try {
    
          if (caver.klay.accounts.wallet.length) {
            return caver.klay.accounts.wallet[0]
          }
    
        } catch (e) {
          console.error(e);

          
        }
      };
    
      getOwnerOf = async (tokenId) => {
        return await wttContract.methods.ownerOf(tokenId).call();
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
      getBalanceOf = async function (address) {
        return await wttContract.methods.balanceOf(address).call();
      }
      getWTT = async (tokenId) => {
        return await wttContract.methods.getWTT(tokenId).call();
      }
      getKlay = (walletInstance) => {
        if (!walletInstance) return
        caver.klay.getBalance(walletInstance.address).then((klay) => {
          this.setState({
            klay: caver.utils.fromWei(klay),
          })
        })
      }




    render(){
        if (!this.state.update) this.update();
        const { tokens } = this.props;
        return (
        <div className="Token__Detail">
          추천 웹툰
          <div classNmae="Token_Recommend">
          <TokenSummary tokens={this.state.alltokens}/>
          </div>
        </div>
        )
    }
}



const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(authActions.logout()),
})

export default React.memo(TokenDetail);