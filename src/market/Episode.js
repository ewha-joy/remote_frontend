import React, { Component } from 'react';
import "./Episode.css";
import { withRouter } from 'react-router-dom';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import { Button, Spin, Icon } from 'antd';
import { DEPLOYED_ABI, DEPLOYED_ADDRESS } from '../constants';
import caver from '../klaytn/caver'
import { tokenissue } from '../util/APIUtils';


const wttContract = new caver.klay.Contract(DEPLOYED_ABI, DEPLOYED_ADDRESS);


class EpisodeList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            webtoon: this.props.webtoon,
            episode: this.props.episode,

            title: this.props.webtoon.title,
            epiTitle: this.props.episode.epiTitle,
            author: this.props.webtoon.artist,
            dateCreated: this.props.episode.createdAt,

            tno: this.props.webtoon.tno,
            eno: this.props.episode.eno,

            open: false,
            counter: 1,
            count: 0,
            max: 50,
            isLoading: false,
        };
    }


    handleClickOpen = () => {
        this.setState({
            open: true
        });
    }

    handleClose = () => {
        this.setState({
            open: false,
            counter: 1
        })
    }
    onIncrease = () => {
        if (this.state.counter + this.state.count < 50) {
            let counter = this.state.counter + 1;
            this.setState({ counter })
        } else {
            alert('토큰 최대 발행 개수를 초과했습니다.')
        }
    }

    onDecrease = () => {
        if (this.state.counter > 1) {
            let counter = this.state.counter - 1;
            this.setState({ counter })
        } else if (this.state.counter == 1) {
            alert('최소 1개 이상 발행해 주세요.')
        }
    }

    ///////

    getEpisodeCount = async (tno, eno) => {
        var series = String(tno) + '-' + String(eno);
        await wttContract.methods.getEpiCount(series).call()
            .then(res =>
                this.setState({ count: Number(res) }))
    }

    checkTokenExists = async (tno, eno, order) => {
        var series = String(tno) + '-' + String(eno);
        try {
            return wttContract.methods.isTokenAlreadyCreated(series, order).call();
        } catch (e) {
            console.error(e);
        }
    }

    mintWTT = async (title, episode, author, dateCreated, series) => {
        const sender = this.getWallet();
        this.setState({ isLoading: true })
        // using the promise
        const { rawTransaction: senderRawTransaction } = await caver.klay.accounts.signTransaction({
            type: 'FEE_DELEGATED_SMART_CONTRACT_EXECUTION',
            from: sender.address,
            to: DEPLOYED_ADDRESS,
            data: wttContract.methods.mintWTT(title, episode, author, dateCreated, series).encodeABI(),
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
            .then((res) => res.json(),
                this.getEpisodeCount(this.state.tno, this.state.eno))
            .then((json) => {
                alert(json.transactionHash);

                if (this.state.count == 0) {
                    fetch("http://115.85.183.11:30070/series", {
                        method: "put",
                        headers: {
                            "content-type": "application/json",
                        },
                        body: JSON.stringify({
                            series: series
                        }),
                    })
                }
            })
        this.setState({ isLoading: false })

    }

    getTokenOfOwnerByIndex = async (address, index) => {
        return await wttContract.methods.tokenOfOwnerByIndex(address, index).call();
    }
    getBalanceOf = async function (address) {
        return await wttContract.methods.balanceOf(address).call();
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


    onSubmit = async () => {
        try {
            var i = 1
            var series = String(this.state.tno) + '-' + String(this.state.eno);
            var order = this.state.count;
            while (i <= this.state.counter) {
                order = order + 1

                if ((await this.checkTokenExists(this.state.tno, this.state.eno, order) || this.state.count == this.state.max)) {
                    alert('토큰 최대 발행 개수를 초과했습니다.');
                    return (null)
                } else {
                    await this.mintWTT(
                        this.state.title,
                        this.state.epiTitle,
                        this.state.author,
                        this.state.dateCreated.substr(0, 10),
                        series)
                        .then(/*console.log(i, 'mintWTT'),*/ i++)

                }
                this.issuewebtoontoken();
                await this.getEpisodeCount(this.state.tno, this.state.eno);
            }

        } catch (e) {
            console.error(e);
        }
    }

    issuewebtoontoken = async () => {
        //eno-tokenid 를 몽고db에 저장(cash-service)
        const wallet = this.getWallet();
        var recent = 0;
        var balance = parseInt(await this.getBalanceOf(wallet.address));
        for (var i = 0; i < balance; i++) {
            var tokenId = await this.getTokenOfOwnerByIndex(wallet.address, i);
            if (tokenId > recent) {
                recent = tokenId;
            }
        }
        tokenissue(this.state.eno, DEPLOYED_ADDRESS, recent)
            .then(/*res => console.log(res)*/);
    }

    componentDidMount = async () => {
        this.getEpisodeCount(this.state.tno, this.state.eno);
    }

    render() {

        const antIcon = <Icon type="loading-3-quarters" style={{ fontSize: 30 }} spin />;
        return (
            <div>
                <div className="img_episode">
                    <img src={this.state.episode.epiThumbnail.fileUri} alt={this.state.episode.epiTitle} className="epi_img" />
                </div>
                <div className="info_episode">
                    <strong className="tit_episode">
                        {this.state.episode.epiTitle}
                    </strong>
                    <span className="date_episode">
                        {`${this.state.episode.createdAt.substr(0, 10)}`}
                    </span>
                    <span className="avgStar_epi">
                        평점 : {Number((Object.values(this.state.episode.rate).reduce((acc, current) => acc + current.rate, 0)) / Object.values(this.state.episode.rate).length).toFixed(1)}
                    </span>
                    <Button type="primary" className="rentButton" onClick={this.handleClickOpen} htmlType="submit" >
                        토큰 발행
                    </Button>
                    <Dialog className="dialog" open={this.state.open} onClose={this.handleClose}>
                        <DialogContent className="dialogContent">
                            <Spin spinning={this.state.isLoading == true} indicator={antIcon}>
                                <div>
                                    <img src={this.state.episode.epiThumbnail.fileUri} alt={this.state.episode.epiTitle} className="epi_img" />
                                    <div>
                                        <div className="dialogTXT">
                                            title : {this.state.title}
                                        </div>
                                        <div className="dialogTXT">
                                            author : {this.state.author}
                                        </div>
                                        <div className="dialogTXT">
                                            episode : {this.state.epiTitle}
                                        </div>
                                        <div className="dialogTXT">
                                            created Date : {`${this.state.dateCreated.substr(0, 10)}`}
                                        </div>
                                        <div className="dialogTXT">
                                            발행 개수 :
                                            <Button className="counter" onClick={this.onDecrease}>-</Button>
                                            <span className="counterTXT">{this.state.counter}</span>
                                            <Button className="counter" onClick={this.onIncrease}>+</Button>
                                        </div>
                                        <span className="dialogTXT2">
                                            (현재 발행된 개수 : {this.state.count})
                                        </span>
                                    </div>
                                </div>
                            </Spin>
                        </DialogContent>
                        <DialogActions>
                            <Button className="button" variant="contained" color="default" disabled={this.state.isLoading} onClick={this.onSubmit}> 발행</Button>
                            <Button className="button" variant="contained" color="default" disabled={this.state.isLoading} onClick={this.handleClose}> 취소</Button>
                        </DialogActions>
                    </Dialog>
                </div>
            </div>

        );
    }
}

export default withRouter(EpisodeList);