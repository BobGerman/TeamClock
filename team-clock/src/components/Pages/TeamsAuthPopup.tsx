import React from 'react';
import * as microsoftTeams from "@microsoft/teams-js";

import AuthService from "../../services/AuthService/MsalRefreshAuthService";

class TeamsAuthPopup extends React.Component {

  componentDidMount() {

    if (microsoftTeams) {
      microsoftTeams.initialize(window as any);
      microsoftTeams.getContext((context: microsoftTeams.Context) => {

        if (context) {

          let scopes = process.env.REACT_APP_AAD_GRAPH_DELEGATED_SCOPES?.split(',');

          // If here we have a Teams context. Ensure we're logged in
          // and then request the access token.
          if (!AuthService.isLoggedIn()) {

            AuthService.login(scopes);
            // This call won't return - catch it on the redirect

          } else {

            AuthService.getAccessTokenEx(scopes)
              .then((authState) => {
                if (authState?.accessToken) {
                  const response = JSON.stringify(authState);
                  microsoftTeams.authentication.notifySuccess(response);
                } else {
                  microsoftTeams.authentication.notifyFailure("Unexpected failure - null token received");
                }
              })
              .catch((error) => {
                console.log(error);
                microsoftTeams.authentication.notifyFailure(error);
              });
          }
        }
      });
    }
  }

  render() {
    return (<p>Authorizing (Part 1: Redirecting to Azure AD)</p>);
  }
}
export default TeamsAuthPopup;