import React from 'react';
import { Component } from 'react';
import CardList from '../CardList'
import TabPanel from '../TabPanel'

import '../TokenTabs.css'



class TokenTabs_MyToken extends Component {
    state = {
        value: 0,
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

        const { mytokens } = this.props;

        return (
            <div>
                <TabPanel value={this.state.value} index={0}>
                    <CardList tokens={mytokens} />
                </TabPanel>
            </div>
        );
    }
}

export default TokenTabs_MyToken;
