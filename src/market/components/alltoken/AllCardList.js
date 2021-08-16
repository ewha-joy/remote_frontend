import React from 'react';
import { Component } from 'react';
import Loading from '../Loading'
import caver from '../../../klaytn/caver'
import AllCardList_2 from './AllCardList_2'
import './AllCardList.css'
import {
  DEPLOYED_ABI, DEPLOYED_ADDRESS,
  DEPLOYED_ABI_TOKENSALES, DEPLOYED_ADDRESS_TOKENSALES
} from '../../../constants';

const wttContract = new caver.klay.Contract(DEPLOYED_ABI, DEPLOYED_ADDRESS);




class AllCardList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      totaltokenstate: '',
      isLoading: false,
      seriesList: [],
    }
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

  };

  displayAllTokens = async () => {

    this.setState({
      isLoading: true
    });

    const series = await fetch("http://115.85.183.11:30070/getSeries").then((res) => {
      return res.json(); //Promise 반환
    })


    if (series === null) {
      this.setState({
        totaltokenstate: '현재 발행된 토큰이 없습니다'
      })
    }

    this.setState({
      seriesList: series,
      isLoading: false
    })

  }

  componentDidMount = async () => {
    await this.displayAllTokens()
  }

  render() {

    if (this.state.isLoading) return <Loading />
    if (this.state.seriesList != null) {
      return (
        <div className='AllCardList'>
          <div className="greenContainer"></div>
          <div className='title'>전체 토큰</div>
          {this.state.seriesList.map((series, idx) => {
            return <AllCardList_2
              key={idx}
              series={series.series} />
          })}
        </div>
      )
    }
    else {
      return (
        <div className='AllCardList'>
          <div className="greenContainer"></div>
          <div className='title'>전체 토큰</div>
          {this.state.totaltokenstate}
        </div>
      )
    }

  }
}

export default AllCardList;