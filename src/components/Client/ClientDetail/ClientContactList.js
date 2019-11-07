// App Imports
import React, { useState, useEffect } from "react";


// Material UI Components
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Grid from "@material-ui/core/Grid";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import AddIcon from "@material-ui/icons/Add"
import Fab from "@material-ui/core/Fab"
import Modal from "@material-ui/core/Modal"
import Backdrop from "@material-ui/core/Backdrop"
import Fade from "@material-ui/core/Fade"
import TextField from "@material-ui/core/TextField"
import Paper from "@material-ui/core/Paper"
import Typography from "@material-ui/core/Typography"


import IconButton from "@material-ui/core/IconButton";


const useStyles = makeStyles(theme => ({
  card: {
    minWidth: 275
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)"
  },
  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  },
  root: {
    padding: theme.spacing(3, 2)
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1
  },
  table: {
    minWidth: 750
  },
  clientList: {
    padding: 0
  },
  tableHeadCell: {
    width: "20%"
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "1px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    outline: 0
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
}));

function ClientContactList(appState) {
  const classes = useStyles();

  const clientId = window.location.pathname.replace("/Client/", "")

  appState = appState.appState;

  const [v, setValues] = React.useState({
    order: "asc",
    orderBy: "Contacts",
    page: 0,
    rowsPerPage: 5,
    clientContacts: [],
    open: false
  });

  useEffect(() => {
    console.log(v);
    //fetchClientContacts();
  }, []);


  const fetchClientContacts = async () => {

    console.log("clientId: " + clientId)

    await fetch("http://localhost:6969/contact/?clientId=" + clientId, {
        method: "GET",
        headers: {
          jwt: appState.jwt,
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      })
      .then(response => response.json())
      .then(responseJson => {
        setValues({ ...v, clientContacts: responseJson });
      })
      .catch(error => {
        alert(error);
      });
  };



  const handleAddAlert = async event => {
    event.preventDefault();

    fetch("http://localhost:6969/alert", {
      method: "POST",
      headers: {
        jwt: appState.jwt,
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: v.clientName,
        query: v.clientAso,
        clientId: clientId
      })
    })
      .then(response => response.json())
      .then(responseJson => {
        alert(responseJson);
      })
      .catch(error => {
        alert(error);
      });
  };

  const handleOpen = () => {
    //setOpen(true)
    setValues({ ...v, open: true })
  }

  const handleClose = () => {
    //setOpen(false)
    setValues({ ...v, open: false })
  }

  const handleChange = property => event => {
    setValues({ ...v, [property]: event.target.value })
  }

  return (
    
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Typography variant="h4" component="h2">
            Contacts
          </Typography>
        </Grid>
        <Grid
          xs={12}
          sm={6}
          container
          alignItems="flex-end"
          justify="flex-end"
          direction="row"
        >
          <Fab
            size="small"
            color="secondary"
            aria-label="add"
            className={classes.margin}
            onClick={handleOpen}
          >
            <AddIcon />
          </Fab>
        </Grid>
      </Grid>
      
   
   
      <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={v.open}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500
          }}
        >
          <Fade in={v.open}>
            <div className={classes.paper}>
              <h2 id="transition-modal-title">Add Alert</h2>
              <form >
                <TextField
                  label="Alert Name"
                  className={classes.textField}
                  margin="normal"
                  onSubmit={handleAddAlert}
                  onChange={handleChange("alertName")}
                />
                <TextField
                  label="Query"
                  className={classes.textField}
                  margin="normal"
                  onChange={handleChange("clientQuery")}
                />
                <Button className={classes.button} type="submit">
                  Submit
                </Button>
              </form>
            </div>
          </Fade>
        </Modal>
    </div>
  );
}

export default ClientContactList;
