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

const AccountApp = ({ token }) => {
  const [clientList, setclientList] = useState("");

  console.log(token)

  var data;

  useEffect(() => {
    console.log("ClientApp.js | token: " + token)
    getClientList()
  }, [])

  const classes = useStyles();

  const [values, setValues] = React.useState({
    clientName: "",
    clientAso: "",
    clientPrimaryContact: "",
    open: false
  });

  const handleOpen = () => {
    //setOpen(true)
    setValues({ ...values, open: true });
  };

  const handleClose = () => {
    //setOpen(false)
    setValues({ ...values, open: false });
  };

  const handleChange = property => event => {
    setValues({ ...values, [property]: event.target.value });
  };

  const handleAddClient = async event => {
    event.preventDefault();

    try {
      await createClient(
        values.clientName,
        values.clientAso,
        values.clientPrimaryContact
      );
      alert("client added");
      this.props.history.push("/auth/Clients");
    } catch (e) {
      alert(e);
      //this.setState({ isLoading: false })
    }
  };

  const createClient = (name, aso, primaryContact) => {
    console.log(name);
    console.log(aso);
    console.log(primaryContact);
  };

  const getClientList = async () => {
    await axios
      .get("http://localhost:6969/client", {
        headers: {
          jwt: token
        }
      })
      .then(response => {

        console.log('cllient list')
        console.log(response);
        console.log(response.data);

        data = response.data;

        if (data.error) {
        }
      })
      .catch(error => {
        alert(error.message);
      });


  };

  return (
    <div>
      <Fab
        size="small"
        color="secondary"
        aria-label="add"
        className={classes.margin}
        onClick={handleOpen}
      >
        <AddIcon />
      </Fab>
      <ClientList />
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={values.open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500
        }}
      >
        <Fade in={values.open}>
          <div className={classes.paper}>
            <h2 id="transition-modal-title">Add Client</h2>
            <form onSubmit={handleAddClient}>
              <TextField
                label="Company Name"
                className={classes.textField}
                margin="normal"
                value={values.clientName}
                onChange={handleChange("clientName")}
              />
              <TextField
                label="ASO"
                className={classes.textField}
                margin="normal"
                value={values.clientAso}
                onChange={handleChange("clientAso")}
              />
              <TextField
                label="Primary Contact"
                className={classes.textField}
                margin="normal"
                value={values.clientPrimaryContact}
                onChange={handleChange("clientPrimaryContact")}
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

export default AccountApp