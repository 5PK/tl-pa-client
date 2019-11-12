import React from "react";
import { updateContact, getContacts } from "../../api";

import { makeStyles } from "@material-ui/core/styles";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";
import ListItemText from "@material-ui/core/ListItemText";
import EditIcon from "@material-ui/icons/Edit";
import IconButton from "@material-ui/core/IconButton";
import Snackbar from "@material-ui/core/Snackbar";
import CloseIcon from "@material-ui/icons/Close";
import AddIcon from "@material-ui/icons/Add";
import TextField from "@material-ui/core/TextField";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";

// React Awesome Spinner
import { Ring } from "react-awesome-spinners";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%"
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

export default function ContactList(props) {

  var appState = props.props.appState
  var contacts = props.props.contacts

  const cid = window.location.pathname.replace("/Client/", "");
  const classes = useStyles();

  const [modal, setModal] = React.useState({
    open: false
  });

  const [snacks, setSnack] = React.useState({
    open: false,
    type: 0,
    name: ""
  });
  const [contact, setContact] = React.useState({
    list: contacts,
    loading: false,
    firstName:"",
    lastName:"",
    email:""
  });

  const openModal = test => {

    console.log(test)
    setModal({
      ...modal,
      open: true,
      firstName:test.firstName,
      lastName:test.lastName,
      email: test.email,
      id: test.id
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

  const handleInputChange = property => event => {
    setModal({ ...modal, [property]: event.target.value });
  };

  const handleEditContact = async event => {
    console.log("hello")
    console.log(modal)
    console.log(appState)

    event.preventDefault();
    try {
      const res = await updateContact(appState.jwt, modal);
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
      const res = await getContacts(appState.jwt, cid);
      console.log(res);
      const resJson = await res.json();
      console.log(resJson);
      setContact({ ...contact, list: resJson.data, loading: false });
    } catch (error) {
      sendSnack({ body: error.name + " getting Contacts" });
    }
  };

  return (
    <div className={classes.root}>
      {contact.loading ? (
        <Ring style={{ margin: "auto" }} />
      ) : (
        <List style={{ padding: 0, margin: "20px" }}>
          {contact.list.map(cont => (
            <ListItem style={{ padding: 0, margin: 1 }}>
              <Tooltip title="Edit Contact" placement="right-center">
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
            </form>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
