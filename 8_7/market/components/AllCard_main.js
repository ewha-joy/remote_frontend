import { CardActions, CardContent, CardHeader, Typography, Button, } from '@material-ui/core';
import React from 'react';
import { Component } from 'react';
import caver from '../../klaytn/caver'
import Loading from './Loading'
import { DEPLOYED_ABI_TOKENSALES, DEPLOYED_ADDRESS_TOKENSALES } from '../../constants/index'
import { fetchEpiThumbnailById } from '../../util/APIAdmin'
import './AllCard_main.css';


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

class AllCard_main extends Component {
  constructor(props) {
    super(props)
    this.state = {
      disable: true,
      isLoading: false,
      src: null,
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
          window.location.reload();
          this.setState({
            isLoading: false,
          })
        })
        .then(
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
        );



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

  loadEpiThumbnail() {
    const { series } = this.props;
    // var eno = series.split('-')
    // fetchEpiThumbnailById(parseInt(eno[1], 10))
    //   .then((res) => {
    //     try {
    //       this.setState({
    //         src: res.fileUri
    //       })
    //     } catch (e) {
    //       console.log(e)
    //     }
    //   });
  }

  componentWillMount = async () => {
    if(this.state.src == null)
      await this.loadEpiThumbnail()
  }

  // componentDidMount = async () => {
  //   await this.loadEpiThumbnail();
    
  //   await fetch("http://115.85.183.11:30070/vRank", {
  //     method: "post",
  //     headers: {
  //       "content-type": "application/json",
  //     },
  //     body: JSON.stringify({
  //        startDate: '2021-07-29', //29, 30일 조회!! 31일 포함X
  //        endDate: '2021-07-31'}),
  //   }).then((res) => res.json())
  //   .then((json) => {
  //       console.log(json)
  //   });
  // }
  render() {
    const { tokenID, title, webtoonId, episode, author, dateCreated, order, price, owner, walletInstance } = this.props;

    // var walletaddress = walletInstance.toUpperCase();

    if (this.state.isLoading) return <Loading />

    if (price > 0) {
      return (
        <div className="card-container_main">
          <div className="header_main">
          {tokenID} : {webtoonId}
          </div>
          <div className="card-container2_main">
          <img src={this.state.src}  height='180' width='200' title={title}></img>
          </div>
        </div>
      )


    } else {
      return (
        <div className="card-container_main">
          <div className="header_main">
          {tokenID} : {webtoonId}
          </div>
          <div className="card-container2_main">
          <img src={this.state.src}  height='180' width='200' title={title}></img>
          </div>
        </div>
      )
    }

  }
}

export default React.memo(AllCard_main);