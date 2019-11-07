// App Imports
import React, { useState, useEffect } from "react";

// Material UI Components
import { makeStyles } from "@material-ui/core/styles";


// Custom Component Import




const useStyles = makeStyles(theme => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "1px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    outline: 0
  },
  button: {
    textAlign: "center",
    height: "15%",
    width: "25%",
    borderRadius: "0",
    marginTop: "10px"
  },
  homeApp:{
    margin:240
  }
}));

const AlertApp = ({ token }) => {
  const [clientList, setclientList] = useState("");

  console.log(token)

  var data;

  useEffect(() => {
    console.log("AlertApp.js | token: " + token)
  }, [])

  const classes = useStyles();

  const [values, setValues] = React.useState({
    clientName: "",
    clientAso: "",
    clientPrimaryContact: "",
    open: false
  });


  return (
    <div className={classes.homeApp}>
        <h1>HELLO DARKNESS MY OLD FRIEND</h1>
    </div>
  );
}

export default AlertApp