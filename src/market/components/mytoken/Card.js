import { CardActions, CardContent, CardHeader, Button } from '@material-ui/core';
import React from 'react';
import { Component } from 'react';
import { Spin, Icon } from 'antd';
import caver from '../../../klaytn/caver'
import {
  DEPLOYED_ABI, DEPLOYED_ADDRESS,
  DEPLOYED_ABI_TOKENSALES, DEPLOYED_ADDRESS_TOKENSALES
} from '../../../constants';
import { fetchEpiThumbnailById } from "../../../util/APIAdmin";
import '../Card.css'

const tsContract = new caver.klay.Contract(DEPLOYED_ABI_TOKENSALES, DEPLOYED_ADDRESS_TOKENSALES);
const wttContract = new caver.klay.Contract(DEPLOYED_ABI, DEPLOYED_ADDRESS);

class Card extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputprice: 0,
      isLoading: false,
      approve: false,
      originThumbnail: '',
      src: null,
      price: this.props.price
    }
  }

  handleInput = (e) => {
    this.setState({
      inputprice: e.target.value
    })
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

  approveEach = async () => {
    try {
      this.setState({
        isLoading: true,
        approve: true
      })
      const { tokenID } = this.props;
      const sender = this.getWallet();

      // using the promise
      const { rawTransaction: senderRawTransaction } = await caver.klay.accounts.signTransaction({
        type: 'FEE_DELEGATED_SMART_CONTRACT_EXECUTION',
        from: sender.address,
        to: DEPLOYED_ADDRESS,
        data: wttContract.methods.approve(DEPLOYED_ADDRESS_TOKENSALES, tokenID).encodeABI(),
        gas: '250000',
        value: caver.utils.toPeb('0', 'KLAY'),
      }, sender.privateKey)

      await fetch("http://115.85.183.11:30070/", {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ rawTransaction: senderRawTransaction }),
      })
        .then((res) => res.json())
        .then((json) => {
          this.setState({
            isLoading: false
          })
        });

    } catch (err) {
      console.error(err);
    }

  };

  removeTokenOnSaleEach = async () => {
    this.setState({
      isLoading: true,
      inputprice: 0
    })

    const { tokenID } = this.props;
    const sender = this.getWallet();

    var balance = parseInt(await this.getBalanceOf(sender.address));
    var price = await this.getTokenPrice(tokenID);

    if (price > 0 && balance > 0) {
      const { rawTransaction: senderRawTransaction } = await caver.klay.accounts.signTransaction({
        type: 'FEE_DELEGATED_SMART_CONTRACT_EXECUTION',
        from: sender.address,
        to: DEPLOYED_ADDRESS_TOKENSALES,
        data: tsContract.methods.removeTokenOnSaleEach(tokenID).encodeABI(),
        gas: '250000',
        value: caver.utils.toPeb('0', 'KLAY'),
      }, sender.privateKey);


      await fetch("http://115.85.183.11:30070/", {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ rawTransaction: senderRawTransaction }),
      })
        .then((res) => res.json())
        .then((json) => {
          this.cancelApprovalEach();
          this.setState({
            isLoading: false
          })
          alert(json.transactionHash);
        });


      var AfterPrice = await this.getTokenPrice(tokenID);
      this.setState({
        price: caver.utils.fromPeb(AfterPrice, 'KLAY'),
      });

    }
  }

  cancelApprovalEach = async () => {
    try {
      this.setState({
        isLoading: true,
        approve: false,
        inputprice: 0
      })

      const { tokenID } = this.props;
      const sender = this.getWallet();

      const { rawTransaction: senderRawTransaction } = await caver.klay.accounts.signTransaction({
        type: 'FEE_DELEGATED_SMART_CONTRACT_EXECUTION',
        from: sender.address,
        to: DEPLOYED_ADDRESS,
        data: wttContract.methods.approve("0x0000000000000000000000000000000000000000", tokenID).encodeABI(),
        gas: '250000',
        value: caver.utils.toPeb('0', 'KLAY'),
      }, sender.privateKey)


      await fetch("http://115.85.183.11:30070/", {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ rawTransaction: senderRawTransaction }),
      })
        .then((res) => res.json())
        .then((json) => {
          //alert(json.transactionHash);
          this.setState({
            isLoading: false
          })
        });

    } catch (e) {
      console.log(e)
    }
  }


  getApproved = async (tokenId) => {
    return await wttContract.methods.getApproved(tokenId).call();
  }
  getBalanceOf = async function (address) {
    return await wttContract.methods.balanceOf(address).call();
  }
  getTokenPrice = async (tokenId) => {
    return await tsContract.methods.tokenPrice(tokenId).call();
  }


  loadEpiThumbnail() {
    const { series } = this.props;
    var eno = series.split('-')
    fetchEpiThumbnailById(parseInt(eno[1], 10))
      .then((res) => {
        try {
          this.setState({
            src: res.fileUri
          })
        } catch (e) {
          console.log(e)
        }
      });
  }

  sellToken = async (tokenId, e) => {
    const { inputprice } = this.state;

    if (inputprice <= 0)
      return;

    try {
      this.setState({
        isLoading: true,
      })

      const sender = this.getWallet();
      const { rawTransaction: senderRawTransaction } = await caver.klay.accounts.signTransaction({
        type: 'FEE_DELEGATED_SMART_CONTRACT_EXECUTION',
        from: sender.address,
        to: DEPLOYED_ADDRESS_TOKENSALES,
        data: tsContract.methods.setForSaleEach(tokenId, caver.utils.toPeb(inputprice, 'KLAY')).encodeABI(),
        gas: '500000',
        value: caver.utils.toPeb('0', 'KLAY'),
      }, sender.privateKey)

      await fetch("http://115.85.183.11:30070/", {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ rawTransaction: senderRawTransaction }),
      })
        .then((res) => res.json()) //추가된 부분
        .then((json) => {
          this.setState({
            isLoading: false,
            approve: true,
            price: inputprice
          })
          alert(json.transactionHash);
        });

    } catch (err) {
      console.error(err);
    }
  }


  componentDidMount = async () => {
    const { tokenID } = this.props;

    var price = await this.getTokenPrice(tokenID);
    if (this.state.price == null)
      this.setState({
        price: caver.utils.fromPeb(price, 'KLAY'),
      });

    let approvedAddress = await this.getApproved(tokenID)
    if (approvedAddress != "0x0000000000000000000000000000000000000000")
      this.setState({
        approve: true,
      });


    await this.loadEpiThumbnail();
  }


  render() {
    const { tokenID, title, episode, author, dateCreated, order } = this.props;
    const antIcon = <Icon type="loading-3-quarters" style={{ fontSize: 30 }} spin />;

    // let approvedAddress = this.getApproved(tokenID)
    // console.log(title, order, this.state.price, approvedAddress)

    if (this.state.approve == false) {
      return (
        <div className="card-container">
          <CardHeader>{tokenID}</CardHeader>
          <img src={this.state.src}
            height='180' width='200' title={title}></img>
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
          <CardActions style={{ justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="primary"
              disabled={this.state.isLoading}
              onClick={this.approveEach}>
              승인
            </Button>
          </CardActions>
        </div>
      )
    } else if (this.state.approve == true) {

      if (this.state.price > 0) {
        return (
          <div className="card-container">
            <CardHeader>{tokenID}</CardHeader>
            <img src={this.state.src} height='180' width='200' title={title}></img>
            <CardContent>
              <Spin spinning={this.state.isLoading == true} indicator={antIcon}>
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
                price: {this.state.price}
                <br></br>
              </Spin>
              <CardActions style={{ justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  color="primary"
                  disabled={this.state.isLoading}
                  onClick={(e) => this.removeTokenOnSaleEach()}>
                  판매 취소
                </Button>
              </CardActions>
            </CardContent>
          </div>
        )

      } else if (this.state.price <= 0) {

        return (

          <div className="card-container">
            <CardHeader>{tokenID}</CardHeader>
            <img src={this.state.src} height='180' width='200' title={title}></img>
            <CardContent>
              <Spin spinning={this.state.isLoading == true} indicator={antIcon}>
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
                <br></br>
              </Spin>
              <CardActions>
                <input
                  type="number"
                  placeholder="KLAY"
                  min='0'
                  step="0.1"
                  disabled={this.state.isLoading}
                  style={{ width: "110px" }}
                  value={this.state.inputprice}
                  onChange={this.handleInput} />

                <Button
                  variant='contained'
                  color='primary'
                  disabled={this.state.isLoading}
                  onClick={(e) => this.sellToken(tokenID)}>
                  판매
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  disabled={this.state.isLoading}
                  onClick={this.cancelApprovalEach}>
                  취소
                </Button>

              </CardActions>
            </CardContent>


          </div>
        )
      }

    } else {
      return (<div>Loading...</div>)
    }

  }
}

export default Card;