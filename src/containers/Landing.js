import React from "react";

import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";

import { Link } from "react-router-dom";

// The usage of React.forwardRef will no longer be required for react-router-dom v6.
// see https://github.com/ReactTraining/react-router/issues/6056
const AdapterLink = React.forwardRef((props, ref) => (
  <Link innerRef={ref} {...props} />
));

const Landing = () => {
  const styles = {
    card: {
      minWidth: "275px",
      height: "60%",
      borderRadius: "25px",
      borderRight: "1px solid lightgrey",
      margin: "0",
      position: "absolute",
      top: "50%",
      left: "50%",
      mstransform: "translate(-50%, -50%)",
      transform: "translate(-50%, -50%)",
      width: "50%"
    },
    bullet: {
      display: "inline-block",
      margin: "0 2px",
      transform: "scale(0.8)"
    },
    cardContent: {
      textAlign: "center"
    },
    title: {
      marginBottom: "10%",
      marginTop: "15%"
    },
    button: {
      textAlign: "center",
      height: "15%",
      width: "50%"
    },
    buttonWrapper: {
      height: "100%",
      width: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      float: "left"
    }
  };

  return (
    <Container style={{ paddingTop: "2rem" }}>
      <Card style={styles.card}>
        <div style={{ height: "12%", backgroundColor: "#3f51b5" }} />

        <CardContent style={styles.cardContent}>
          <Typography variant="h2" style={styles.title}>
            Patent Alert
          </Typography>
          <Typography variant="overline" display="block" gutterBottom>
            A Client Management and Patent Alert software solution.
          </Typography>
        </CardContent>
        <CardActions>
          <div style={styles.buttonWrapper}>
            <Button
              style={styles.button}
              variant="contained"
              to="/Login"
              component={AdapterLink}
              disableElevation
            >
              Login
            </Button>
          </div>
          <div style={styles.buttonWrapper}>
            <Button
              style={styles.button}
              variant="contained"
              to="/Register"
              component={AdapterLink}
              disableElevation
            >
              Register
            </Button>
          </div>
        </CardActions>
      </Card>
    </Container>
  );
};

export default Landing;
