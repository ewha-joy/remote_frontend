import { CardActions, CardContent, CardHeader, Typography, Button, } from '@material-ui/core';
import React from 'react';
import { Component } from 'react';
import caver from '../../../klaytn/caver'
import Loading from '../Loading'
import { DEPLOYED_ABI_TOKENSALES, DEPLOYED_ADDRESS_TOKENSALES } from '../../../constants/index'
import '../Card.css';
import { Spin, Icon } from 'antd';


const tsContract = new caver.klay.Contract(DEPLOYED_ABI_TOKENSALES, DEPLOYED_ADDRESS_TOKENSALES);

//현재 시간 받기 위함
var sampleTimestamp = Date.now(); //현재시간 타임스탬프 13자리 예)1599891939914
var date = new Date(sampleTimestamp); //타임스탬프를 인자로 받아 Date 객체 생성

var year = date.getFullYear().toString(); //년도 뒤에 두자리
var month = ("0" + (date.getMonth() + 1)).slice(-2); //월 2자리 (01, 02 ... 12)
var day = ("0" + date.getDate()).slice(-2); //일 2자리 (01, 02 ... 31)
var hour = ("0" + date.getHours()).slice(-2); //시 2자리 (00, 01 ... 23)
var minute = ("0" + date.getMinutes()).slice(-2); //분 2자리 (00, 01 ... 59)
var second = ("0" + date.getSeconds()).slice(-2); //초 2자리 (00, 01 ... 59)
var returnDate = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;

class AllCard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      disable: true,
      isLoading: false
    }
  }
  buyToken = async (tokenId, title, episode, author, dateCreated, order, price) => {

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
        body: JSON.stringify({
          rawTransaction: senderRawTransaction
        }),
      })
        .then((res) => res.json())
        .then((json) => {
          alert(json.transactionHash);
          this.setState({
            isLoading: false,
          })
        })

      await fetch("http://115.85.183.11:30070/update", {
        method: "put",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          title: title,
          episode: episode,
          author: author,
          dateCreated: dateCreated,
          date: returnDate
        }),
      })

        .then(
          window.location.reload())

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


  render() {
    const { tokenID, title, episode, author, dateCreated, order, price, owner, walletInstance, src } = this.props;
    const antIcon = <Icon type="loading-3-quarters" style={{ fontSize: 30 }} spin />;

    var walletaddress = walletInstance.toUpperCase();

    if (this.state.isLoading) return <Loading />

    if (price > 0) {
      return (
        <div className="card-container3">
          <div className="header">
            Token ID : {tokenID}
          </div>
          <div className="card-container2">
            {/* <CardHeader>{tokenID}</CardHeader> */}
            <img src={src} height='180' width='200' title={title}></img>
            <CardContent>
              <Typography variant="body1" component="p">
                title: {title}
                <br></br>
                episode: {episode}
                <br></br>
                author: {author}
                <br></br>
                dateCreated: {dateCreated}
                <br></br>
                serial#: {order}
                <br></br>
                price: {price}
              </Typography>
            </CardContent>
            <CardActions style={{ justifyContent: 'center' }}>
              {(owner === walletaddress)
                ? <Button variant='outlined' color='primary' >내 토큰</Button>
                : <Button variant='contained' color='secondary'
                  onClick={(e) => this.buyToken(tokenID, title, episode, author, dateCreated, order, price)}
                  disable={this.state.disable}>{price} Klay에 구매 </Button>}
            </CardActions>
          </div>
        </div>
      )


    } else {
      return (
        <div className="card-container3">
          <div className="header">
            Token ID : {tokenID}
          </div>
          <div className="card-container2">
            {/* <CardHeader>{tokenID}</CardHeader> */}
            <img src={src} height='180' width='200' title={title}></img>
            <CardContent>
              title: {title}
              <br></br>
              episode: {episode}
              <br></br>
              author: {author}
              <br></br>
              dateCreated: {dateCreated}
              <br></br>
              serial#: {order}
              <br></br>
            </CardContent>
            <CardActions style={{ justifyContent: 'center' }}>
              {(owner === walletaddress)
                ? <Button variant='outlined' color='primary' >내 토큰</Button>
                : null}
            </CardActions>
          </div>
        </div>
      )
    }

  }
}

export default AllCard;