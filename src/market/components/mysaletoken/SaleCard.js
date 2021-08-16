import { CardContent, CardHeader } from '@material-ui/core';
import React from 'react';
import {Component} from 'react';
import {fetchEpiThumbnailById} from "../../../util/APIAdmin";

class SaleCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      src: null
    }
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
    await this.loadEpiThumbnail();
  }
  
  render() {
    const { tokenId, title, episode, author, dateCreated, order, price} = this.props;
    if(price>0){//판매중인 토큰
      
      return (

        <div className="card-container">
          <CardHeader>{tokenId}</CardHeader>
          <img src={this.state.src}  height='180' width='200' title={title}></img>
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
          </CardContent>
        </div>
      )

    }else{

      return(
        <div>
              
        </div>
      )
    }
     
  }
}
  
  export default SaleCard;