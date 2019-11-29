// App Imports
import React, { useEffect } from "react";
import { getClients, addClient } from "../../services/api-service";

// Material UI Components
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
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
import RefreshIcon from '@material-ui/icons/Refresh';



// Prop Types Import
import PropTypes from "prop-types";

// React Awesome Spinner
import { Ring } from "react-awesome-spinners";

// React Router
import { Link as RouterLink } from "react-router-dom";

const headCells = [
  {
    id: "name",
    numeric: false,
    label: "Client Name",
    className: "headerName",
    size: 3
  },
  {
    id: "alert",
    numeric: true,
    label: "Open Alerts",
    className: "headerAlert",
    size: 1
  },
  {
    id: "primaryContact",
    numeric: false,
    label: "Primary Contact",
    className: "headerPrimaryContact",
    size: 3
  },
  {
    id: "aso",
    numeric: false,
    label: "ASO",
    className: "headerAso",
    size: 3
  },
  {
    id: "isVerified",
    numeric: true,
    label: "Verified",
    className: "headerIsVerified",
    size: 2
  }
];

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

function ListItemLink(props) {
  const { to, clientList, clientId } = props;

  const renderLink = React.useMemo(
    () =>
      React.forwardRef((itemProps, ref) => (
        // With react-router-dom@^6.0.0 use `ref` instead of `innerRef`
        // See https://github.com/ReactTraining/react-router/issues/6056
        <RouterLink to={to} {...itemProps} innerRef={ref} />
      )),
    [to]
  );

  if (clientList.isVerified === true) {
    return (
      <li>
        <ListItem
          style={{
            paddingLeft: 0,
            paddingRight: 0,
            paddingTop: 15,
            paddingBottom: 15
          }}
          button
          value={clientList.id}
          to={`/Client/${clientList.id}`}
          component={renderLink}
        >
          <Grid style={{ paddingLeft: 14, paddingRight: 14 }} item xs={3}>
            {clientList.name}
          </Grid>
          <Grid style={{ paddingLeft: 14, paddingRight: 14 }} item xs={1}>
            {clientList.bx3_alerts.length}
          </Grid>
          <Grid style={{ paddingLeft: 14, paddingRight: 14 }} item xs={3}>
            {clientList.primaryContact}
          </Grid>
          <Grid style={{ paddingLeft: 14, paddingRight: 14 }} item xs={3}>
            {clientList.aso}
          </Grid>
          <Grid style={{ paddingLeft: 14, paddingRight: 14 }} item xs={2}>
            {clientList.isVerified ? <CheckIcon /> : <ClearIcon />}
          </Grid>
        </ListItem>
      </li>
    );
  } else {
    return (
      <li>
        <ListItem
          style={{
            paddingLeft: 0,
            paddingRight: 0,
            paddingTop: 15,
            paddingBottom: 15
          }}
          button
          disabled
          value={clientList.id}
        >
          <Grid style={{ paddingLeft: 14, paddingRight: 14 }} item xs={3}>
            {clientList.name}
          </Grid>
          <Grid style={{ paddingLeft: 14, paddingRight: 14 }} item xs={1}>
            {clientList.bx3_alerts.length}
          </Grid>
          <Grid style={{ paddingLeft: 14, paddingRight: 14 }} item xs={3}>
            {clientList.primaryContact}
          </Grid>
          <Grid style={{ paddingLeft: 14, paddingRight: 14 }} item xs={3}>
            {clientList.aso}
          </Grid>
          <Grid style={{ paddingLeft: 14, paddingRight: 14 }} item xs={2}>
            {clientList.isVerified ? <CheckIcon /> : <ClearIcon />}
          </Grid>
        </ListItem>
      </li>
    );
  }
}

const ClientApp = appState => {
  appState = appState.appState;

  const classes = useStyles();


  const [table, setTable] = React.useState({
    order: "desc",
    orderBy: "name",
    property: ""
  });

  const [client, setClient] = React.useState({
    name: "",
    aso: "",
    primaryContact: "",
    list: [],
    loading: true
  });
  const [modal, setModal] = React.useState({
    open: false
  });
  const [snacks, setSnack] = React.useState({
    open: false,
    type: 0,
    name: ""
  });

  const openModal = () => {
    setModal({ ...modal, open: true });
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

  const handleInputChange = property => event => {
    setClient({ ...client, [property]: event.target.value });
  };

  const sendSnack = response => {
    setSnack({ ...snacks, open: true, name: response.msg });
  };

  const handleAddClient = async event => {
    event.preventDefault();
    console.log(appState);
    const postResponse = await addClient(appState.jwt, client);
    const response = await postResponse.json();
    console.log(response);
    closeModal();
    sendSnack(response);
    setClient({ ...client, loading: true });
    fetchClientList();
  };

  const handleRequestSort = (event, property) => {
    const isDesc = table.orderBy === table.property && table.order === "desc";
    setTable({ ...table, v: isDesc ? "asc" : "desc" });
    setTable({ ...table, orderBy: property });
  };

  const fetchClientList = async () => {

    //setClient({ ...client, loading: true });

    console.log(appState);
    try {
      const res = await getClients(appState.jwt);
      console.log(res);
      const resJson = await res.json();
      console.log(resJson);
      setClient({ ...client, list: resJson.data, loading: false });
    } catch (error) {
      sendSnack({ body: error.name + ": Failed getting Clients!" });
    }
  };

  const refreshClientList = () => {
    setClient({ ...client,loading: true });
    fetchClientList()
  }

  useEffect(() => {
    console.log("ClientList3.js | token: " + appState.jwt);
    fetchClientList()
    console.log("ClientList3.js | clients: " + client.list);
  }, []);



  return (
    <Container>
      <Paper style={{ height: "75vh" }}>
        <div className={classes.listHeader}>
          <Grid container spacing={3} >
            <Grid item xs={12} sm={6} style={{paddingBottom:"2%"}} >
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
                paddingLeft:'1%'
              }}
              
            >
              <div>
                <Fab
                  size="small"
                  color="secondary"
                  aria-label="add"
                  className={classes.margin}
                  onClick={openModal}
                >
                  <AddIcon />
                </Fab>
              </div>
              <div         style={{
                paddingLeft:'1%'
              }}>
                <Fab
                  size="small"
                  color="primary"
                  aria-label="add"
                  className={classes.margin}
                  onClick={ refreshClientList  }
                >
                  <RefreshIcon />
                </Fab>
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
          <div
            style={{
              maxHeight: "50vh",
              overflow: "scroll",
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
          </div>
        </div>

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
              <h2 id="transition-modal-title">Add Client</h2>
              <form onSubmit={handleAddClient}>
                <TextField
                  label="Company Name"
                  className={classes.textField}
                  margin="normal"
                  value={client.name}
                  onChange={handleInputChange("name")}
                />
                <br />
                <TextField
                  label="ASO Email"
                  className={classes.textField}
                  margin="normal"
                  value={client.aso}
                  onChange={handleInputChange("aso")}
                />
                <br />
                <TextField
                  label="Primary Contact"
                  className={classes.textField}
                  margin="normal"
                  value={client.primaryContact}
                  onChange={handleInputChange("primaryContact")}
                />
                <br />
                <Button className={classes.button} type="submit">
                  Submit
                </Button>
              </form>
            </div>
          </Fade>
        </Modal>
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
  );
};

export default ClientApp;
