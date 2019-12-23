// App Imports
import React, { useEffect } from "react";
import { getClient, updateClient, deleteClient } from "../services/api-service";

import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";

// You should probably reseach this
//import { matchPath } from "react-router";

// Material UI Components
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import AppBar from "@material-ui/core/AppBar";
import TextField from "@material-ui/core/TextField";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Button from "@material-ui/core/Button";
import EditIcon from "@material-ui/icons/Edit";
import IconButton from "@material-ui/core/IconButton";
import Snackbar from "@material-ui/core/Snackbar";
import CloseIcon from "@material-ui/icons/Close";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Container from "@material-ui/core/Container";

// Custom Components
import AlertApp from "../components/client.alert";
import ContactApp from "../components/client.contact";

// React Awesome Spinner
import { Ring } from "react-awesome-spinners";

import { withRouter } from "react-router-dom";

//Header
import Header from "../components/header";

// Auth
import auth from "../services/auth-service";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  detailHeader: {
    padding: theme.spacing(3, 2),
    height: "100%"
  },
  detailContent: {
    marginLeft: theme.spacing(3, 2),
    paddingTop: theme.spacing(3, 2)
  },
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
  contactCard: {
    height: "80vh",
    width: "100%",
    borderRadius: "25px"
  },
  alertCard: {
    height: "80vh",
    width: "100%",
    borderRadius: "25px"
  },
  wrapper: {
    display: "flex"
  },
  leftCol: {
    flex: " 0 0 33%",
    width: "65%",
    marginRight: "5%"
  },
  rightCol: {
    flex: "1",
    width: "30%"
  }
}));

const ClientDetail = () => {
  const cid = window.location.pathname.replace("/Client/", "");

  const classes = useStyles();

  const [snacks, setSnack] = React.useState({
    open: false,
    type: 0,
    name: ""
  });

  const [modal, setModal] = React.useState({
    open: false
  });

  const [client, setClient] = React.useState({
    id: cid,
    data: {},
    name: "",
    aso: "",
    primaryContact: "",
    loading: true
  });

  const [dialog, setDialog] = React.useState({
    open: false
  });

  const fetchClient = async () => {
    try {
      console.log(cid);
      const res = await getClient(auth.getJwt(), cid);
      const resJson = await res.json();
      console.log(resJson);
      setClient({
        ...client,
        data: resJson.data,
        loading: false,
        name: resJson.data.name,
        aso: resJson.data.aso,
        primaryContact: resJson.data.primaryContact
      });
    } catch (error) {
      sendSnack({ body: error.name + " getting Client Details!" });
    }
  };

  const openModal = () => {
    setModal({ ...modal, open: true });
  };

  const closeModal = () => {
    setModal({ ...modal, open: false });
  };

  const openDialog = () => {
    closeModal();
    setDialog({ ...Dialog, open: true });
  };

  const closeDialog = () => {
    setDialog({ ...Dialog, open: false });
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
    setClient({ ...client, [property]: event.target.value });
  };

  const handleDeleteClient = async event => {
    event.preventDefault();
    try {
      const res = await deleteClient(auth.getJwt(), cid);
      console.log(res);
      const resJson = await res.json();
      console.log(resJson);
      if (resJson.statusCode === 200) {
        sendSnack({ body: resJson.msg });
        closeDialog();
        //appState.history.push("/Client");
      } else {
        closeDialog();
        sendSnack({ body: `Error Deleting Client!: ${resJson.statusCode}` });
      }
    } catch (error) {
      closeDialog();
      sendSnack({ body: `Error Deleting Client!: ${error.name}` });
    }
  };

  const handleEditClient = async event => {
    setClient({ ...client, loading: true });
    event.preventDefault();
    try {
      const res = await updateClient(auth.getJwt(), client, cid);
      console.log(res);
      const resJson = await res.json();
      console.log(resJson);
      closeModal();
      if (resJson.statusCode === 200) {
        console.log(resJson.data);
        setClient({ ...client, data: resJson.data, loading: false });
        sendSnack({ body: resJson.msg });
      } else {
        closeModal();
        sendSnack({ body: `Error Updating Client!: ${resJson.statusCode}` });
      }
    } catch (error) {
      closeModal();
      sendSnack({ body: `Error Updating Client!: ${error.name}` });
    }
  };

  useEffect(() => {
    console.log(window.location.pathname);
    fetchClient();
    console.log(client.data);
  }, []);

  return (
    <div>
      <Header style={{ marginBottom: "3%" }} />
      <Container>
        <div className={classes.wrapper}>
          <div className={classes.leftCol}>
            <Paper className={classes.alertCard}>
              <AlertApp />
            </Paper>
          </div>

          <div className={classes.rightCol}>
            <Paper className={classes.contactCard}>
              <ContactApp />
            </Paper>
          </div>

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
      </Container>
    </div>
  );
};

export default withRouter(ClientDetail);
