import React from "react";
import {
  updateContact,
  getContacts,
  deleteContact
} from "../services/api-service";

import { makeStyles } from "@material-ui/core/styles";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";

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

// React Custom Scrollbars
import { Scrollbars } from "react-custom-scrollbars";

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

const ContactList = props => {
 
  var contacts = props.props.contacts;

  const cid = window.location.pathname.replace("/Client/", "");
  const classes = useStyles();

  const [modal, setModal] = React.useState({
    open: false,
    firstName: "",
    lastName: "",
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

  const [dialog, setDialog] = React.useState({
    open: false,
    contactDelId: null
  });

  const openModal = contact => {
    console.log(contact);
    setModal({
      ...modal,
      open: true,
      firstName: contact.firstName,
      lastName: contact.lastName,
      email: contact.email,
      contactid: contact.id
    });
  };

  const closeModal = () => {
    setModal({ ...modal, open: false });
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

  const openDialog = () => {
    var contactid = modal.contactid;
    closeModal();
    setDialog({ ...Dialog, open: true, contactDelId: contactid });
  };

  const closeDialog = () => {
    setDialog({ ...Dialog, open: false });
  };

  const handleInputChange = property => event => {
    setModal({ ...modal, [property]: event.target.value });
  };

  const handleEditContact = async event => {
    console.log("hello");
    console.log(modal);


    event.preventDefault();
    try {
      const res = await updateContact(auth.getJwt(), modal);
      console.log(res);
      const resJson = await res.json();
      console.log(resJson);

      if (resJson.statusCode === 200) {
        setContact({ ...contact, loading: true });
        closeModal();
        fetchContacts();
        sendSnack({ body: "Client Updated!" });
      } else {
        closeModal();
        sendSnack({ body: `Error Updating Client!: ${resJson.statusCode}` });
      }
    } catch (error) {
      closeModal();
      sendSnack({ body: `Error Updating Client!: ${error.name}` });
    }
  };

  const fetchContacts = async () => {
    try {
      const res = await getContacts(auth.getJwt(), cid);
      console.log(res);
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
        console.log(dialog.contactDelId);
        var res = await deleteContact(auth.getJwt(), dialog.contactDelId);
        console.log(res);
        var resJson = await res.json();
        console.log(resJson);
        if (resJson.statusCode === 200) {
          resolve(resJson);
        } else {
          closeDialog();
          sendSnack({ body: `Error Deleting Contact!: ${resJson.statusCode}` });
          reject(resJson);
        }
      });

      promise.then(function(value) {
        closeDialog();
        sendSnack({ body: value.msg });
        setContact({ ...contact, loading: true });
        fetchContacts();
      });
    } catch (error) {
      closeDialog();
      sendSnack({ body: `Error Deleting Alert!: ${error.name}` });
    }
  };

  return (
    <Container>
      <Scrollbars
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
              <ListItem style={{ }} key={cont.id}>
                <Tooltip title="Edit Contact" placement="right">
                  <Button
                    id={cont.id}
                    onClick={e => openModal(cont)}
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
      </Scrollbars>
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
            <h2 id="transition-modal-title">Edit Contact</h2>
            <form onSubmit={handleEditContact}>
              <TextField
                required
                label="First Name"
                className={classes.textField}
                margin="normal"
                defaultValue={modal.firstName}
                value={modal.firstName}
                onChange={handleInputChange("firstName")}
              />
              <br />
              <TextField
                required
                label="Last Name"
                className={classes.textField}
                margin="normal"
                value={modal.lastName}
                onChange={handleInputChange("lastName")}
                defaultValue={modal.lastName}
              />
              <br />
              <TextField
                required
                label="Email"
                className={classes.textField}
                margin="normal"
                value={modal.email}
                onChange={handleInputChange("email")}
                defaultValue={modal.email}
              />
              <br />
              <Button className={classes.button} type="submit">
                Submit
              </Button>
              <Button
                color="secondary"
                className={classes.button}
                onClick={openDialog}
              >
                DELETE CLIENT
              </Button>
            </form>
          </div>
        </Fade>
      </Modal>

      <Dialog
        open={dialog.open}
        onClose={closeDialog}
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
          <Button onClick={closeDialog} color="primary">
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
}


export default ContactList