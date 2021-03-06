// App Imports
import React, { useEffect } from "react";
import { getClients, addClient } from "../services/api-service";

// Helper
import { validateEmail, validateEmpty } from "../services/validation-service";

// Material UI Components
import { makeStyles } from "@material-ui/core/styles";
import Fab from "@material-ui/core/Fab";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import RefreshIcon from "@material-ui/icons/Refresh";
import Tooltip from "@material-ui/core/Tooltip";

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";

// React Scrollbars Custom
import RSC from "react-scrollbars-custom";

// Prop Types Import
import PropTypes from "prop-types";

// React Awesome Spinner
import { Ring } from "react-awesome-spinners";

// Auth
import auth from "../services/auth-service";

//Header
import Header from "../components/header";

//List Item Link
import ListItemLink from "../components/listItemLink";

const headCells = [
  {
    id: "name",
    numeric: false,
    label: "Client Name",
    width: "80%"
  },
  {
    id: "alert",
    numeric: true,
    label: "Open Alerts",
    width: "50%"
  },
  {
    id: "aso",
    numeric: false,
    label: "ASO",
    width: "35%"
  },
  {
    id: "isVerified",
    numeric: true,
    label: "Verified",
    size: "15%"
  }
];

const useStyles = makeStyles(theme => ({
  dialog: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  button: {
    textAlign: "center",
    height: "15%",
    width: "25%",
    borderRadius: "0",
    marginTop: "10px"
  },
  clientApp: {
    marginLeft: 240,
    marginTop: 100,
    width: "85%"
  },
  listHeader: {
    padding: theme.spacing(3, 2)
  }
}));

function EnhancedTableHead(props) {
  const { classes, order, orderBy } = props;

  const flexContainer = {
    display: "flex",
    flexDirection: "row",
    padding: 0
  };

  /*
  const createSortHandler = property => event => {
    onRequestSort(event, property);
  };
  */

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
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired
};

