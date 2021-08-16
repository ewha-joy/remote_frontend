import React, { Component } from 'react';
import Page from './components/page/Page_TokenIssuance';
import Form from './components/Form';

import {Link, withRouter} from "react-router-dom";
import './TokenIssuance.css';

class TokenIssuance extends Component {
    state = {
        value: 0,
        webtoons: []
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


    render() {
        const { isLoggedIn, role } = this.props;
        return (
            <div className='transaction-main'>
                {isLoggedIn
                    ? (role === "ROLE_AUTHOR"
                        ? <Page role={role} />
                        :
                        (role === null
                            ? <div>
                                <div className="description">
                                    토큰 발행은 작가만 할 수 있습니다.<br />
                                    JOY TOON 웹툰 계정을 통한 작가 인증이 필요합니다.
                                </div>
                                <Link className="link" to="/tokenissuance/login">JOY TOON 작가계정 인증하기</Link>
                            </div>
                            : <div className="description">
                                토큰 발행은 작가만 할 수 있습니다.<br />
                            </div>)
                    )
                    : <Form role={role} />}
            </div>
        )

    }
}


export default TokenIssuance;