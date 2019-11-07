// App Imports
import React, { useState, useEffect } from "react";
import axios from "axios";

// Material UI Components
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Fab from "@material-ui/core/Fab";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";

// Custom Component Import
import ClientList from "../Client/ClientList";



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
    <div>
      <Fab
        size="small"
        color="secondary"
        aria-label="add"
        className={classes.margin}
      >
        <AddIcon />
      </Fab>
 
    </div>
  );
}

export default AlertApp