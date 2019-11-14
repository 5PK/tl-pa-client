import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { updateAlert, getAlerts } from "../../api";


import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%"
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular
  }
}));

export default function AlertList(props) {

  var appState = props.props.appState
  var alerts = props.props.alerts

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
  const [alert, setAlert] = React.useState({
    list: alerts,
    loading: false,
    alert: {},

  });

  const openModal = alert => {
    console.log(alert)
    setModal({
      ...modal,
      open: true,
      firstName: alert.firstName,
      lastName: alert.lastName,
      email: alert.email,
      id: alert.id
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

  const handleEditAlert = async event => {
    console.log("hello")
    console.log(modal)
    console.log(appState)

    event.preventDefault();
    try {
      const res = await updateAlert(appState.jwt, modal);
      console.log(res);
      const resJson = await res.json();
      console.log(resJson);

      if (resJson.statusCode === 200) {
        setAlert({ ...alert, loading: true });
        closeModal();
        fetchAlerts();
        sendSnack({ body: "Alert Updated!" });
      } else {
        closeModal();
        sendSnack({ body: `Error Updating Alert!: ${resJson.statusCode}` });
      }
    } catch (error) {
      closeModal();
      sendSnack({ body: `Error Updating Alert!: ${error.name}` });
    }
  };

  const fetchAlerts = async () => {

    try {
      const res = await getAlerts(appState.jwt, cid);
      console.log(res);
      const resJson = await res.json();
      console.log(resJson);
      setAlert({ ...alert, list: resJson.data, loading: false });
    } catch (error) {
      sendSnack({ body: error.name + " getting Contacts" });
    }
  };

  return (
    <div className={classes.root}>
      <List style={{ padding: 0, margin: "20px" }}>
        {alert.list.map(alrt => (
          <ListItem style={{padding:0,margin:1}}>
              <Tooltip title="Edit Alert" placement="right-center">
                <Button
                  id={alrt.id}
                  onClick={e => openModal(alrt)}
                  style={{
                    width: "100%",
                    height:"10%",
                    textAlign: "left",
                    justifyContent: "left"
                  }}
                >
                  {alrt.name}
                </Button>
              </Tooltip>         
          </ListItem>
        ))}
      </List>
    </div>
  );
}
