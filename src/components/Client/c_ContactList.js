import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";

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

export default function ContactList(contacts) {
  console.log(contacts);
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <List style={{ padding: 0, margin: "20px" }}>
        {contacts.contacts.map(contact => (
          <ListItem style={{padding:0,margin:1}}>
           <Typography>hello</Typography>
          </ListItem>
        ))}
      </List>
    </div>
  );
}
