# Tabs

Tabs are Teams-aware webpages embedded in Microsoft Teams. A channel/group tab delivers content to channels and group chats, and are a great way to create collaborative spaces around dedicated web-based content.

## Prerequisites
-  [NodeJS](https://nodejs.org/en/)

-  [M365 developer account](https://docs.microsoft.com/en-us/microsoftteams/platform/concepts/build-and-test/prepare-your-o365-tenant) or access to a Teams account with the appropriate permissions to install an app.

## Build and Run

In the project directory, execute:

`npm install`

`npm start`

## Deploy to Teams

### `ngrok http https://localhost:3000`
Run ngrok so there is a tunnel from the Internet to localhost:3000.

#### Update manifest.env
Update manifest.env in the publish folder as follows:
* baseUrl0=*somesubdomain*.ngrok.io // somesubdomain should be the subdomain in the fowarding URL provided by ngrok. 

**Upload app from the Teams client**
- Upload the `Development.zip` from the *.publish* folder to Teams.
  - [Upload a custom app](https://aka.ms/teams-toolkit-uploadapp) 