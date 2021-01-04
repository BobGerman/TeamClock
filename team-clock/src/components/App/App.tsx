import React from 'react';
import './App.scss';
import * as microsoftTeams from "@microsoft/teams-js";
import { HashRouter as Router, Route } from "react-router-dom";
import PrivacyPage from "../Pages/PrivacyPage";
import TermsOfUsePage from "../Pages/TermsOfUsePage";
import TabPage from '../Pages/TabPage';
import TabTestPage from '../Pages/TabTestPage';
import TabConfigPage from "../Pages/Config";
import WebPage from "../Pages/WebPage";
import WebTestPage from '../Pages/WebTestPage';

/**
 * The main app which handles the initialization and routing
 * of the app.
 */
function App() {
  // Check for the Microsoft Teams SDK object.
  if (microsoftTeams) {

    // Set app routings that don't require microsoft Teams
    // SDK functionality.  Show an error if trying to access the
    // Home page.
    if (window.parent === window.self) {
      return (
        <div className="App">
          <Router>
            <Route exact path="/privacy" component={PrivacyPage} />
            <Route exact path="/termsofuse" component={TermsOfUsePage} />
            <Route exact path="/web" component={WebPage} />
            <Route exact path="/webTest" component={WebTestPage} />
            <Route exact path="/test" component={WebTestPage} />
            <Route exact path="/" component={WebPage} />
            <Route exact path="/tab" component={TeamsHostError} />
            <Route exact path="/tabTest" component={TeamsHostError} />
            <Route exact path="/config" component={TeamsHostError} />
          </Router>
        </div>
      );
    }

    // Initialize the Microsoft Teams SDK
    microsoftTeams.initialize(window as any);

    // Display the app home page hosted in Teams
    return (
      <div className="App">
        <Router>
        <Route exact path="/tab" component={TabPage} />
          <Route exact path="/tabTest" component={TabTestPage} />
          <Route exact path="/config" component={TabConfigPage} />
        </Router>
      </div>
    );
  }

  // Error when the Microsoft Teams SDK is not found
  // in the project.
  return (
    <h3>Microsoft Teams SDK not found.</h3>
  );
}

/**
 * This component displays an error message in the
 * case when a page is not being hosted within Teams.
 */
class TeamsHostError extends React.Component {
  render() {
    return (
      <div>
        <h3 className="Error">Debug your app within the Teams client.</h3>
      </div>
    );
  }
}

export default App;



// #region OLD CODE

// import React from 'react';
// import logo from '../common/img/logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.tsx</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
// #endregion