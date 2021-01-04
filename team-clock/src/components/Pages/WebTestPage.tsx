import React from 'react';
import * as MicrosoftGraph from "@microsoft/microsoft-graph-types";

import AuthService from '../../services/AuthService/MsalRefreshAuthService';
import MSGraphService from '../../services/MSGraphService/MSGraphService';

/**
 * The web UI used when Teams pops out a browser window
 */
export interface IWebPageProps { }
export interface IWebPageState {
  messages: MicrosoftGraph.Message[];
  error: string;
}
export default class WebPage extends React.Component<IWebPageProps, IWebPageState> {

  constructor(props: IWebPageProps) {
    super(props);
    this.state = {
      messages: [],
      error: ""
    }
  }

  async componentDidMount() {

    await this.getMessages();

  }

  render() {

    let key = 0;
    return (
      <div>
        <h1>{process.env.REACT_APP_MANIFEST_NAME}</h1>
        <p>Version {process.env.REACT_APP_MANIFEST_APP_VERSION}</p>
        <p>Your app is running in a stand-alone web page</p>

        <p>Username: {AuthService.getUsername()}</p>
        <ol>
          {
            this.state.messages.map(message => (
              <li key={key++}>EMAIL: {message.receivedDateTime}<br />{message.subject}
              </li>
            ))
          }
        </ol>


      </div>
    );
  }

  private async getMessages(): Promise<void> {

    try {
      let graphService = await MSGraphService.Factory(AuthService);
      let messages = await graphService.getMessages();
      this.setState({
        messages: messages,
        error: ""
      });
    }
    catch (error) {
      this.setState({
        messages: [],
        error: error
      });
    }
  }

}
