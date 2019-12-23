// App Imports
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";


import Login from "./containers/login";
import Register from "./containers/register";
import Landing from "./containers/landing";

import Client from "./containers/client";

import ClientDetail from "./containers/client.detail";
import { ProtectedRoute } from "./components/protected.route";

const App = () => {
  return (
    <div>
      <Switch>
        <Route exact path="/" component={Landing} />
        <Route exact path="/Login" component={Login} />
        <Route exact path="/Register" component={Register} />
        <ProtectedRoute exact path="/Client" component={Client} />
        <ProtectedRoute exact path="/Client/:id" component={ClientDetail} />
        <Route path="*" component={() => "404 NOT FOUND"} />
      </Switch>
    </div>
  );
};

export default App;
