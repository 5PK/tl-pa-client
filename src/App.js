// App Imports
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";
import SideNav from "./components/SideNav";

import authenticationService from "../src/services/authentication-service";

import Container from "@material-ui/core/Container";
import Home from "./containers/Home";
import Login from "./containers/Login";
import Register from "./containers/Register";
import Landing from "./containers/Landing";
import NotFound from "./containers/NotFound";

import ClientApp from "./components/Client/c_App";
import AccountApp from "./components/Account/AccountApp";
import AlertApp from "./components/Alert/AlertApp";
import ClientDetail from "./components/Client/c_Detail";

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isAuthenticated: false,
      isAuthenticating: true,
      jwt: null
    }

    //this.userHasAuthenticated = this.userHasAuthenticated.bind(this);

  }

  /*
  componentWillMount() {

    console.log("auth service", authenticationService.jwtValue);
    console.log("auth service", authenticationService.jwt);

    if (authenticationService.jwtValue === null) {
      console.log(1)
      this.setState = {
        isAuthenticated: false,
        isAuthenticating: true,
        jwt: null
      };
    } else {
      console.log(2)
      this.setState = {
        isAuthenticated: true,
        isAuthenticating: false,
        jwt:  authenticationService.jwtValue
      };
    }
   
  }
  */

  userHasAuthenticated = (auth, token) => {
    console.log("app.js userHasAuth()" + auth + " " + token);
    document.cookie = { jwt: token };
    this.setState({ isAuthenticated: auth, jwt: token });
  };

  userHasNotAuthenticated = () => {
    console.log("user NOT userHasNotAuthenticated");

    this.setState({ isAuthenticated: false, jwt: null });
  };

  handleLogout = event => {
    this.userHasNotAuthenticated();
  };

  render() {
   

    const childProps = {
      isAuthenticated: this.state.isAuthenticated,
      jwt: this.state.jwt,
      userHasAuthenticated: this.userHasAuthenticated,
      userHasNotAuthenticated: this.userHasNotAuthenticated
    };


    const appStyle = {
      marginLeft: 230,
      marginTop: 120,
      width: "85%",
      height: "85%"
    };

    console.log("App.js isAuthenticated: " + childProps.isAuthenticated);

    if (!this.state.isAuthenticated) {
      return (
        <Router>
          <Route
            path="/"
            render={() => <Redirect to="/Landing" appState={childProps} />}
          />
          <Route
            path="/Landing"
            render={() => <Landing appState={childProps} />}
          />
          <Route path="/Login" render={() => <Login appState={childProps} />} />
          <Route
            path="/Register"
            render={() => <Register appState={childProps} />}
          />
        </Router>
      );
    } else {
      return (
        <Router>
          <SideNav logout={this.handleLogout} jwt={this.props.jwt} />
          <Container style={appStyle}>
            <Switch>
              <Route exact path="/" render={() => <Redirect to="/Client" />} />
              <Route path="/Login" render={() => <Redirect to="/Client" />} />
              <Route
                exact
                path="/Client"
                render={() => (
                  <ClientApp style={{ height: "100%" }} appState={childProps} />
                )}
              />
              <Route
                path="/Client/:id"
                render={() => (
                  <ClientDetail
                    style={{ height: "100%" }}
                    appState={childProps}
                  />
                )}
              />
              <Route
                path="/Alert"
                render={() => (
                  <AlertApp style={{ height: "100%" }} appState={childProps} />
                )}
              />
              <Route
                path="/Account"
                render={() => (
                  <AccountApp
                    style={{ height: "100%" }}
                    appState={childProps}
                  />
                )}
              />
            </Switch>
          </Container>
        </Router>
      );
    }
  }
}
