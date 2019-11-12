// App Imports
import React, { useEffect } from "react";
import { getAlerts } from "../../api";

// Material UI Components
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import AddIcon from "@material-ui/icons/Add";
import Fab from "@material-ui/core/Fab";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

// Custom Component Import
import AlertList from "./c_AlertList";

// React Awesome Spinner
import { Ring } from "react-awesome-spinners";

const useStyles = makeStyles(theme => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
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
  lItem: {
    padding: 0,
    margin: 0
  }
}));

function AlertApp(appState) {
  const classes = useStyles();
  const clientId = window.location.pathname.replace("/Client/", "");
  appState = appState.appState;

  const [v, setV] = React.useState({
    order: "asc",
    orderBy: "Open Alerts",
    page: 0,
    rowsPerPage: 5
  });

  const [alert, setAlert] = React.useState({
    list: [],
    loading: true
  });


  const [snacks, setSnack] = React.useState({
    open: false,
    type: 0,
    name: ""
  });

  useEffect(() => {
    console.log(v);
    fetchClientAlerts();
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

  const fetchClientAlerts = async () => {
    console.log("clientId: " + clientId);

    try {
      const res = await getAlerts(appState.jwt, clientId);
      console.log(res);
      const resJson = await res.json();
      console.log(resJson);
      setAlert({ ...alert, list: resJson.data, loading: false });
    } catch (error) {
      sendSnack({ body: error.name + " getting Alerts" });
    }

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
    setV({ ...v, open: true });
  };

  const handleClose = () => {
    //setOpen(false)
    setV({ ...v, open: false });
  };

  const handleChange = property => event => {
    setV({ ...v, [property]: event.target.value });
  };

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Typography variant="h4" component="h2">
            Open Alerts
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
      {alert.loading ? (
        <Ring style={{ margin: "auto" }} />
      ) : (
        <AlertList alerts={alert.list} />
      )}

      <Modal
        className={classes.modal}
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
            <form>
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

export default AlertApp;
