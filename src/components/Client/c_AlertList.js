import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { updateAlert, getAlerts } from "../../api";

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
import { Card, CardActions, CardContent, CardMedia } from "@material-ui/core/";

import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";

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
  },
}));

export default function AlertList(props) {
  var appState = props.props.appState;
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

  const [contactttt, setContact] = React.useState({
    list: [],
    loading: false
  });

  const [personName, setPersonName] = React.useState([]);


  const openModal = alert => {
    console.log(alert);
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

  const handleCheckboxChange = property => event => {
    setModal({ ...modal, [property]: event.target.checked });
  };

  const handleTextChange = property => event => {
    setModal({ ...modal, [property]: event.target.value });
  };


  const handleEditAlert = async event => {
    console.log("hello");
    console.log(modal);
    console.log(appState);

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

  const handleAddAlert = async event => {
    event.preventDefault();

    var alert = {
      name: modal.name,
      contacts: personName,
      query: modal.query,
      clientId: cid
    };
  }
  

  /*
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

  */
  /*
  return (
    <div className={classes.root}>
      <List  style={{ padding: 0, margin: "20px" }}>
        {alert.list.map(alrt => (
          <Tooltip title="Edit Alert" placement="left-center">
            <ListItem id={alrt.id} button style={{padding:10,margin:1,borderRadius:'8px'}} onClick={e => openModal(alrt)}>
                <ListItemIcon>
                  {alrt.isActive ? (
                    <Notifications />
                  ) : (
                    <NotificationsOff/>
                  )}  
                </ListItemIcon>
                <ListItemText primary={alrt.name} />
                <ListItemText primary={alrt.name} />
                <ListItemText primary={alrt.name} />

            </ListItem>
          </Tooltip>
        ))}
      </List>
      
    </div>

  );

  */

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

  return (
    <div className={classes.root}>
      <List style={{ padding: 0, margin: "20px" }}>
        {alert.list.map(alrt => (
          <Tooltip title="Edit Alert" placement="left-center">
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
              <ListItemText primary={alrt.name} />
              <ListItemText primary={alrt.name} />
            </ListItem>
          </Tooltip>
        ))}
      </List>

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
            <h1 id="transition-modal-title">Add an Alert</h1>
            <TextField
              label="Alert Name"
              className={classes.textField}
              margin="normal"
              onChange={handleTextChange("name")}
              style={{ width: "80%" }}
            />
            <br />
            <Grid container spacing={3} styles={{ height: "100%" }}>
              <Grid item xs={6} spacing={2}>
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
              <Grid item xs={6} spacing={2}>
                <Typography
                  variant="h4"
                  component="h2"
                  styles={{ marginTop: "20px", marginBottom: "20px" }}
                >
                  Condition List
                </Typography>
                <div
                  style={{
                    maxHeight: "45vh",
                    overflow: "scroll",
                    textAlign: "center"
                  }}
                >
                  <List style={{ padding: 0, margin: "20px" }}>
                    {modal.query.length > 0 &&
                      modal.query.map((query, index, arr) => (
                        <ListItem>
                          <Tooltip
                            title="Delete this Condition"
                            placement="right-center"
                            classes={classes.tooltip}
                          >
                            <Card
                              className={classes.card}
                              onClick={() => {
                                removeSubCondition(index);
                              }}
                            >
                              <CardActionArea>
                                <CardMedia
                                  className={classes}
                                  image="/static/images/cards/contemplative-reptile.jpg"
                                  title="Contemplative Reptile"
                                />
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
                </div>
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
                labelId="demo-mutiple-checkbox-label"
                id="demo-mutiple-checkbox"
                value={personName}
                input={<Input />}
                multiple
                onChange={handleContactSelect}
                styles={{ minWidth: 300 }}
                renderValue={selected => selected.join(", ")}
              >
                {contactttt.list.map((cont, index, arr) => (
                  <MenuItem key={cont.id} value={cont.id}>
                    <Checkbox checked={personName.indexOf(cont.id) > -1} />
                    <ListItemText
                      primary={cont.firstName + " " + cont.lastName}
                    />
                  </MenuItem>
                ))}
              </Select>
              <Button
                className={classes.button}
                type="submit"
                onClick={handleAddAlert}
              >
                Add Alert!
              </Button>
            </FormControl>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
