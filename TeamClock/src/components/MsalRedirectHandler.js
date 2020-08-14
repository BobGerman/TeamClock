import React from 'react';
import AuthService from '../services/AuthService'
// import { HashRouter as Router, Redirect } from "react-router-dom";
import Web from './Web';

/**
 * The web UI used when Teams pops out a browser window
 */
class MsalRedirectHandler extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: AuthService.userName,
            token: null
        }
    }

    componentDidMount() {
        AuthService.init()
            .then((username) => {
                this.setState({
                    userName: username
                });
            })
    }

    render() {
        if (this.state.userName) {
            window.location.hash = "#web";
            return <Web />
        } else {
            return <p>Nobody logged in here</p>
        }
    }
}
export default MsalRedirectHandler;