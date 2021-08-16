import React from 'react';
import {Component} from 'react';
import AllCardList from '../AllCardList'
import TabPanel from '../TabPanel'
import '../TokenTabs.css'



class TokenTabs_AllToken extends Component{
    state={
        value:0,
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

        const { alltokens }=this.props;

        return (
            <div>
                <TabPanel value={this.state.value} index={0}>
                    <AllCardList tokens={alltokens}/>
                </TabPanel>
            </div>
        );
    }
}

export default TokenTabs_AllToken;
