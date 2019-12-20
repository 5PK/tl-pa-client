// App Imports
import React from "react";

// Material UI Components
import Grid from "@material-ui/core/Grid";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import ListItem from "@material-ui/core/ListItem";

// React Router
import { Link as RouterLink, BrowserRouter as Router } from "react-router-dom";

function ListItemLink(props) {
  const { to, clientList } = props;

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

export default ListItemLink;
