import React from 'react';
import { Component } from 'react';
//import {ReactDom} from 'react';
import caver from '../../../klaytn/caver'
import { connect } from 'react-redux'
import './Form.css';
import * as authActions from '../../../redux/actions/auth'

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TabPanel from './TabPanel';

import { notification } from 'antd';


const auth = {
    accessType: 'keystore',
    keystore: '',
    password: '',
    privateKey: '',
}

class Form extends Component {
    constructor(props) {
        super(props);
        this.state = {
            privateKey: '',
            open: false,
            value: 0,
            role: this.props.role,
        };
    }


    a11yProps = (index) => {

        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };

    }

    handleChange = async (event, newValue) => {//appbar
        this.setState({
            value: newValue
        });
    }

    handleImport = (e) => {
        try {
            let file = e.target.files[0];
            let fileReader = new FileReader();
            fileReader.onload = () => {
                try {
                    if (!this.checkValidKeystore(fileReader.result)) {
                        this.setState({
                            message: '유효하지 않은 keystore 파일입니다.'
                            //'wrong input file...'
                        })

                        return;
                    }

                    this.setState({
                        message: 'keystore 통과. 비밀번호를 입력하세요.'
                        //'right input file... 패스워드를 입력하세요'
                    })
                    auth.keystore = fileReader.result;
                } catch (e) {
                    this.setState({
                        message: '유효하지 않은 keystore 파일입니다.'
                    })

                    return;
                }
            }
            fileReader.readAsText(file);
        } catch (e) {
            this.setState({
                message: null
            })
        }
    };

    checkValidKeystore = (keystore) => {
        try {
            const parsedKeystore = JSON.parse(keystore);
            const isValidKeystore = parsedKeystore.version &&
                parsedKeystore.id &&
                parsedKeystore.address &&
                parsedKeystore.keyring;

            return isValidKeystore;
        } catch (e) {
            //console.log(eval)
        }
    };

    handlePassword = (e) => {
        auth.password = e.target.value;
        auth.accessType = 'keystore';
        this.setState({
            messagePW: null
        })
    };

    handlePrivateKey = (e) => {
        auth.privateKey = e.target.value;
        auth.accessType = 'privateKey';
        this.setState({
            messagePR: null
        })
    };

    onSubmit = async (e) => {
        e.preventDefault();
        if (auth.accessType === 'keystore') {
            try {
                const privateKeys = caver.klay.accounts.decrypt(auth.keystore, auth.password).privateKey;
                await this.setState({
                    privateKey: privateKeys,
                })
                await this.handleLogin();

            } catch (e) {
                this.setState({
                    messagePW: '비밀번호가 일치하지 않습니다.'
                })
            }
        } else if (auth.accessType === 'privateKey') {
            try {
                const privateKeys = auth.privateKey;
                await this.setState({
                    privateKey: privateKeys,
                })
                this.handleLogin();
            } catch (e) {
            }
        }
    };

    handleLogin = (e) => {
        try {
            const { login } = this.props;
            const { privateKey } = this.state;

            login(privateKey)
            this.handleClose();
            notification.success({
                message: "거래소",
                description: "로그인되었습니다."
            })
        } catch (e) {
            if (auth.accessType === 'keystore') {
                this.setState({
                    messagePW: '비밀번호가 일치하지 않습니다.'
                })
            } else if (auth.accessType === 'privateKey') {
                this.setState({
                    messagePR: '비밀키가 일치하지 않습니다.'
                })
            }

            notification.error({
                message: "거래소",
                description: "로그인 실패!"
            })
        }
    }
    handlePrivate = () => {
        this.setState({
            messagePR: null
        })
    }

    handleKeystore = () => {
        this.setState({
            messagePW: null
        })
    }

    handleClickOpen = () => {
        this.setState({
            open: true
        })
    }

    handleClose = () => {
        this.setState({
            open: false,
            message: null,
            messagePR: null,
            messagePW: null
        })
    }

    render() {
        return (
            <div>

                <Button className='login-form-button' variant="blank" color="default" onClick={this.handleClickOpen}>
                    Login
                </Button>
                <Dialog open={this.state.open} onClose={this.handleClose}>
                    <DialogContent style={{ height: "330px", width: "380px" }}>
                        <Tabs TabIndicatorProps={{ style: { background: '#025C30' } }} value={this.state.value} onChange={this.handleChange} indicatorColor="primary" textColor="secondary" variant="fullWidth" aria-label="simple tabs example">
                            <Tab onClick={this.handlePrivate} label="PRIVATE KEY" {...this.a11yProps(0)} />
                            <Tab onClick={this.handleKeystore} label="KEYSTORE" {...this.a11yProps(1)} />
                        </Tabs>
                        <TabPanel value={this.state.value} index={0}>
                            <div style={{ height: "70px" }}>
                                <div className="label">Private Key</div>
                                <input className="input-privateKey" type="password" onChange={this.handlePrivateKey} />
                                <div className="message">{this.state.messagePR}</div>
                            </div>
                        </TabPanel>
                        <TabPanel value={this.state.value} index={1}>
                            <div>
                                <div style={{ height: "120px" }}>
                                    <div className="label">Keystore</div>
                                    <input className="keystore" type="file" onChange={this.handleImport}></input>
                                    <div className="message">{this.state.message}</div>
                                </div>

                                <div style={{ height: "70px" }}>
                                    <div className="label">Password</div>
                                    <input className="input-password" type="password" onChange={this.handlePassword} />
                                    <div className="message">{this.state.messagePW}</div>
                                </div>
                            </div>
                        </TabPanel>

                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="default" onClick={this.onSubmit}> 로그인</Button>
                        <Button variant="contained" color="default" onClick={this.handleClose}> 닫기</Button>
                    </DialogActions>
                </Dialog>
            </div>

        )
    }
}


const mapDispatchToProps = (dispatch) => ({
    login: privateKey => dispatch(authActions.login(privateKey)),
})

export default connect(null, mapDispatchToProps)(Form);
