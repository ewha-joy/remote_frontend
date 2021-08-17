import React from 'react';
import { Component } from 'react';
import AllCard from './AllCard';
import Loading from '../Loading'
import caver from '../../../klaytn/caver'
import './AllCardList_2.css'
import { List, ListItem, Collapse } from '@material-ui/core';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import { fetchEpiThumbnailById, fetchToonById } from "../../../util/APIAdmin";
import {
  DEPLOYED_ABI, DEPLOYED_ADDRESS,
  DEPLOYED_ABI_TOKENSALES, DEPLOYED_ADDRESS_TOKENSALES
} from '../../../constants';


const wttContract = new caver.klay.Contract(DEPLOYED_ABI, DEPLOYED_ADDRESS);
const tsContract = new caver.klay.Contract(DEPLOYED_ABI_TOKENSALES, DEPLOYED_ADDRESS_TOKENSALES);



class AllCardList_2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      totaltokenstate: '',
      alltokens: [],
      series: this.props.series,
      isLoading: false,
      open: false,
      src: null,
      title: null,
      epiTitle: null
    }
  }


  componentDidMount = async () => {
    const walletFromSession = sessionStorage.getItem('walletInstance');

    await this.loadEpiThumbnail();
    await this.getTitle()
  }

  getTitle() {

    const { series } = this.props;
    var eno = series.split('-')
    fetchToonById(parseInt(eno[0], 10))
      .then((res) => {
        try {
          var episode = res.episode

          for (var i = 0; i < episode.length; i++) {
            if (eno[1] == episode[i].eno)
              var episodeTitle = episode[i].epiTitle
          }

          this.setState({
            title: res.title,
            epiTitle: episodeTitle
          })

        } catch (e) {
          console.log(e)
        }
      })
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

  handleClick = async () => {
    if (this.state.open) {
      this.setState({
        open: false
      })
    }
    else {
      const walletFromSession = sessionStorage.getItem('walletInstance');
      if(this.state.alltokens.length == 0 ) await this.displayAllTokens(JSON.parse(walletFromSession));
      this.setState({
        open: true
      })
    }
  }

  displayAllTokens = async (walletInstance) => {

    this.setState({
      isLoading: true
    });
    try {
      var totalSupply = parseInt(await this.getTotalSupply());
      var tokenList = new Array();
      const arr = await this.getSeries(this.state.series)

      if (totalSupply === 0) {
        this.setState({
          totaltokenstate: '현재 발행된 토큰이 없습니다'
        })
      } else {

        for (const item in arr) {
          var tokenId = arr[item];
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
        alltokens: tokenList,
        isLoading: false
      })
    } catch (e) { console.log(e) }
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
  getSeries = async (series) => {
    return await wttContract.methods.getSeries(series).call();
  }


  render() {
    //console.log(this.state.series, this.getSeries(this.state.series))
    //if (this.state.isLoading) return <Loading />

    return (
      <div className='carditem'>

        <ListItem button onClick={this.handleClick}>

          <div className='info'>
            <strong>{this.state.title}</strong>
            <br /><br />
            {this.state.epiTitle}
          </div>
          <div className='image'>
            <img classNmae='img' style={{objectFit:'cover', height:180, width:300}} src={this.state.src} ></img>
          </div>

          {this.state.open ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={this.state.open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem >
              <div className="card-list">
                {this.state.alltokens.map((token, idx) => {
                  return <AllCard
                    key={token.tokenId}
                    tokenID={token.tokenId}
                    title={token.title}
                    episode={token.episode}
                    author={token.author}
                    dateCreated={token.dateCreated}
                    order={token.order}
                    series={token.series}
                    price={token.price}
                    owner={token.owner}
                    walletInstance={token.walletInstance}
                    src={this.state.src}
                  />

                })}
              </div>
            </ListItem>
          </List>
        </Collapse>
      </div>
    )
  }
}

export default AllCardList_2;