import { CardActions, CardContent, CardHeader, Button } from '@material-ui/core';
import React from 'react';
import { Component } from 'react';
import caver from '../../klaytn/caver'
import Loading from './Loading'
import {
  DEPLOYED_ABI, DEPLOYED_ADDRESS,
  DEPLOYED_ABI_TOKENSALES, DEPLOYED_ADDRESS_TOKENSALES
} from '../../constants';
import { fetchEpiThumbnailById } from "../../util/APIAdmin";
import './Card.css'

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
      src: null
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
    this.setState({ isLoading: true })
    try {
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
          alert(json.transactionHash);
          this.setState({ isLoading: false })
          window.location.reload();
        });

    } catch (err) {
      console.error(err);
    }

  };

  removeTokenOnSaleEach = async () => {
    this.setState({ isLoading: true })
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
          alert(json.transactionHash);
          this.setState({ isLoading: false })
          window.location.reload();
        });

      await this.cancelApprovalEach();
    }
  }

  cancelApprovalEach = async () => {
    this.setState({ isLoading: true })
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
        alert(json.transactionHash);
        this.setState({ isLoading: false })
        window.location.reload();
      });
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


  componentDidMount = async () => {
    const { tokenID } = this.props;
    let approvedAddress = await this.getApproved(tokenID)
    let price = await this.getTokenPrice(tokenID)
    if (approvedAddress != "0x0000000000000000000000000000000000000000")
      this.setState({
        approve: true,
      });
    await this.loadEpiThumbnail();
  }


  render() {
    const { tokenID, title, episode, author, dateCreated, order, price } = this.props;

    if (this.state.isLoading) return <Loading />

    const sellToken = async (tokenId, e) => {
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
            alert(json.transactionHash);
            window.location.reload();
            this.setState({
              isLoading: false,
            })
          });
      } catch (err) {
        console.error(err);
      }
    }


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

      if (price > 0) {
        return (
          <div className="card-container">
            <CardHeader>{tokenID}</CardHeader>
            <img src={this.state.src} height='180' width='200' title={title}></img>
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
              price: {price}
              <br></br>
              <CardActions style={{ justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  color="primary"
                  disabled={this.state.isLoading}
                  onClick={this.removeTokenOnSaleEach}>
                  판매 취소
                </Button>
              </CardActions>
            </CardContent>
          </div>
        )

      } else if (price <= 0) {

        return (

          <div className="card-container">
            <CardHeader>{tokenID}</CardHeader>
            <img src={this.state.src} height='180' width='200' title={title}></img>
            <CardContent>
              title: {title}
              <br></br>
              episode: {episode}
              <br></br>
              author: {author}
              <br></br>
              dateCreated: {dateCreated}
              <br></br>
              serial#.: {order}
              <br></br>
              <br></br>
              <CardActions>
                <input
                  type="number"
                  placeholder="KLAY"
                  min='0'
                  step="0.01"
                  style={{ width: "110px" }}
                  value={this.state.inputprice}
                  onChange={this.handleInput} />

                <Button
                  variant='contained'
                  color='primary'
                  disabled={this.state.isLoading}
                  onClick={(e) => sellToken(tokenID)}>
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

    }

  }
}

export default Card;