const Client = props => {
  const classes = useStyles();

  const [table, setTable] = React.useState({
    order: "desc",
    orderBy: "name",
    property: ""
  });

  const [client, setClient] = React.useState({
    name: "",
    aso: "",
    list: [],
    loading: true
  });
  const [dialog, setDialog] = React.useState({
    open: false
  });
  const [snacks, setSnack] = React.useState({
    open: false,
    type: 0,
    name: ""
  });

  const [validForm, setValidForm] = React.useState({
    email: false,
    name: false
  });

  const [buttonDisable, setButtonDisable] = React.useState(true);

  // Open Dialog Function
  const openDialog = () => {
    setDialog({ ...dialog, open: true });
  };

  // Open Dialog Function
  const closeDialog = () => {
    setDialog({ ...dialog, open: false });
  };

  // Close Snack Function
  const closeSnack = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnack({ ...snacks, open: false });
  };

  // Handle Text input changes
  const handleInputChange = property => event => {
    if (property === "aso") {
      if (validateEmail(event.target.value)) {
        setValidForm({ ...validForm, email: true });
        setClient({ ...client, [property]: event.target.value });
      } else {
        setValidForm({ ...validForm, email: false });
        setClient({ ...client, [property]: event.target.value });
      }
    }

    if (property === "name") {
      if (validateEmpty(event.target.value) === true) {
        setValidForm({ ...validForm, name: true });
        console.log("not empty", validateEmpty(event.target.value), validForm);
        setClient({ ...client, [property]: event.target.value });
      } else {
        setValidForm({ ...validForm, name: false });
        setClient({ ...client, [property]: event.target.value });
      }
    }

    if (validForm.email === true && validForm.name === true) {
      setButtonDisable(false);
    } else {
      setButtonDisable(true);
    }
  };

  // Send the Snak to the User
  const sendSnack = response => {
    setSnack({ ...snacks, open: true, name: response.msg });
  };

  // Handles Adding Clients
  const handleAddClient = async event => {
    event.preventDefault();

    const postResponse = await addClient(auth.getJwt(), client);
    const response = await postResponse.json();
    closeDialog();
    sendSnack(response);
    setClient({ ...client, loading: true });
    fetchClientList();
  };

  // Handles Sorting
  const handleRequestSort = (event, property) => {
    const isDesc = table.orderBy === table.property && table.order === "desc";
    setTable({ ...table, v: isDesc ? "asc" : "desc" });
    setTable({ ...table, orderBy: property });
  };

  // Fetch CLients
  const fetchClientList = async () => {
    try {
      const res = await getClients(auth.getJwt());
      console.log(res);
      const resJson = await res.json();
      console.log(resJson);
      setClient({ ...client, list: resJson.data, loading: false });
    } catch (error) {
      sendSnack({ body: error.name + ": Failed getting Clients!" });
    }
  };

  // Refresh Clients
  const refreshClientList = () => {
    setClient({ ...client, loading: true });
    fetchClientList();
  };

  useEffect(() => {
    console.log("ClientList3.js | token: " + auth.getJwt());
    fetchClientList();
    console.log("ClientList3.js | clients: " + client.list);
  }, []);

  return (
    <div>
      <Header />
      <Container>
        <Paper style={{ height: "75vh", borderRadius: "25px" }}>
          <div className={classes.listHeader}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} style={{ paddingBottom: "2%" }}>
                <Typography variant="h4" component="h2">
                  Client List
                </Typography>
              </Grid>
              <Grid
                container
                alignItems="center"
                justify="flex-start"
                direction="row"
                style={{
                  paddingLeft: "1%"
                }}
              >
                <div>
                  <Tooltip title="Add Client" placement="left">
                    <Fab
                      size="small"
                      color="secondary"
                      aria-label="add"
                      className={classes.margin}
                      onClick={openDialog}
                    >
                      <AddIcon />
                    </Fab>
                  </Tooltip>
                </div>
                <div
                  style={{
                    paddingLeft: "1%"
                  }}
                >
                  <Tooltip title="Refresh List" placement="right">
                    <Fab
                      size="small"
                      color="primary"
                      aria-label="add"
                      className={classes.margin}
                      onClick={refreshClientList}
                    >
                      <RefreshIcon />
                    </Fab>
                  </Tooltip>
                </div>
              </Grid>
            </Grid>
          </div>
          <div>
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
                rowCount={client.list.length > 0 ? client.list.length : 0}
              />
            </div>
            <RSC
              style={{
                height: "50vh",
                textAlign: "center"
              }}
            >
              {client.loading ? (
                <Ring style={{ margin: "auto" }} />
              ) : (
                <List style={{ padding: 0 }} className={classes.clientList}>
                  {client.list.map((clientList, index) => {
                    return (
                      <div key={clientList.id}>
                        <ListItemLink
                          clientId={clientList.id}
                          to={`/Client/${clientList.id}`}
                          clientList={clientList}
                        />
                      </div>
                    );
                  })}
                </List>
              )}
            </RSC>
          </div>
          <Dialog
            open={dialog.open}
            onClose={closeDialog}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">Add Client</DialogTitle>
            <DialogContent>
              <DialogContentText>
                To add a client, enter in the company name as well as the ASO
                (Authorized Signing Officer) email. The ASO must confirm your
                relationship before you can begin creating automated alerts.
              </DialogContentText>

              <TextField
                label="Company Name"
                className={classes.textField}
                margin="normal"
                value={client.name}
                onChange={handleInputChange("name")}
                error={!validForm.name}
              />
              <br />
              <TextField
                label="ASO Email"
                className={classes.textField}
                margin="normal"
                value={client.aso}
                onChange={handleInputChange("aso")}
                error={!validForm.email}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={closeDialog} color="secondary">
                Cancel
              </Button>
              <Button
                onClick={handleAddClient}
                color="primary"
                disabled={buttonDisable}
              >
                Add Client
              </Button>
            </DialogActions>
          </Dialog>
        </Paper>

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
      </Container>
    </div>
  );
};

export default Client;
