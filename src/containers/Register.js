import React, { Component } from "react";

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';


const styles = {
  textField: {
    marginLeft: '1px',
    marginRight:'1px',
    width: '200px'
  },
  cardContainer: {
    height: '100%',
    width: '60%',
    display: 'flex',
    flexWrap: 'wrap',
  },
  cardContent: {
    textAlign: 'center',
    height: '100%',
    
  },
  card: {
    minWidth: '275px',
    height:'80%',
    borderRadius:'0',
    transform: 'translateX( 0px)',
    borderRight: '1px solid lightgrey',
    margin: '0',
    position: 'absolute',
    top: '50%',
    left: '50%',
    mstransform: 'translate(-50%, -50%)',
    transform: 'translate(-50%, -50%)',
    width: '50%'
  },
  title:{
    marginBottom:'10%',
    marginTop:'15%'
  },
  button:{
    textAlign:'center',
    marginTop:'50px'
  },
  resize:{
    fontSize:50
  },
  regForm:{
    height:'100%'
  }
}

const inputProps = {
  fontSize: 50,
};


export default class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      email: "",
      password: "",
      confirmPassword: "",
      confirmationCode: "",
      newUser: null
    };
  }

  validateForm() {
    return (
      this.state.email.length > 0 &&
      this.state.password.length > 0 &&
      this.state.password === this.state.confirmPassword
    );
  }

  validateConfirmationForm() {
    return this.state.confirmationCode.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit = async event => {
    event.preventDefault();

    this.setState({ isLoading: true });

    try {
      /*
      const newUser = await Auth.signUp({
        username: this.state.email,
        password: this.state.password
      });
      */
      this.setState({
        newUser: false
      });
      } catch (e) {
        alert(e.message);
    }

    this.setState({ isLoading: false });
  }

  handleConfirmationSubmit = async event => {
    event.preventDefault();
  
    this.setState({ isLoading: true });
  
    try {
      /*
      await Auth.confirmSignUp(this.state.email, this.state.confirmationCode);
      await Auth.signIn(this.state.email, this.state.password);
      */
      this.props.userHasAuthenticated(true);
      this.props.history.push("/");
    } catch (e) {
      alert(e.message);
      this.setState({ isLoading: false });
    }
  }


 
  

  renderConfirmationForm() {
    return (

    <Card style={styles.card}>
      <CardContent style={styles.cardContent}>
      <Typography variant="h2" style={styles.title}>
            Patent Alert
          </Typography>
          <Typography variant="overline" display="block" gutterBottom>
            Registration
          </Typography>
        <form onSubmit={this.handleConfirmationSubmit} style={styles.regForm}>
          <TextField
                id="standard-uncontrolled"
                label="Confirmation Code"
                style={styles.textField}
                autoFocus
                type="tel"
                value={this.state.confirmationCode}
                onChange={e => this.setState({ confirmationCode: e.target.value })}
                margin="normal"
                
            />
          <p>Please check your email for the code.</p>

          <Button
            disabled={!this.validateConfirmationForm()}
            type="submit"
            variant="contained"
            style={styles.button}
          >
            Verify
          </Button>
        </form>
      </CardContent>
    </Card>
        
      
      


    );
  }

  renderForm() {
    return (
      <Card style={styles.card}>
        <CardContent style={styles.cardContent}>
          <Typography variant="h2" style={styles.title}>
            Patent Alert
          </Typography>
          <Typography variant="overline" display="block" gutterBottom>
            Registration
          </Typography>
          <form onSubmit={this.handleSubmit} style={styles.regForm}>
            <TextField
              id="standard-required"
              label="Email"
              defaultValue="example@example.com"
              style={styles.textField}
              margin="normal"
              value={this.state.email}
              onChange={e => this.setState({ email: e.target.value })}
              InputProps={inputProps}
            />
            <br/>
            <TextField
              id="standard-required"
              label="Password"
              defaultValue="Password"
              style={styles.textField}
              value={this.state.password}
              onChange={e => this.setState({ password: e.target.value })}
              type="password"
              margin="normal"
              InputProps={inputProps}
            />
            <br/>
            <TextField
              id="standard-required"
              label="Confirm Password"
              defaultValue="Confirm Password"
              style={styles.textField}
              value={this.state.password}
              onChange={this.handleChange}
              type="password"
              margin="normal"
              value={this.state.confirmPassword}
              onChange={e => this.setState({ confirmPassword: e.target.value })}
              InputProps={inputProps}
            />
            <br/>
            <Button
              disabled={!this.validateForm()}
              type="submit"
              isLoading={this.state.isLoading}
              text="Signup"
              variant="contained"
              style={styles.button}
            >
              Register
            </Button>
          </form>
        </CardContent>
      </Card>

    );
  }

  render() {
    return (
      <div className="Signup">
        {this.state.newUser === null
          ? this.renderForm()
          : this.renderConfirmationForm()}
      </div>
    );
  }
}
