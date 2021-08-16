import React from 'react';
import { Component } from 'react';
import Loading from '../Loading'
import caver from '../../../klaytn/caver'
import AllCardOnSale_2 from './AllCardOnSale_2'
import './AllCardOnSale.css'
import {
  DEPLOYED_ABI, DEPLOYED_ADDRESS,
  DEPLOYED_ABI_TOKENSALES, DEPLOYED_ADDRESS_TOKENSALES
} from '../../../constants';


const wttContract = new caver.klay.Contract(DEPLOYED_ABI, DEPLOYED_ADDRESS);
const tsContract = new caver.klay.Contract(DEPLOYED_ABI_TOKENSALES, DEPLOYED_ADDRESS_TOKENSALES);



class AllCardOnSale extends Component {
  constructor(props) {
    super(props);
    this.state = {
      totaltokenstate: '',
      isLoading: false,
      seriesList: [],
    }
  }

  componentDidMount = async () => {
    await this.displayAllTokens2();
  }


  handleClick = () => {
    if (this.state.open) {
      this.setState({
        open: false
      })
    }
    else {
      this.setState({
        open: true
      })
    }
  }

  displayAllTokens2 = async () => {

    this.setState({ isLoading: true })
    var seriesList = new Array();

    const series = await fetch("http://115.85.183.11:30070/getSeries").then((res) => {
      return res.json(); //Promise 반환
    })

    series.map((series) => {
      seriesList.push(series.series);
    })

    this.setState({
      seriesList: seriesList,
      isLoading: false
    })

    await this.displayAllTokens3();
  }

  displayAllTokens3 = async () => {
    const walletFromSession = sessionStorage.getItem('walletInstance');
    this.setState({ isLoading: true })
    var list = new Array();

    for (var i = 0; i < this.state.seriesList.length; i++) {
      const arr = await this.getSeries(this.state.seriesList[i])

      for (const item in arr) {
        var tokenId = arr[item];
        var price = await this.getTokenPrice(tokenId);
        var owner = await this.getOwnerOf(tokenId);
        var wtt = await this.getWTT(tokenId);

        if (price > 0 && JSON.parse(walletFromSession).address.toUpperCase() != owner.toUpperCase()) {
          list.push(this.state.seriesList[i])
          console.log(JSON.parse(walletFromSession).address.toUpperCase())
          console.log( owner.toUpperCase())
          console.log('---------------------')
          break;
        }
      }
    }


    this.setState({
      seriesList: list,
      isLoading: false
    })
  }


  getTotalSupply = async () => {
    return await wttContract.methods.totalSupply().call();
  }
  getTokenByIndex = async (index) => {
    return await wttContract.methods.tokenByIndex(index).call();
  }
  getWTT = async (tokenId) => {
    return await wttContract.methods.getWTT(tokenId).call();
  }
  getTokenPrice = async (tokenId) => {
    return await tsContract.methods.tokenPrice(tokenId).call();
  }
  getSeries = async (series) => {
    return await wttContract.methods.getSeries(series).call();
  }
  getOwnerOf = async (tokenId) => {
    return await wttContract.methods.ownerOf(tokenId).call();
  }


  render() {
    // console.log(this.state.seriesList)
    if (this.state.isLoading) return <Loading />
    return (
      <div className='AllCardOnSale'>
        <div className='greenContainer'></div>
        <div className='title'>판매 토큰</div>
        {this.state.seriesList.map((series, idx) => {

          return <AllCardOnSale_2
            key={idx}
            series={series} />

        })}

      </div>
    )


  }
}

export default AllCardOnSale;