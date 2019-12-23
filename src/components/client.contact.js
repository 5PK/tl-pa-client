// App Imports
import React, { useState, useEffect } from "react";
import { getContacts, addContact } from "../services/api-service";

// Helper
import { validateEmail, validateEmpty } from "../services/validation-service";

// Material UI Components
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import AddIcon from "@material-ui/icons/Add";
import Fab from "@material-ui/core/Fab";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";

// Custom Component Import
import ContactList from "./client.contactList";

// React Awesome Spinner
import { Ring } from "react-awesome-spinners";

// Auth
import auth from "../services/auth-service";

const useStyles = makeStyles(theme => ({
  title: {
    fontSize: 14
  },
  root: {
    padding: theme.spacing(3, 2)
  },
  table: {
    minWidth: 750
  },
  tableHeadCell: {
    width: "20%"
  },
  dialog: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }
}));

const ClientContactList = () => {
  const classes = useStyles();

  const clientId = window.location.pathname.replace("/Client/", "");

  const [snacks, setSnack] = React.useState({
    open: false,
    type: 0,
    name: ""
  });
  const [dialog, setDialog] = React.useState({
    open: false
  });
  const [contact, setContact] = React.useState({
    list: [],
    loading: true,
    fname: "",
    lname: "",
    email: ""
  });

  const [validForm, setValidForm] = React.useState({
    fname: false,
    lname: false,
    email: false
  });

  const [buttonDisable, setButtonDisable] = React.useState(true);

  useEffect(() => {
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

    try {
      const res = await getContacts(auth.getJwt(), clientId);
      const resJson = await res.json();
      setContact({ ...contact, list: resJson.data, loading: false });
    } catch (error) {
      sendSnack({ body: error.name + " getting Contacts" });
    }
  };

  const handleAddContact = async event => {
    event.preventDefault();
    try {

      const res = await addContact(auth.getJwt(), contact, clientId);
      const resJson = await res.json();
      closeDialog();
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

  const openDialog = () => {
    setDialog({ ...dialog, open: true });
  };

  const closeDialog = () => {
    setDialog({ ...dialog, open: false });
  };

  const handleInputChange = property => event => {
    if (property === "email") {
      if (validateEmail(event.target.value)) {
        setValidForm({ ...validForm, email: true });
        setContact({ ...contact, [property]: event.target.value });
      } else {
        setValidForm({ ...validForm, email: false });
        setContact({ ...contact, [property]: event.target.value });
      }
    }

    if (property === "fname") {
      if (validateEmpty(event.target.value)) {
        setValidForm({ ...validForm, fname: true });
        setContact({ ...contact, [property]: event.target.value });
      } else {
        setValidForm({ ...validForm, fname: false });
        setContact({ ...contact, [property]: event.target.value });
      }
    }

    if (property === "lname") {
      if (validateEmpty(event.target.value)) {
        setValidForm({ ...validForm, lname: true });
        setContact({ ...contact, [property]: event.target.value });
      } else {
        setValidForm({ ...validForm, lname: false });
        setContact({ ...contact, [property]: event.target.value });
      }
    }

    if (
      validForm.email === true &&
      validForm.fname === true &&
      validForm.lname === true
    ) {
      setButtonDisable(false);
    } else {
      setButtonDisable(true);
    }
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
            onClick={openDialog}
          >
            <AddIcon />
          </Fab>
        </Grid>
      </Grid>
      <div
        style={{
          marginTop: "25px",
          maxHeight: "40vh",
          textAlign: "center"
        }}
      >
        {contact.loading ? (
          <Ring style={{ margin: "auto" }} />
        ) : (
          <ContactList props={{ contacts: contact.list }} />
        )}
      </div>
      <Dialog
        open={dialog.open}
        onClose={closeDialog}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Add Contact</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Assign Contacts to your alerts. When an alert is triggered an
            automated email will be sent to contacts assigned to the alert.
          </DialogContentText>

          <TextField
            label="First Name"
            className={classes.textField}
            margin="normal"
            onChange={handleInputChange("fname")}
            error={!validForm.fname}
          />
          <br />
          <TextField
            label="Last Name"
            className={classes.textField}
            margin="normal"
            onChange={handleInputChange("lname")}
            error={!validForm.lname}
          />
          <br />
          <TextField
            label="Email"
            className={classes.textField}
            margin="normal"
            onChange={handleInputChange("email")}
            error={!validForm.email}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleAddContact}
            color="primary"
            disabled={buttonDisable}
          >
            Add Contact
          </Button>
        </DialogActions>
      </Dialog>
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
};

export default ClientContactList;
