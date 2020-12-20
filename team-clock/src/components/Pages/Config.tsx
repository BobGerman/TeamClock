import React from 'react';
import * as microsoftTeams from "@microsoft/teams-js";

export default class TabConfig extends React.Component {

  render() {

    const baseUrl = window.location.href.substring(0, window.location.href.indexOf("#/") + 1);
    microsoftTeams.settings.registerOnSaveHandler((saveEvent) => {
        microsoftTeams.settings.setSettings({
            suggestedDisplayName: "Team Clock",
            entityId: "TeamClock",
            contentUrl: `${baseUrl}/#/Tab`,
            websiteUrl: `${baseUrl}/#/Web`
        });
        saveEvent.notifySuccess();
    });
    microsoftTeams.settings.setValidityState(true);

    return (
      <div>
        <h1>Tab Configuration</h1>
        <div>
          This is where you will add your tab configuration options the user
          can choose when the tab is added to your team/group chat.
          </div>
      </div>
    );
  }
}
