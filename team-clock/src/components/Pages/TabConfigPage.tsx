import React from 'react';
import * as microsoftTeams from "@microsoft/teams-js";
import { ConfigService } from '../../services/ConfigService/ConfigService';
import ThemeService from '../../services/ThemeService/ThemeService';
import { Provider, Header, ThemePrepared } from "@fluentui/react-northstar";

export interface ITabConfigPageProps { };
export interface ITabConfigPageState {
  tabName?: string;
  spListName: string;
  firstRun: boolean;
  theme: ThemePrepared
}
export default class TabConfig extends React.Component<ITabConfigPageProps, ITabConfigPageState> {

  constructor(props: ITabConfigPageProps) {
    super(props);
    this.state = {
      tabName: process.env.REACT_APP_MANIFEST_NAME,
      spListName: "",
      firstRun: false,
      theme: ThemeService.getFluentTheme()
    }
  }

  async componentDidMount() {
    let { config, teamsContext } = await ConfigService.getContextAndConfig();
    this.setState({
      spListName: config.spListName,
      firstRun: !config.spListName,
      theme: ThemeService.getFluentTheme(teamsContext.theme)
    });
    microsoftTeams.appInitialization.notifySuccess();
  }

  render() {

    // Assume the tab is hosted in the same location as this page
    const baseUrl = window.location.href.substring(0, window.location.href.indexOf("#/") + 1);

    microsoftTeams.settings.registerOnSaveHandler((saveEvent) => {

      // This will run when the user clicks the "Save" button in the Teams config popup.
      microsoftTeams.settings.setSettings({
        suggestedDisplayName: this.state.tabName,
        entityId: ConfigService.getEntityId({
          spListName: this.state.spListName
        }),
        contentUrl: `${baseUrl}/Tab`,
        websiteUrl: `${baseUrl}/Web`
      });
      saveEvent.notifySuccess();

    });

    this.checkValidityState();
    return (
      <Provider theme={this.state.theme}>
      <Header>Tab Configuration</Header>
        <table>
          { this.state.firstRun ?
            <tr>
              <td>Tab name: </td>
              <td>
                <input onChange={this.handleTabNameChange.bind(this)}
                  value={this.state.tabName}
                />
              </td>
            </tr>
            : null }
          <tr>
            <td>SharePoint List Name: </td>
            <td>
              <input onChange={this.handleShortMessageChange.bind(this)}
                value={this.state.spListName}
              />
            </td>
          </tr>
        </table>
      </Provider>
    );
  }

  private handleTabNameChange(event: React.FormEvent<HTMLInputElement>) {
    this.setState({ tabName: event.currentTarget.value });
    this.checkValidityState();
  }

  private handleShortMessageChange(event: React.FormEvent<HTMLInputElement>) {
    this.setState({ spListName: event.currentTarget.value });
    this.checkValidityState();
  }

  private checkValidityState() {
    let result = false;
    if (this.state.tabName && this.state.spListName) {
      result = true;
    }
    microsoftTeams.settings.setValidityState(result);
  }

}
