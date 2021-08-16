import React, { Component } from 'react';
import './TokenDetail.css';
import * as authActions from '../../redux/actions/auth'
import Loading from '../components/Loading';
import TokenSummary from './TokenSummary';
import caver from '../../klaytn/caver'
import { DEPLOYED_ABI, DEPLOYED_ADDRESS, 
    DEPLOYED_ABI_TOKENSALES, DEPLOYED_ADDRESS_TOKENSALES } from '../../constants';
import AllCardList_2 from '../components/alltoken/AllCardList_2';
import TokenRecommend2 from './TokenRecommend2';
import './TokenRecommend.css';

    
const wttContract = new caver.klay.Contract(DEPLOYED_ABI, DEPLOYED_ADDRESS);
const tsContract = new caver.klay.Contract(DEPLOYED_ABI_TOKENSALES, DEPLOYED_ADDRESS_TOKENSALES);
    


class TokenRecommend extends Component{
    constructor(props) {
        super(props);
        this.state = {
          totaltokenstate:'',
          isLoading: false,
          seriesList:[],
        }
      }


      componentDidMount = async () => {
        await this.displayAllTokens();
      }
    
      
      handleClick = () => {
        if(this.state.open){
            this.setState({
                open: false
            })
        }
        else{
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
      series.sort(() => Math.random() - Math.random());

      this.setState({
        seriesList: series,
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
    



    render(){
        if (this.state.isLoading) return <Loading />
        // const { tokens } = this.props;
        return (
        <div className="Token__Detail">
          추천 토큰
          <div classNmae="Token_Recommend">
          {this.state.seriesList.slice(0,3).map((series,idx) => {
            return  <TokenRecommend2 key={idx} series={series.series}/>})} 
          </div>
        </div>
        )
    }
}



export default React.memo(TokenRecommend);