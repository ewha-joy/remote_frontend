import React, { Component } from 'react';
import Page from './components/page/Page_AllToken';
import Form from './components/Form';

import './components/TokenTabs.css';

class AllTokens extends Component{
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

    render(){
        const { isLoggedIn, role } = this.props;


        return (
            <div className='transaction-main'>
                {isLoggedIn ?<Page role={role}/> : <Form role={role}/>}
            </div>
        )
    }
}


export default AllTokens;