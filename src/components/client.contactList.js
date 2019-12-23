import React from "react";
import {
  updateContact,
  getContacts,
  deleteContact
} from "../services/api-service";

import { makeStyles } from "@material-ui/core/styles";

// Helper
import { validateEmail, validateEmpty } from "../services/validation-service";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

// React Awesome Spinner
import { Ring } from "react-awesome-spinners";

// React Scrollbars Custom
import RSC from "react-scrollbars-custom";

// Auth
import auth from "../services/auth-service";
import { Container } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    height: "50vh"
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular
  }
}));

const ContactList = props => {
  var contacts = props.props.contacts;

  const cid = window.location.pathname.replace("/Client/", "");
  const classes = useStyles();

  const [dialog, setDialog] = React.useState({
    open: false,
    fname: "",
    lname: "",
    email: "",
    id: ""
  });

  const [snacks, setSnack] = React.useState({
    open: false,
    type: 0,
    name: ""
  });
  const [contact, setContact] = React.useState({
    list: contacts,
    loading: false
  });

  const [delDialog, setDelDialog] = React.useState({
    open: false,
    contactDelId: null
  });

  const [validForm, setValidForm] = React.useState({
    fname: false,
    lname: false,
    email: false
  });

  const [buttonDisable, setButtonDisable] = React.useState(true);

  const openDialog = contact => {
    setValidForm({
      fname: true,
      lname: true,
      email: true,
    });
    setDialog({
      ...dialog,
      open: true,
      fname: contact.firstName,
      lname: contact.lastName,
      email: contact.email,
      contactid: contact.id
    });
  };

  const closeDialog = () => {
    setDialog({ ...dialog, open: false });
  };

  const closeSnack = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnack({ ...snacks, open: false });
  };

  const sendSnack = response => {
    setSnack({ ...snacks, open: true, name: response.body });
  };

  const openDelDialog = () => {
    var contactid = dialog.contactid;
    closeDialog();
    setDelDialog({ ...dialog, open: true, contactDelId: contactid });
  };

  const closeDelDialog = () => {
    setDelDialog({ ...dialog, open: false });
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
        console.log('setting false',validForm)
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

    console.log(validForm)

    if (
      validForm.email === true &&
      validForm.fname === true &&
      validForm.lname === true
    ) {
      console.log('form valid')
      setButtonDisable(false);
    } else {
      setButtonDisable(true);
    }
  };

  const handleEditContact = async event => {
    console.log(dialog);

    event.preventDefault();
    try {
      const res = await updateContact(auth.getJwt(), dialog);
      console.log(res);
      const resJson = await res.json();
      console.log(resJson);

      if (resJson.statusCode === 200) {
        setContact({ ...contact, loading: true });
        closeDialog();
        fetchContacts();
        sendSnack({ body: "Contact Updated!" });
      } else {
        closeDialog();
        sendSnack({ body: `Error Updating Contact!: ${resJson.statusCode}` });
      }
    } catch (error) {
      closeDialog();
      sendSnack({ body: `Error Updating Contact!: ${error.name}` });
    }
  };

  const fetchContacts = async () => {
    try {
      const res = await getContacts(auth.getJwt(), cid);
      const resJson = await res.json();
      console.log(resJson);
      setContact({ ...contact, list: resJson.data, loading: false });
    } catch (error) {
      sendSnack({ body: error.name + " getting Contacts" });
    }
  };

  const handleDeleteContact = async event => {
    event.preventDefault();
    try {
      var promise = new Promise(async function(resolve, reject) {
        console.log(delDialog.contactDelId);
        var res = await deleteContact(auth.getJwt(), delDialog.contactDelId);
        console.log(res);
        var resJson = await res.json();
        console.log(resJson);
        if (resJson.statusCode === 200) {
          resolve(resJson);
        } else {
          closeDelDialog();
          sendSnack({ body: `Error Deleting Contact!: ${resJson.statusCode}` });
          reject(resJson);
        }
      });

      promise.then(function(value) {
        closeDelDialog();
        sendSnack({ body: value.msg });
        setContact({ ...contact, loading: true });
        fetchContacts();
      });
    } catch (error) {
      closeDelDialog();
      sendSnack({ body: `Error Deleting Alert!: ${error.name}` });
    }
  };

  return (
    <Container>
      <RSC
        style={{
          height: "40vh",
          textAlign: "center"
        }}
      >
        {contact.loading ? (
          <Ring style={{ margin: "auto" }} />
        ) : (
          <List>
            {contact.list.map(cont => (
              <ListItem style={{}} key={cont.id}>
                <Tooltip title="Edit Contact" placement="right">
                  <Button
                    id={cont.id}
                    onClick={e => openDialog(cont)}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      justifyContent: "left"
                    }}
                  >
                    {cont.firstName} {cont.lastName}
                  </Button>
                </Tooltip>
              </ListItem>
            ))}
          </List>
        )}
      </RSC>

      <Dialog
        open={dialog.open}
        onClose={closeDialog}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Edit Contact</DialogTitle>
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
            defaultValue={dialog.fname}
          />
          <br />
          <TextField
            label="Last Name"
            className={classes.textField}
            margin="normal"
            onChange={handleInputChange("lname")}
            error={!validForm.lname}
            defaultValue={dialog.lname}
          />
          <br />
          <TextField
            label="Email"
            className={classes.textField}
            margin="normal"
            onChange={handleInputChange("email")}
            error={!validForm.email}
            defaultValue={dialog.email}
          />
        </DialogContent>
        <DialogActions>
          <Button
            color="secondary"
            onClick={openDelDialog}
          >
            DELETE CLIENT
          </Button>

          <Button onClick={closeDialog} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleEditContact}
            color="primary"
            disabled={buttonDisable}
          >
            Edit Contact
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={delDialog.open}
        onClose={closeDelDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure you want to delete"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Make sure you want to delete this alert before proceeding. All data
            will be lost.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDelDialog} color="primary">
            Disagree
          </Button>
          <Button onClick={handleDeleteContact} color="primary" autoFocus>
            Agree
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
    </Container>
  );
};

export default ContactList;
