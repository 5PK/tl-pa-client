// App Imports
import React, {
  useEffect,
  useState,
  forwardRef,
  useRef,
  useImperativeHandle
} from "react";
import axios from "axios";
import PropTypes from "prop-types";

// React Awesome Spinner
import { Ring } from "react-awesome-spinners";

// Material UI Components
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Grid from "@material-ui/core/Grid";

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
    padding: 0,
  },
  tableHeadCell: {
    width: "20%"
  }
}));

function EnhancedTableHead(props) {
  const { classes, order, orderBy, rowCount, onRequestSort } = props;

  const flexContainer = {
    display: "flex",
    flexDirection: "row",
    padding: 0
  };

  const createSortHandler = property => event => {
    onRequestSort(event, property);
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
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={order}
              onClick={createSortHandler(headCell.id)}
            >
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
  const { to, clientList, key } = props;

  const classes = useStyles();

  const renderLink = React.useMemo(
    () =>
      React.forwardRef((itemProps, ref) => (
        // With react-router-dom@^6.0.0 use `ref` instead of `innerRef`
        // See https://github.com/ReactTraining/react-router/issues/6056
        <RouterLink to={to} {...itemProps} innerRef={ref} />
      )),
    [to]
  );

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
          2
        </Grid>
        <Grid style={{ paddingLeft: 14, paddingRight: 14 }} item xs={3}>
          {clientList.primaryContact}
        </Grid>
        <Grid style={{ paddingLeft: 14, paddingRight: 14 }} item xs={3}>
          {clientList.aso}
        </Grid>
        <Grid style={{ paddingLeft: 14, paddingRight: 14 }} item xs={2}>
          {clientList.isVerified}
        </Grid>
      </ListItem>
    </li>
  );
}

const ClientList = forwardRef((props, isListLoading) => {
  var appState = props.appState;
  const classes = useStyles();

  const [loading, setLoading] = useState(true);

  const loadingRef = () => {
    setLoading(true);
  };

  useImperativeHandle(isListLoading, () => {
    return {
      loading: loadingRef
    };
  });

  const [v, setValues] = useState({
    order: "asc",
    orderBy: "Open Alerts",
    page: 0,
    rowsPerPage: 5,
    clientList: []
  });

  useEffect( () => {
    console.log(v);
    console.log("ClientList3.js | token: " + appState.jwt);
     fetchClientList();
    console.log("ClientList3.js | clients: " + v.clientList);
  }, []);

  function handleRequestSort(event, property) {
    const isDesc = v.orderBy === v.property && v.order === "desc";
    setValues({ ...v, order: isDesc ? "asc" : "desc" });
    setValues({ ...v, orderBy: property });
  }

  const fetchClientList = async () => {
    await axios
      .get("http://localhost:6969/client", {
        headers: {
          jwt: appState.jwt
        }
      })
      .then(response => {
        console.log("ClientList3");
        console.log(response);
        console.log(response.data);

        if (response.data.error) {
          console.log(response.data.error);
          setValues({ ...v, clientList: [] });
        } else {
          setValues({ ...v, clientList: response.data });
          setLoading(false);
        }
      })
      .catch(error => {
        alert(error.message);
      });
  };

  const emptyRows =
    v.rowsPerPage -
    Math.min(v.rowsPerPage, v.clientList.length - v.page * v.rowsPerPage);

  return (

    <div>
      <div
        className={classes.table}
        aria-labelledby="Client List"
        size={"medium"}
      >
        <EnhancedTableHead
          classes={classes}
          order={v.order}
          orderBy={v.orderBy}
          onRequestSort={handleRequestSort}
          rowCount={v.clientList.length > 0 ? v.clientList.length : 0}
        />
      </div>
      <div style={{maxHeight: '200px', overflow: 'scroll'}}>
        {loading ? (
          <Ring />
        ) : (
          <List style={{ padding: 0 }} className={classes.clientList}>
            {v.clientList.map((clientList, index) => {
              return (
                <ListItemLink
                  key={clientList.id}
                  to={`/Client/${clientList.id}`}
                  clientList={clientList}
                />
              );
            })}
            {emptyRows > 0 && (
              <div style={{ height: 49 * emptyRows }}>
                <div colSpan={6} />
              </div>
            )}
          </List>
        )}
      </div>
    </div>
  
  
  );
});

export default ClientList;
