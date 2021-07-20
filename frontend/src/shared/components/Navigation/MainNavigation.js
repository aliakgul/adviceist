import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { AppBar, Button, Toolbar } from "@material-ui/core";

import { AuthContext } from "../../context/auth-context";

const useStyles = makeStyles((theme) => ({
  appBar: {
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    marginLeft: 20,
    marginRight: 20,
  },
}));

const MainNavigation = () => {
  const classes = useStyles();
  const auth = useContext(AuthContext);

  return (
    <AppBar className={classes.appBar} position="static">
      <Toolbar>
        <Button
          variant="contained"
          className={classes.button}
          color="secondary"
          href="/"
        >
          Recommender
        </Button>
        {auth.isLoggedIn && (
          <Button
            variant="contained"
            className={classes.button}
            color="secondary"
            href="/profile"
          >
            Profile
          </Button>
        )}
        {auth.isLoggedIn && (
          <Button
            variant="outlined"
            className={classes.button}
            color="secondary"
            href="/"
            onClick={auth.logout}
          >
            Logout
          </Button>
        )}
        {!auth.isLoggedIn && (
          <Button
            className={classes.button}
            variant="outlined"
            color="secondary"
            href="/login"
          >
            Auth
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default MainNavigation;
