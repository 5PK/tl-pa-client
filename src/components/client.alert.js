// App Imports
import React, { useEffect, useState } from "react";
import { getAlerts, addAlert, getContacts } from "../services/api-service";

// Material UI Components
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import AddIcon from "@material-ui/icons/Add";
import Fab from "@material-ui/core/Fab";
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
import Tooltip from "@material-ui/core/Tooltip";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { Card, CardActions, CardContent, CardMedia } from "@material-ui/core/";

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";

import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";

import TableSortLabel from "@material-ui/core/TableSortLabel";

// Custom Component Import
import AlertList from "./client.alertList";

// Prop Types Import
import PropTypes from "prop-types";

// React Awesome Spinner
import { Ring } from "react-awesome-spinners";
import { Divider } from "@material-ui/core";

// Auth
import auth from "../services/auth-service";

const useStyles = makeStyles(theme => ({
  dialog: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  card: {
    minWidth: 275,
    boxShadow: "0px 0px",
    borderRadius: "0px"
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
    outline: 0,
    height: "90%",
    width: "90%",
    maxHeight: "90%"
  },
  lItem: {
    padding: 0,
    margin: 0
  },
  formControl: {
    margin: theme.spacing(3)
  },
  alertNameInput: {
    margin: theme.spacing(3),
    width: "80%"
  },
  tooltip: {
    backgroundColor: "white",
    color: "lightblue",
    fontSize: 11
  },
  test: {
    height: "100%"
  }
}));

const headCells = [
  {
    id: "isActive",
    numeric: true,
    label: "Active",
    className: "headerIsActive",
    size: 1
  },
  {
    id: "name",
    numeric: false,
    label: "Alert Name",
    className: "headerName",
    size: 4
  },
  {
    id: "conditionLength",
    numeric: true,
    label: "# of Conditions",
    className: "headerConditionLength",
    size: 4
  },
  {
    id: "contactLength",
    numeric: true,
    label: "# of Contacts",
    className: "headerContactLength",
    size: 3
  }
];

