import React from 'react';
import AuthService from '../services/AuthService'
import { Redirect } from "react-router-dom";
import Privacy from "./Privacy";

/**
 * The web UI used when Teams pops out a browser window
 */
class MsalRedirectHandler extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: null,
            hash: null
        }
    }

    componentDidMount() {
        AuthService.init()
            .then((result) => {
                this.setState({
                    userName: result.username,
                    hash: result.hash
                });
            })
    }

    render() {
        if (this.state.userName) {
            return <Redirect to={Privacy} />
        } else {
            return <p>Nobody logged in here</p>
        }
    }
}
export default MsalRedirectHandler;