import React from 'react';
import { Button } from '@material-ui/core';

class ProfileBox extends React.Component {
    state = {
        type: 'password',
    }


    handleClick = () => this.setState(({ type }) => ({
        type: type === 'text' ? 'password' : 'text'
    }))


    render() {
        const { label, value } = this.props

        return (
            <label className="password">{label}
                <input type={this.state.type} className="password__input" readOnly value={value} />
                <Button className="password__show" onClick={this.handleClick}>{this.state.type === 'text' ? 'Hide' : 'Show'}</Button>
                <br />
            </label>
        )
    }
}

export default ProfileBox;