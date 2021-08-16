import React from 'react';
import { Component } from 'react';
import SaleCardList from '../SaleCardList'
import TabPanel from '../TabPanel'

import '../TokenTabs.css'



class TokenTabs_TokenOnSale extends Component {
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

        const { mysaletokens } = this.props;

        return (
            <div>
                <TabPanel value={this.state.value} index={0}>
                    <SaleCardList tokens={mysaletokens} />
                </TabPanel>
            </div>
        );
    }
}

export default TokenTabs_TokenOnSale;
