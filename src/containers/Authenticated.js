import React from 'react';
import { Redirect} from "react-router-dom";
import SideNav2 from '../components/SideNav2';

import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'

import Client from "../components/Client/ClientApp";
import ClientDetail from "../components/Client/ClientDetail";
import Account from "../components/Account/AccountApp";
import Alert from "../components/Alert/AlertApp";

import AppliedRoute from "../components/AppliedRoute";

import Routes from "../Routes"

export default class Authenticated extends React.Component {
  constructor(props) {
    super(props);
    this.loader = React.createRef()

    this.state = {
      
    };
  }

  componentDidMount(){
    console.log("Authenticated.js | Is Authenticated = " + this.props.isAuthenticated);
    console.log("Authenticated.js | jwt = " + this.props.jwt);
  }


  handleLogout = async event => {
    console.log("here");
    //await Auth.signOut();
    this.props.userHasAuthenticated(false);
    console.log(this.props.isAuthenticated);
    this.props.history.push("/");
  }

  getToken =  event => {
    return this.props.jwt
  }
  
  render() {

    const styles = {
      one: {
        left: '0px',
        right: '0px'
      },
      two:{
        display: 'none'
      },
      three: {
        transform: 'translateX( 0px)',
        borderRight: '1px solid lightgrey'
      },
      four: {
        display: 'block'
      },
      five:{
        borderTop: '1px solid lightgrey'
      },
      main:{
        marginLeft: '300px',
        marginTop: '72px',
        height: '100vh',
        padding: '15px'

      }
    }

    /*
    if(this.props.isAuthenticated === false){
      return <Redirect to='/' />
    }
*/
    console.log("Authenticated.js | token? -> " + this.props.jwt)

    const childProps = {
      isAuthenticated: this.props.isAuthenticated,
      jwt: this.props.jwt,
      userHasAuthenticated: this.props.userHasAuthenticated,
      userHasNotAuthenticated: this.props.userHasNotAuthenticated,
    
    }

    return(
      <Router>
        <div>
          <SideNav2 logout={this.handleLogout} jwt={this.props.jwt} />
          <Routes childProps={childProps}/>
        </div>
      </Router>
    );
  }
}






