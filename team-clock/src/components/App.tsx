import React from 'react';
import './App.scss';
import * as microsoftTeams from "@microsoft/teams-js";
import { HashRouter as Router, Route } from "react-router-dom";
import Privacy from "./Privacy";
import TermsOfUse from "./Privacy"; // "./TermsOfUse";
// import Tab from './Tab';
import TabConfig from "./Privacy"; //  './TabConfig';
import Web from "./Privacy"; //  './Web';

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
            <Route exact path="/privacy" component={Privacy} />
            <Route exact path="/termsofuse" component={TermsOfUse} />
            <Route exact path="/web" component={Web} />
            <Route exact path="/" component={Web} />
            <Route exact path="/tab" component={Web} />
            <Route exact path="/config" component={TeamsHostError} />
          </Router>
        </div>
      );
    }

    // Initialize the Microsoft Teams SDK
    microsoftTeams.initialize(window as  any);

    // Display the app home page hosted in Teams
    return (
      <div className="App">
        <Router>
          <Route exact path="/tab" component={Web} />
          <Route exact path="/config" component={TabConfig} />
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