// App imports
import React from "react"

import TextField from "@material-ui/core/TextField"
import Button from "@material-ui/core/Button"
import Card from "@material-ui/core/Card"
//import CardActions from '@material-ui/core/CardActions'
import CardContent from "@material-ui/core/CardContent"
import Typography from "@material-ui/core/Typography"
import axios from "axios"

import {navigate} from 'hookrouter';

const Login = appState =>{
  //let history = useHistory()
  // for some reason object ref is doubling up
  appState = appState.appState
  const [values, setValues] = React.useState({
    email: '',
    password: ''
  });
    
  const styles = {
    cardContainer: {
      height: "100%",
      width: "60%"
    },
    cardAction: {
      marginTop: "100px",
      height: "100px",
      border: "1px solid red"
    },
    cardContent: {
      textAlign: "center"
    },
    card: {
      minWidth: "275px",
      height: "60%",
      borderRadius: "0",
      borderRight: "1px solid lightgrey",
      margin: "0",
      position: "absolute",
      top: "50%",
      left: "50%",
      mstransform: "translate(-50%, -50%)",
      transform: "translate(-50%, -50%)",
      width: "50%"
    },
    title: {
      marginBottom: "10%",
      marginTop: "15%"
    },
    button: {
      textAlign: "center",
      height: "15%",
      width: "25%",
      borderRadius: "0",
      marginTop: "10px"
    }
  }

 
  const validateForm = () => {
    return values.email.length > 0 && values.password.length > 0
  }

 
  async function handleSubmit(event){
    console.log("try submit")
    console.log(values)


    event.preventDefault()

    await axios
      .post("http://localhost:6969/Login", {
        email: values.email,
        password: values.password
      })
      .then(response => {
        console.log(response.data.body)
        if (response.data.body.status === "authenticated") {
          console.log("User Login")
          console.log(
            "Login.js | 1 IsAuthenticated? -> " + appState.isAuthenticated
          )
          console.log(response.data.body.status)
          console.log(response.data.body.token)
          appState.userHasAuthenticated(true, response.data.body.token)
          
          console.log("Login.js | 2 IsAuthenticated? -> " + appState.isAuthenticated)
    
          console.log("Login.js | token? -> " + appState.jwt)

          navigate('/Client')
      
        } else {
          alert("Login Failed!")
        }
      })
      .catch(error => {
        alert(error.message)
      })
      
    
  }

  const handleInputChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };
  
    return (
        <Card style={styles.card}>
          <CardContent style={styles.cardContent}>
            <Typography variant="h2" style={styles.title}>
              Patent Alert
            </Typography>
            <Typography variant="overline" display="block" gutterBottom>
              Welcome Back.
            </Typography>
            <form onSubmit={handleSubmit}>
              <div className="row">
                <TextField
                  id="standard-name"
                  label="Email"
                  value={values.email}
                  onChange={handleInputChange('email')}
                  margin="normal"
                />
              </div>
              <div className="row">
                <div className="input-field col s6">
                  <TextField
                    placeholder="Password"
                    className="loginInput"
                    value={values.password}
                    onChange={handleInputChange('password')}
                    type="password"
                  />
                </div>
              </div>
              <Button
                style={styles.button}
                type="submit"
              >
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
    )
 
}

export default Login