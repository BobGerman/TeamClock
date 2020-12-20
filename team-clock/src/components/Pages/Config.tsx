import React from 'react';
import * as microsoftTeams from "@microsoft/teams-js";

export interface IConfigProps { };
export interface IConfigState {
  tabName: string;
  listName: string;
  firstRun: boolean;
}
export default class TabConfig extends React.Component<IConfigProps, IConfigState> {

  constructor(props: IConfigProps) {
    super(props);
    this.state = {
      tabName: "Team Clock",
      listName: "",
      firstRun: false
    }
  }

  componentDidMount() {
    microsoftTeams.getContext((context: microsoftTeams.Context) => {
      if (context.entityId) {
        this.setState({
          listName: this.getListNameFromEntityId(context.entityId),
          firstRun: false
        });
      } else {
        this.setState({
          firstRun: true
        });
      }
    });
  }

  render() {

    // Assume the tab is hosted in the same location as this page
    const baseUrl = window.location.href.substring(0, window.location.href.indexOf("#/") + 1);

    microsoftTeams.settings.registerOnSaveHandler((saveEvent) => {

      // This will run when the user clicks the "Save" button in the Teams config popup.
      microsoftTeams.settings.setSettings({
        suggestedDisplayName: this.state.tabName,
        entityId: this.getEntityIdForListName(this.state.listName),
        contentUrl: `${baseUrl}/Tab`,
        websiteUrl: `${baseUrl}/Web`
      });
      saveEvent.notifySuccess();

    });

    this.checkValidityState();
    return (
      <div>
        <h1>TeamClock Configuration</h1>
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
            <td>SharePoint list name: </td>
            <td>
              <input onChange={this.handleListNameChange.bind(this)}
                value={this.state.listName}
              />
            </td>
          </tr>
        </table>
      </div>
    );
  }

  private handleTabNameChange(event: React.FormEvent<HTMLInputElement>) {
    this.setState({ tabName: event.currentTarget.value });
    this.checkValidityState();
  }

  private handleListNameChange(event: React.FormEvent<HTMLInputElement>) {
    this.setState({ listName: event.currentTarget.value });
    this.checkValidityState();
  }

  private checkValidityState() {
    let result = false;
    if (this.state.tabName && this.state.listName) {
      result = true;
    }
    microsoftTeams.settings.setValidityState(result);
  }

  // The entity ID stores the SharePoint list name plus some
  // randomness to ensure uniqueness
  private getEntityIdForListName(listName: string): string {
    return listName + "/" +
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
  }

  private getListNameFromEntityId(entityId: string): string {
    return entityId.split('/')[0];
  }
}
