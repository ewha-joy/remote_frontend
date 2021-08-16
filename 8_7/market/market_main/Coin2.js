import React, { useCallback, Component } from 'react';
import caver from '../../klaytn/caver'
import './Coin.css';
import Loading from '../components/Loading';
import { DEPLOYED_ABI, DEPLOYED_ADDRESS, 
    DEPLOYED_ABI_TOKENSALES, DEPLOYED_ADDRESS_TOKENSALES } from '../../constants';
    import { CardActions, CardContent, CardHeader, Card, TextField, Typography, Button, } from '@material-ui/core';
import { useSummaryDispatch } from './ExchangeContext';
import TokenListContainer from './TokenListContainer';
import TokenList from './TokenList';
import { Layout, Menu, Dropdown, Icon, Modal} from 'antd';
const { SubMenu } = Menu;
const { Header, Sider } = Layout;


const tsContract = new caver.klay.Contract(DEPLOYED_ABI_TOKENSALES, DEPLOYED_ADDRESS_TOKENSALES);

class Coin extends Component {
  
    state = {
      disable: true,
      isLoading: false,
    }

    // dispatch = useSummaryDispatch();
    // selectCoin = useCallback(() => {
    //   Coin.dispatch({
    //     tokenId : this.tokenId
    //   });
    // }, [tokenId, Coin.dispatch]);

  
    buyToken = async (tokenId, webtoonId, author, e) => {
  
      var price = await this.getTokenPrice(tokenId);
  
      if (price <= 0)
        return;
  
      try {
        this.setState({
          isLoading: true,
        })
        const sender = this.getWallet();
        
        // using the promise
        const { rawTransaction: senderRawTransaction } = await caver.klay.accounts.signTransaction({
          type: 'FEE_DELEGATED_SMART_CONTRACT_EXECUTION',
          from: sender.address,
          to: DEPLOYED_ADDRESS_TOKENSALES,
          data: tsContract.methods.purchaseToken(tokenId).encodeABI(),
          gas: '500000',
          value: price,
        }, sender.privateKey)
  
  
        await fetch("http://115.85.183.11:30070/", {
          method: "post",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({ rawTransaction: senderRawTransaction }), //textbox라는 객체를 보냄
        })
          .then((res) => res.json())
          .then((json) => {
            alert(json.transactionHash);
            window.location.reload();
            this.setState({
              isLoading: false,
            })
          });
  
      } catch (err) {
        console.error(err);
      }
    };
  
    getTokenPrice = async (tokenId) => {
      return await tsContract.methods.tokenPrice(tokenId).call();
    };
  
    getWallet = () => {
      try {
        if (caver.klay.accounts.wallet.length) {
  
          return caver.klay.accounts.wallet[0]
        }
      } catch (e) {
        console.error(e);
      }
    };

  
    // selectToken=()=>{
    //   this.setState({
    //     const [tokenId]:tokenId;
    //   })
    // }

    // selectToken = () => {
    //   this.setState({
    //     text: "변경 성공!",
    //   });
    // };

    render() {
      const { tokenID, src, webtoonId, title, episode, author, dateCreated, order, price, owner/*, walletInstance*/ } = this.props;

      //var walletaddress = walletInstance.toUpperCase();
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
              <span>{price} Clay</span>
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
  