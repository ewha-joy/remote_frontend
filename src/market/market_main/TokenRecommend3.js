import { CardActions, CardContent, CardHeader, Typography, Button, } from '@material-ui/core';
import React from 'react';
import { Component } from 'react';
import Loading from '../components/Loading';
import { fetchEpiThumbnailById } from '../../util/APIAdmin';
import '../components/Card.css';



class TokenRecommend3 extends Component {
  constructor(props) {
    super(props)
    this.state = {
      disable: true,
      isLoading: false,
      src: null,
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

  componentWillMount = async () => {
    if(this.state.src == null)
      await this.loadEpiThumbnail()
  }



  render() {
    const { tokenID, title, episode, author, dateCreated, order, price, owner, walletInstance } = this.props;

    // var walletaddress = walletInstance.toUpperCase();

    if (this.state.isLoading) return <Loading />

    if (price > 0) {
      return (
        <div className="card-container3">
          <div className="header">
            Token ID : {tokenID}
          </div>
          <div className="card-container2">
            {/* <CardHeader>{tokenID}</CardHeader> */}
            <img src={this.state.src} height='180' width='200' title={title}></img>
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
            {/* <CardActions style={{ justifyContent: 'center' }}>
              {(owner === walletaddress)
                ? <Button variant='outlined' color='primary' >내 토큰</Button>
                : <Button variant='contained' color='secondary'
                  onClick={(e) => this.buyToken(tokenID, title, episode, author, dateCreated, order, price)}
                  disable={this.state.disable}>{price} Clay에 구매 </Button>}
            </CardActions> */}
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
            </CardContent>
          </div>
        </div>
      )
    }

  }
}

export default TokenRecommend3;