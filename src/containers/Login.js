// App imports
import React from "react";
import authenticationService from "../services/auth-service";
import { login } from "../services/api-service";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

import auth from "../services/auth-service";

const Login = props => {
  const [user, setUser] = React.useState({
    email: "",
    password: ""
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
  };

  const validateForm = () => {
    return user.email.length > 0 && user.password.length > 0;
  };

  const handleSubmit = async event => {
    event.preventDefault();

    const loginResponse = await login(user);
    const response = await loginResponse.json();

    if (response.statusCode === 200) {
      auth.setJwt(response.data.token);
      auth.login(() => {
        props.history.push("/client");
      });
    } else {
      alert("Login Failed!");
    }
  };

  const handleInputChange = name => event => {
    setUser({ ...user, [name]: event.target.value });
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
              value={user.email}
              onChange={handleInputChange("email")}
              margin="normal"
            />
          </div>
          <div className="row">
            <div className="input-field col s6">
              <TextField
                placeholder="Password"
                className="loginInput"
                value={user.password}
                onChange={handleInputChange("password")}
                type="password"
              />
            </div>
          </div>
          <Button style={styles.button} type="submit">
            Login
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default Login;
