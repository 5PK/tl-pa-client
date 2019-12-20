import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  updateAlert,
  getAlerts,
  deleteAlert,
  getContacts
} from "../services/api-service";

import Tooltip from "@material-ui/core/Tooltip";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Notifications from "@material-ui/icons/Notifications";
import NotificationsOff from "@material-ui/icons/NotificationsOff";
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
import CardActionArea from "@material-ui/core/CardActionArea";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Input from "@material-ui/core/Input";
import Checkbox from "@material-ui/core/Checkbox";
import { Card, CardContent, CardMedia } from "@material-ui/core/";

import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

// React Scrollbars Custom
import RSC from "react-scrollbars-custom";

// Auth
import auth from "../services/auth-service";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%"
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  card: {
    minWidth: 275,
    boxShadow: "0px 0px",
    borderRadius: "0px"
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "1px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    outline: 0,
    height: "90%",
    width: "90%",
    maxHeight: "90%"
  }
}));

const AlertList = props => {
  var alerts = props.props.alerts;

  const cid = window.location.pathname.replace("/Client/", "");

  const classes = useStyles();

  const [modal, setModal] = React.useState({
    open: false,
    query: [],
    name: "",
    conditionText: "",
    title: false,
    abstract: false,
    spec: false,
    claims: false,
    cpc: false,
    applicant: false,
    inventor: false,
    assignee: false,
    contacts: []
  });
  const [snacks, setSnack] = React.useState({
    open: false,
    type: 0,
    name: ""
  });
  const [alert, setAlert] = React.useState({
    list: alerts,
    loading: false,
    alert: {}
  });
  const [dialog, setDialog] = React.useState({
    open: false,
    alertDelId: null
  });

  const [contacts, setContacts] = React.useState({
    list: [],
    loading: false
  });

  const [personName, setPersonName] = React.useState([]);

  const openModal = alert => {
    console.log(alert);

    var query = JSON.parse(alert.query);
    var contacts = JSON.parse('{"arr":' + alert.contacts + "}");

    setPersonName(contacts.arr);

    setModal({
      ...modal,
      open: true,
      name: alert.name,
      alertid: alert.id,
      query: query,
      contacts: contacts.arr
    });
  };

  const closeModal = () => {
    setModal({ ...modal, open: false });
  };

  const openDialog = () => {
    var alertid = modal.alertid;
    closeModal();
    setDialog({ ...Dialog, open: true, alertDelId: alertid });
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
    setModal({ ...modal, [property]: event.target.value });
  };

  const handleCheckboxChange = property => event => {
    if (property == "cpc") {
      //setModal({ ...modal, [property]: event.target.checked });

      setModal({
        ...modal,
        title: false,
        abstract: false,
        spec: false,
        claims: false,
        applicant: false,
        inventor: false,
        assignee: false,
        cpc: true
      });
    } else {
      setModal({ ...modal, [property]: event.target.checked, cpc: false });
    }
  };

  const handleTextChange = property => event => {
    setModal({ ...modal, [property]: event.target.value });
  };

  const handleEditAlert = async event => {
    event.preventDefault();
    try {
      var promise = new Promise(async function(resolve, reject) {
        const res = await updateAlert(auth.getJwt(), modal);
        console.log(res);
        const resJson = await res.json();
        console.log(resJson);
        closeModal();
        setAlert({ ...alert, loading: true });

        if (resJson.statusCode === 200) {
          resolve(resJson);
        } else {
          sendSnack({ body: `Error Updating Alert!: ${resJson.statusCode}` });
          setAlert({ ...alert, loading: false });
          reject(resJson);
        }
      });

      promise.then(function(value) {
        sendSnack({ body: value.msg });
        fetchAlerts();
      });
    } catch (error) {
      closeModal();
      sendSnack({ body: `Error Updating Alert!: ${error.name}` });
      setAlert({ ...alert, loading: false });
    }
  };

  const fetchAlerts = async () => {
    try {
      const res = await getAlerts(auth.getJwt(), cid);
      console.log(res);
      const resJson = await res.json();
      console.log(resJson);
      setAlert({ ...alert, list: resJson.data, loading: false });
    } catch (error) {
      sendSnack({ body: error.name + " getting Contacts" });
    }
  };

  const removeSubCondition = index => {
    console.log(index);
    var newQuery = modal.query;
    newQuery.splice(index, 1);
    setModal({ ...modal, query: newQuery });
  };

  const addSubCondition = () => {
    var query = modal.query;

    console.log(query);

    var subCondition = {
      conditionText: modal.conditionText,
      title: modal.title,
      abstract: modal.abstract,
      spec: modal.spec,
      claims: modal.claims,
      applicant: modal.applicant,
      inventor: modal.inventor,
      assignee: modal.assignee
    };

    query.push(subCondition);

    setModal({ ...modal, query: query });
  };

  const handleContactSelect = event => {
    console.log(event.target.value);
    var arr = event.target.value;
    setPersonName(arr);
    console.log(personName);
  };

  const getQueryLength = queries => {
    var parseQuery = JSON.parse(queries);
    return parseQuery.length;
  };

  const getContactLength = contacts => {
    var parseContacts = JSON.parse('{"arr":' + contacts + "}");
    return parseContacts.arr.length;
  };

  const handleDeleteAlert = async event => {
    event.preventDefault();
    try {
      var promise = new Promise(async function(resolve, reject) {
        console.log(dialog.alertDelId);
        var res = await deleteAlert(auth.getJwt(), dialog.alertDelId);
        console.log(res);
        var resJson = await res.json();
        console.log(resJson);
        if (resJson.statusCode === 200) {
          resolve(resJson);
        } else {
          closeDialog();
          sendSnack({ body: `Error Deleting Alert!: ${resJson.statusCode}` });
          reject(resJson);
        }
      });

      promise.then(function(value) {
        closeDialog();
        sendSnack({ body: value.msg });
        setAlert({ ...alert, loading: true });
        fetchAlerts();
      });
    } catch (error) {
      closeDialog();
      sendSnack({ body: `Error Deleting Alert!: ${error.name}` });
    }
  };

  const fetchContacts = async () => {
    try {
      const res = await getContacts(auth.getJwt(), cid);
      console.log(res);
      const resJson = await res.json();
      console.log(resJson);
      setContacts({ ...contacts, list: resJson.data, loading: false });
    } catch (error) {
      sendSnack({ body: error.name + " getting Contacts" });
    }
  };

  const {
    title,
    abstract,
    spec,
    claims,
    cpc,
    applicant,
    inventor,
    assignee
  } = modal;

  useEffect(() => {
    fetchContacts();
  }, []);

  return (
    <div className={classes.root}>
      <RSC style={{height: "45vh",}}>
        <List style={{ padding: 0, margin: "20px" }}>
          {alert.list.map(alrt => (
            <Tooltip title="Edit Alert" placement="left" key={alrt.id}>
              <ListItem
                id={alrt.id}
                button
                style={{ padding: 10, margin: 1, borderRadius: "8px" }}
                onClick={e => openModal(alrt)}
              >
                <ListItemIcon>
                  {alrt.isActive ? <Notifications /> : <NotificationsOff />}
                </ListItemIcon>
                <ListItemText primary={alrt.name} />
                <ListItemText primary={getQueryLength(alrt.query)} />
                <ListItemText primary={getContactLength(alrt.contacts)} />
              </ListItem>
            </Tooltip>
          ))}
        </List>
      </RSC>

      <Modal
        className={classes.modal}
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
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
            <h1 id="transition-modal-title">Edit Alert</h1>
            <TextField
              label="Alert Name"
              className={classes.textField}
              margin="normal"
              onChange={handleTextChange("name")}
              style={{ width: "80%" }}
              defaultValue={modal.name}
            />
            <br />
            <Grid container spacing={3} styles={{ height: "100%" }}>
              <Grid item xs={6}>
                <Typography
                  variant="h4"
                  component="h2"
                  styles={{ marginTop: "20px", marginBottom: "20px" }}
                >
                  Create Sub Condition
                </Typography>
                <FormControl
                  component="fieldset"
                  className={classes.formControl}
                >
                  <TextField
                    label="Text to Search"
                    className={classes.textField}
                    margin="normal"
                    onChange={handleTextChange("conditionText")}
                  />

                  <FormGroup>
                    <Grid item container spacing={3}>
                      <Grid item xs={6}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={title}
                              onChange={handleCheckboxChange("title")}
                              value="title"
                            />
                          }
                          label="Title"
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={abstract}
                              onChange={handleCheckboxChange("abstract")}
                              value="abstract"
                            />
                          }
                          label="Abstract"
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={spec}
                              onChange={handleCheckboxChange("spec")}
                              value="spec"
                            />
                          }
                          label="Description and Drawings"
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={claims}
                              onChange={handleCheckboxChange("claims")}
                              value="claims"
                            />
                          }
                          label="Claims"
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={cpc}
                              onChange={handleCheckboxChange("cpc")}
                              value="cpc"
                            />
                          }
                          label="CPC Classification"
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={applicant}
                              onChange={handleCheckboxChange("applicant")}
                              value="applicant"
                            />
                          }
                          label="Applicant"
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={inventor}
                              onChange={handleCheckboxChange("inventor")}
                              value="inventor"
                            />
                          }
                          label="Inventor"
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={assignee}
                              onChange={handleCheckboxChange("assignee")}
                              value="assignee"
                            />
                          }
                          label="Assignee"
                        />
                      </Grid>
                    </Grid>
                  </FormGroup>
                  <Button
                    className={classes.button}
                    type="submit"
                    onClick={addSubCondition}
                  >
                    Add Sub Condition
                  </Button>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <Typography
                  variant="h4"
                  component="h2"
                  styles={{ marginTop: "20px", marginBottom: "20px" }}
                >
                  Condition List
                </Typography>
                <RSC
                  style={{
                    height: "45vh",
                    textAlign: "center"
                  }}
                >
                  <List style={{ padding: 0, margin: "20px" }}>
                    {modal.query.length > 0 &&
                      modal.query.map((query, index, arr) => (
                        <ListItem key={query}>
                          <Tooltip
                            title="Delete this Condition"
                            placement="right"
                            classes={classes.tooltip}
                          >
                            <Card
                              className={classes.card}
                              onClick={() => {
                                removeSubCondition(index);
                              }}
                            >
                              <CardActionArea>
                                <CardContent>
                                  <Typography
                                    gutterBottom
                                    variant="h5"
                                    component="h2"
                                  >
                                    "{query.conditionText}"
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    color="textSecondary"
                                    component="p"
                                  >
                                    Searching:
                                    {String(query.title)}{" "}
                                    {String(query.abstract)}{" "}
                                    {String(query.spec)} {String(query.claims)}
                                    {String(query.cpc)}{" "}
                                    {String(query.applicant)}{" "}
                                    {String(query.inventor)}{" "}
                                    {String(query.assignee)}
                                  </Typography>
                                </CardContent>
                              </CardActionArea>
                            </Card>
                          </Tooltip>
                        </ListItem>
                      ))}
                  </List>
                </RSC>
              </Grid>
            </Grid>

            <FormControl
              className={classes.formControl}
              styles={{ minWidth: 300 }}
            >
              <InputLabel id="demo-mutiple-checkbox-label">
                Add Recipients
              </InputLabel>
              <Select
                id="demo-mutiple-checkbox"
                value={personName}
                input={<Input />}
                multiple
                onChange={handleContactSelect}
                styles={{ minWidth: 300 }}
                renderValue={selected => selected.join(", ")}
              >
                {contacts.list.map((contact, index, arr) => (
                  <MenuItem key={contact.id} value={contact.id}>
                    <Checkbox checked={personName.indexOf(contact.id) > -1} />
                    <ListItemText
                      primary={contact.firstName + " " + contact.lastName}
                    />
                  </MenuItem>
                ))}
              </Select>
              <Button
                className={classes.button}
                type="submit"
                onClick={handleEditAlert}
              >
                Edit Alert!
              </Button>
              <Button
                color="secondary"
                className={classes.button}
                onClick={openDialog}
              >
                DELETE ALERT
              </Button>
            </FormControl>
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
          <Button onClick={handleDeleteAlert} color="primary" autoFocus>
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
    </div>
  );
}

export default AlertList