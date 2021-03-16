import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import NavbarCustom from "./components/NavBars/NavbarCustom";
import LogNavbar from "./components/NavBars/LogNavbar";
import Landing from "./components/LandingPage/Landing";

import Login from "./components/LoginPage/Login";
import Projects from "./components/ProjectsPage/ProjectsRedux";
import AddUser from "./components/SignupPage/AddUser";
import AddProject from "./components/AddProjectPage/AddProject";
import PrivateRoute from "./actions/PrivateRoute";
import Profile from "./components/ProfilePage/Profile";
import PageNotFound404 from "./components/PageNotFound404/PageNotFound404";
import ViewAProject from "./components/ViewProjectPage/ViewAProjectContainer"
import ViewAProfileProject from "./components/ProfilePage/ViewAProfileProjectContainer"

class App extends Component {
  constructor(props) {
        super(props);
        this.state = {
            log: (localStorage.jwtToken),

        };

    }


  render() {



    return (
      <Router>
            <div className="App">
                { localStorage.jwtToken ? <LogNavbar /> : <NavbarCustom /> }
                <Switch>
                    <Route exact path="/" component={Landing} />
                    <Route exact path="/viewprofileproject" component={ViewAProfileProject} />
                    <Route exact path="/login" component={Login} />
                    <Route exact path="/projects" component={Projects} />
                    <Route exact path="/addproject" component={AddProject} />
                    <Route exact path="/signup" component={AddUser} />
                    <Route exact path="/viewproject" component={ViewAProject} />
                    <PrivateRoute exact path="/profile" component={Profile} />
                    <Route path="/*" component={PageNotFound404} />
                </Switch>
            </div>
      </Router>
    );
  }
}
export default App;