function EnhancedTableHead(props) {
  const { classes, order, orderBy } = props;

  const flexContainer = {
    display: "flex",
    flexDirection: "row",
    padding: 0
  };

  return (
    <div>
      <List style={flexContainer}>
        {headCells.map(headCell => (
          <ListItem
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            className={headCell.className}
          >
            <TableSortLabel active={orderBy === headCell.id} direction={order}>
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
          </ListItem>
        ))}
      </List>
      <Divider />
    </div>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired
};

const AlertApp = () => {
  const classes = useStyles();
  const cid = window.location.pathname.replace("/Client/", "");

  const [table, setTable] = React.useState({
    order: "desc",
    orderBy: "name",
    property: ""
  });

  const [alert, setAlert] = React.useState({
    list: [],
    loading: true
  });

  const [dialog, setDialog] = React.useState({
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

  const [contacts, setContact] = React.useState({
    list: [],
    loading: false
  });

  const [personName, setPersonName] = React.useState([]);

  const openDialog = async () => {
    const contactList = await fetchContacts();

    console.log(contactList);
    setContact({ ...contacts, list: contactList });

    if (contactList.length > 0) {
      setDialog({ ...dialog, open: true });
    } else {
      sendSnack({ msg: "Create a Contact before an Alert!" });
    }
  };

  const closeDialog = () => {
    setDialog({
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

    setPersonName([]);
  };

  const closeSnack = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnack({ ...snacks, open: false });
  };

  const sendSnack = response => {
    setSnack({ ...snacks, open: true, name: response.msg });
  };

  const fetchAlerts = async () => {
    console.log("clientId: " + cid);

    try {
      const res = await getAlerts(auth.getJwt(), cid);
      console.log(res);
      const resJson = await res.json();
      console.log(resJson);
      setAlert({ ...alert, list: resJson.data, loading: false });
    } catch (error) {
      sendSnack({ body: error.name + " getting Alerts" });
    }
  };

  const fetchContacts = async () => {
    try {
      const res = await getContacts(auth.getJwt(), cid);
      console.log(res);
      const resJson = await res.json();
      console.log(resJson);
      console.log(resJson.data);
      return resJson.data;
    } catch (error) {
      sendSnack({ body: error.name + " getting Contacts" });
      return [];
    }
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
      name: dialog.name,
      contacts: personName,
      query: dialog.query,
      clientId: cid
    };

    closeDialog();
    const postResponse = await addAlert(auth.getJwt(), alert);
    const response = await postResponse.json();
    console.log(response);
    sendSnack(response);
    setAlert({ ...alert, loading: true });
    fetchAlerts();
  };

  const handleCheckboxChange = property => event => {
    if (property == "cpc") {
      //setDialog({ ...dialog, [property]: event.target.checked });

      setDialog({
        ...dialog,
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
      setDialog({ ...dialog, [property]: event.target.checked, cpc: false });
    }
  };

  const handleTextChange = property => event => {
    setDialog({ ...dialog, [property]: event.target.value });
  };

  const removeSubCondition = index => {
    console.log(index);
    var newQuery = dialog.query;
    newQuery.splice(index, 1);
    setDialog({ ...dialog, query: newQuery });
  };

  const addSubCondition = () => {
    var query = dialog.query;

    console.log(query);

    var subCondition = {
      conditionText: dialog.conditionText,
      title: dialog.title,
      abstract: dialog.abstract,
      spec: dialog.spec,
      claims: dialog.claims,
      applicant: dialog.applicant,
      inventor: dialog.inventor,
      assignee: dialog.assignee,
      cpc: dialog.cpc
    };

    query.push(subCondition);

    setDialog({ ...dialog, query: query });
  };

  function handleRequestSort(event, property) {
    const isDesc = table.orderBy === table.property && table.order === "desc";
    setTable({ ...table, order: isDesc ? "asc" : "desc" });
    setTable({ ...table, orderBy: property });
  }

  const {
    title,
    abstract,
    spec,
    claims,
    cpc,
    applicant,
    inventor,
    assignee
  } = dialog;

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250
      }
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Typography variant="h4" component="h2">
            Open Alerts
          </Typography>
        </Grid>
        <Grid
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
            onClick={openDialog}
          >
            <AddIcon />
          </Fab>
        </Grid>
      </Grid>
      <div
        className={classes.table}
        aria-labelledby="Client List"
        size={"medium"}
      >
        <EnhancedTableHead
          classes={classes}
          order={"asc"}
          orderBy={"null"}
          onRequestSort={handleRequestSort}
        />
      </div>
      <div
        style={{
          maxHeight: "50vh",
          textAlign: "center"
        }}
      >
        {alert.loading ? (
          <Ring style={{ margin: "auto" }} />
        ) : (
          <AlertList
            alerts={alert.list}
            props={{ alerts: alert.list, contacts: contacts.list }}
          />
        )}
      </div>

      <Dialog
        open={dialog.open}
        onClose={closeDialog}
        aria-labelledby="form-dialog-title"
        fullWidth={true}
        maxWidth={"md"}
      >
        <DialogTitle id="form-dialog-title">Add Alert</DialogTitle>
        <DialogContent>
          <TextField
            label="Alert Name"
            className={classes.textField}
            margin="normal"
            onChange={handleTextChange("name")}
            contentStyle={{ width: "100%", maxWidth: "none" }}
          />
          <br />
          <Grid container spacing={3} styles={{ height: "100%" }}>
            <Grid item xs={6}>
              <Typography
                variant="h5"
                component="h2"
                styles={{ marginTop: "20px", marginBottom: "20px" }}
              >
                Create Sub Condition
              </Typography>
              <FormControl component="fieldset" className={classes.formControl}>
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
                variant="h5"
                component="h2"
                styles={{ marginTop: "20px", marginBottom: "20px" }}
              >
                Condition List
              </Typography>
              <div
                style={{
                  maxHeight: "45vh",
                  textAlign: "center"
                }}
              >
                <List style={{ padding: 0, margin: "20px" }}>
                  {dialog.query.length > 0 &&
                    dialog.query.map((query, index, arr) => (
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
                                  {String(query.title)} {String(query.abstract)}{" "}
                                  {String(query.spec)} {String(query.claims)}
                                  {String(query.cpc)} {String(query.applicant)}{" "}
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
              Add Contacts
            </InputLabel>
            <Select
              id="demo-mutiple-checkbox"
              value={personName}
              input={<Input />}
              multiple
              onChange={handleContactSelect}
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
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleAddAlert} color="primary">
            Add Alert
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
};

export default AlertApp;
