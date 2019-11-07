// App Imports
import React, { useEffect } from "react";

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

// React Awesome Spinner
import { Ring } from "react-awesome-spinners";

// Custom Components
import ClientAlertList from "./ClientAlertList";
import ClientContactList from "./ClientContactList.js";

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
    padding: theme.spacing(3, 2)
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
  }
}));

function ClientDetail(appState) {
  appState = appState.appState;
  const cid = window.location.pathname.replace("/Client/", "");

  const classes = useStyles();

  const [tab, setTab] = React.useState({
    value: 0
  });

  const [modal, setModal] = React.useState({
    open: false
  });

  const [client, setClient] = React.useState({
    id: cid,
    data: {},
    putName: "",
    putAso: "",
    putPrimaryContact: "",
    loading: true
  });

  useEffect(() => {
    console.log(window.location.pathname);
    fetchClient();
    console.log(client.data);
  }, []);

  const handleTabChange = (event, newValue) => {
    setTab({ ...tab, value: newValue });
  };

  const fetchClient = async () => {
    console.log(cid);

    const resData = await fetch("http://localhost:6969/client/" + cid, {
      method: "GET",
      headers: {
        jwt: appState.jwt,
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    });

    const client = await resData.json();
    console.log(client);
    setClient({ ...client, data: client.body, loading: false });
  };

  const openModal = () => {
    setModal({ ...modal, open: true });
  };

  const closeModal = () => {
    setModal({ ...modal, open: false });
  };

  const handleInputChange = property => event => {
    setClient({ ...client, [property]: event.target.value });
  };

  const handleDelete = () => {
    console.log("delete");
  };

  const handleEditClient = async event => {
    event.preventDefault();
    /*
    fetch("http://localhost:6969/client", {
      method: "PUT",
      headers: {
        jwt: appState.jwt,
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: v.putClientName,
        aso: v.putClientAso,
        primaryContact: v.putClientPrimaryContact
      })
    })
      .then(response => response.json())
      .then(responseJson => {
        alert(responseJson);
      })
      .catch(error => {
        alert(error);
      });
      */
  };

  return (
    <div className={classes.wrapper}>
      <div className={classes.leftCol}>
        <Paper className={classes.clientCard}>
          {client.loading ? (
            <Ring style={{ margin: "auto" }} />
          ) : (
            <div container spacing={3} className={classes.detailHeader}>
              <Typography variant="h4" component="h2">
                {client.data.name}
              </Typography>
              <br />
              <Typography variant="caption" gutterBottom>
                ASO: {client.data.aso}
              </Typography>
              <br />
              <Typography variant="caption" gutterBottom>
                Primary Contact: {client.data.primaryContact}
              </Typography>
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
                    label="Company Name"
                    className={classes.textField}
                    margin="normal"
                    placeholder={client.data.name}
                    value={client.putName}
                    onChange={handleInputChange("putName")}
                  />
                  <TextField
                    label="ASO"
                    className={classes.textField}
                    margin="normal"
                    value={client.putAso}
                    onChange={handleInputChange("putAso")}
                    placeholder={client.data.name}
                  />
                  <TextField
                    label="Primary Contact"
                    className={classes.textField}
                    margin="normal"
                    value={client.putPrimaryContact}
                    onChange={handleInputChange("putPrimaryContact")}
                  />
                  <Button className={classes.button} type="submit">
                    Submit
                  </Button>
                </form>
              </div>
            </Fade>
          </Modal>
        </Paper>

        <Paper className={classes.contactCard}>
          <ClientContactList appState={appState} />
        </Paper>
      </div>
      
      <div className={classes.rightCol}>
        <Paper className={classes.alertCard}>
          <AppBar position="static">
            <Tabs value={tab.value} onChange={handleTabChange}>
              <Tab label="Open Alerts" {...a11yProps(0)} />
              <Tab label="Sent Alerts" {...a11yProps(1)} />
            </Tabs>
          </AppBar>
          <TabPanel value={tab.value} index={0}>
            <ClientAlertList appState={appState} />
          </TabPanel>
          <TabPanel value={tab.value} index={1}>
            Item Two
          </TabPanel>
        </Paper>
      </div>
    </div>
  );
}

export default ClientDetail;
