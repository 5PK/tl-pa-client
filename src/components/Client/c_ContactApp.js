// App Imports
import React, { useState, useEffect } from "react";
import { getContacts, addContact } from "../../services/api-service";

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
import AddIcon from "@material-ui/icons/Add";
import Fab from "@material-ui/core/Fab";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

// Custom Component Import
import ContactList from "./c_ContactList";

// React Awesome Spinner
import { Ring } from "react-awesome-spinners";

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
  }
}));

function ClientContactList(appState) {
  const classes = useStyles();

  const clientId = window.location.pathname.replace("/Client/", "");

  appState = appState.appState;

  const [snacks, setSnack] = React.useState({
    open: false,
    type: 0,
    name: ""
  });
  const [modal, setModal] = React.useState({
    open: false
  });
  const [contact, setContact] = React.useState({
    list: [],
    loading: true,
    firstName: "",
    lastName: "",
    email: ""
  });

  useEffect(() => {
    console.log(appState);
    fetchClientContacts();
  }, []);

  const closeSnack = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnack({ ...snacks, open: false });
  };

  const sendSnack = response => {
    setSnack({ ...snacks, open: true, name: response.body });
  };

  const fetchClientContacts = async () => {
    console.log("clientId: " + clientId);

    try {
      const res = await getContacts(appState.jwt, clientId);
      console.log(res);
      const resJson = await res.json();
      console.log(resJson);
      setContact({ ...contact, list: resJson.data, loading: false });
    } catch (error) {
      sendSnack({ body: error.name + " getting Contacts" });
    }
  };

  const handleAddContact = async event => {
    event.preventDefault();
    try {
      console.log(appState);
      console.log(contact.firstName);
      console.log(clientId);

      const res = await addContact(appState.jwt, contact, clientId);
      console.log(res);
      const resJson = await res.json();
      console.log(resJson);
      closeModal();
      if (resJson.statusCode === 200) {
        setContact({ ...contact, loading: true });
        fetchClientContacts();
        sendSnack({ body: "Contact Added!" });
      } else {
        sendSnack({ body: resJson.msg });
      }
    } catch (error) {
      sendSnack({ body: error.name + " getting Contacts" });
    }
  };

  const openModal = () => {
    setModal({ ...modal, open: true });
  };

  const closeModal = () => {
    setModal({ ...modal, open: false });
  };

  const handleChange = property => event => {
    setContact({ ...contact, [property]: event.target.value });
  };

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
            onClick={openModal}
          >
            <AddIcon />
          </Fab>
        </Grid>
      </Grid>
      <div
        style={{
          marginTop:"25px",
          maxHeight: "40vh",
          overflow: "scroll",
          textAlign: "center"
        }}
      >
        {contact.loading ? (
          <Ring style={{ margin: "auto" }} />
        ) : (
          <ContactList props={{ contacts: contact.list, appState: appState }} />
        )}
      </div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={modal.open}
        onClose={closeModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500
        }}
      >
        <Fade in={modal.open}>
          <div className={classes.paper}>
            <h2 id="transition-modal-title">Add a New Contact!</h2>
            <form onSubmit={handleAddContact}>
              <TextField
                label="First Name"
                className={classes.textField}
                margin="normal"
                onChange={handleChange("firstName")}
              />
              <br />
              <TextField
                label="Last Name"
                className={classes.textField}
                margin="normal"
                onChange={handleChange("lastName")}
              />
              <br />
              <TextField
                label="Email"
                className={classes.textField}
                margin="normal"
                onChange={handleChange("email")}
              />
              <br />
              <Button className={classes.button} type="submit">
                Submit
              </Button>
            </form>
          </div>
        </Fade>
      </Modal>

      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left"
        }}
        open={snacks.open}
        autoHideDuration={6000}
        onClose={closeSnack}
        ContentProps={{
          "aria-describedby": "message-id"
        }}
        message={<span id="message-id">{snacks.name}</span>}
        action={[
          <IconButton
            key="close"
            aria-label="close"
            color="inherit"
            className={classes.close}
            onClick={closeSnack}
          >
            <CloseIcon />
          </IconButton>
        ]}
      />
    </div>
  );
}

export default ClientContactList;
