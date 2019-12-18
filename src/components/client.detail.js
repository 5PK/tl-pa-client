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
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
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

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

// Custom Components
import AlertApp from "./client.alert";
import ContactApp from "./client.contact";

// React Awesome Spinner
import { Ring } from "react-awesome-spinners";

import { withRouter } from 'react-router-dom';


function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      <Box p={3}>{children}</Box>
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`
  };
}

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
    marginTop: "5%",
    height: "65%",
    width: "90%"
  },
  clientCard: {
    height: "25%",
    width: "90%"
  },
  alertCard: {
    height: "95%",
    width: "100%"
  },
  wrapper: {
    display: "flex",
    height: "100%",
    width: "100%"
  },
  leftCol: {
    flex: " 0 0 33%",
    width: "30%"
  },
  rightCol: {
    flex: "1",
    width: "70%"
  },
  clientEdit: {
    display: "inlineBlock"
  },
  clientTitle: {
    display: "inlineBlock"
  },
  clientTitle: {
    display: "inlineBlock"
  }
}));

function ClientDetail(appState) {
  appState = appState.appState;
  const cid = window.location.pathname.replace("/Client/", "");

  const classes = useStyles();

  const [snacks, setSnack] = React.useState({
    open: false,
    type: 0,
    name: ""
  });

  const [tab, setTab] = React.useState({
    value: 0
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

  const handleTabChange = (event, newValue) => {
    setTab({ ...tab, value: newValue });
  };

  const fetchClient = async () => {
    try {
      console.log(cid);
      const res = await getClient(appState.jwt, cid);
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
    closeModal()
    setDialog({...Dialog, open:true});
  };

  const closeDialog = () => {
    setDialog({...Dialog, open:false});
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
      const res = await deleteClient(appState.jwt, cid);
      console.log(res);
      const resJson = await res.json();
      console.log(resJson);
      if (resJson.statusCode === 200) {
        
        sendSnack({ body: resJson.msg });
        closeDialog();
        appState.history.push('/Client');

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
      const res = await updateClient(appState.jwt, client, cid);
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
    <div className={classes.wrapper}>
      <div className={classes.leftCol}>
        <Paper className={classes.clientCard}>
          {client.loading ? (
            <Ring style={{ margin: "auto" }} />
          ) : (
            <div className={classes.detailHeader}>
              <Typography
                variant="h4"
                component="h2"
                style={{ display: "inline-block" }}
              >
                {client.data.name}
              </Typography>
              <IconButton
                size="medium"
                aria-label="delete"
                style={{ display: "inline-block", float: "right" }}
                onClick={openModal}
              >
                <EditIcon />
              </IconButton>
              <br />
              <div style={{ marginTop: "10%" }}>
                <Typography variant="caption" gutterBottom>
                  ASO: {client.data.aso}
                </Typography>
                <br />
                <Typography variant="caption" gutterBottom>
                  Primary Contact: {client.data.primaryContact}
                </Typography>
              </div>
            </div>
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
                <h2 id="transition-modal-title">Edit Client</h2>
                <form onSubmit={handleEditClient}>
                  <TextField
                    required
                    label="Company Name"
                    className={classes.textField}
                    margin="normal"
                    defaultValue={client.name}
                    value={client.name}
                    onChange={handleInputChange("name")}
                  />
                  <br />
                  <TextField
                    required
                    label="ASO"
                    className={classes.textField}
                    margin="normal"
                    value={client.aso}
                    onChange={handleInputChange("aso")}
                    defaultValue={client.name}
                  />
                  <br />
                  <TextField
                    required
                    label="Primary Contact"
                    className={classes.textField}
                    margin="normal"
                    value={client.primaryContact}
                    onChange={handleInputChange("primaryContact")}
                    defaultValue={client.primaryContact}
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
              {"Are you sure you want to delete?"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Make sure you want to delete this client before proceeding. All data will be lost.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={closeDialog} color="primary">
                Disagree
              </Button>
              <Button onClick={handleDeleteClient} color="primary" autoFocus>
                Agree
              </Button>
            </DialogActions>
          </Dialog>
        </Paper>

        <Paper className={classes.contactCard}>
          <ContactApp appState={appState} />
        </Paper>
      </div>

      <div className={classes.rightCol}>
        <Paper className={classes.alertCard}>
          <AppBar position="static">
            <Tabs value={tab.value} onChange={handleTabChange}>
              <Tab label="Open Alerts" {...a11yProps(0)} />
            </Tabs>
          </AppBar>
          <TabPanel value={tab.value} index={0}>
            <AlertApp appState={appState} />
          </TabPanel>
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
  );
}

export default withRouter(ClientDetail);
