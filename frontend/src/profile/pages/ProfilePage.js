import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  CssBaseline,
  Grid,
  Typography,
  Container,
  Link,
} from "@material-ui/core";

import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import JSONMovies from "../../shared/data/movies.json";

const useStyles = makeStyles((theme) => ({
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
}));

const ProfilePage = () => {
  const classes = useStyles();
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedCurrentUser, setLoadedCurrentUser] = useState([]);

  const history = useHistory();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/users/${auth.userId}`
        );
        setLoadedCurrentUser(responseData.user);
      } catch (err) {}
    };
    fetchCurrentUser();
  }, [sendRequest, auth.userId]);

  const deleteRatingHandler = async (event, movieId) => {
    event.preventDefault();
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/ratings/${auth.userId}/${movieId}`,
        "DELETE",
        null,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      console.log("success frontend: delete rating");
      history.go(0);
    } catch (err) {
      console.log("fail frontend: delete rating #" + err);
    }
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <main>
        <div className={classes.heroContent}>
          <Container maxWidth="sm">
            <Typography
              component="h3"
              align="center"
              color="textPrimary"
              gutterBottom
            >
              UserEmail:{loadedCurrentUser.email}
            </Typography>
            <Typography
              component="h3"
              align="center"
              color="textPrimary"
              gutterBottom
            >
              UserName:{loadedCurrentUser.userName}
            </Typography>
            <Typography
              component="h3"
              align="center"
              color="textPrimary"
              gutterBottom
            >
              UserID:{loadedCurrentUser.id}
            </Typography>
          </Container>
        </div>
        <Typography
          component="h3"
          align="center"
          color="textPrimary"
          gutterBottom
        >
          YOUR RATINGS
        </Typography>
        <Container className={classes.cardGrid} maxWidth="md">
          <Grid container spacing={4}>
            {loadedCurrentUser &&
              loadedCurrentUser.ratings &&
              (loadedCurrentUser.ratings.length === 0 ? (
                <Typography
                  variant="h3"
                  align="center"
                  color="textSecondary"
                  paragraph
                >
                  No movies found.
                </Typography>
              ) : (
                loadedCurrentUser.ratings.map((rating) => (
                  <Grid item key={rating.movieId} xs={12} sm={6} md={4}>
                    <Link
                      href={
                        "https://imdb.com/title/tt0" +
                        JSONMovies.movies.find(
                          (m) => m.movieId === rating.movieId
                        ).imdbId
                      }
                    >
                      <Typography variant="subtitle1">
                        {
                          JSONMovies.movies.find(
                            (m) => m.movieId === rating.movieId
                          ).title
                        }
                      </Typography>
                    </Link>
                    Rating:{rating.rating}
                    <Button
                      onClick={(event) =>
                        deleteRatingHandler(event, rating.movieId)
                      }
                      size="small"
                      color="primary"
                    >
                      Unrate
                    </Button>
                  </Grid>
                ))
              ))}
          </Grid>
        </Container>
      </main>
    </React.Fragment>
  );
};

export default ProfilePage;
