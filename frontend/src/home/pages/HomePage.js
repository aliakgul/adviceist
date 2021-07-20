import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  CssBaseline,
  Grid,
  Typography,
  Container,
} from "@material-ui/core";

import MovieCard from "../../shared/components/MovieCard/MovieCard";
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

const HomePage = () => {
  const classes = useStyles();
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedTopN, setLoadedTopN] = useState();

  const history = useHistory();

  useEffect(() => {
    const fetchTopN = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/users/${auth.userId}`
        );
        setLoadedTopN(responseData.user.topN);
      } catch (err) {}
    };
    fetchTopN();
  }, [sendRequest, auth.userId]);

  const createRatingHandler = async (event, movieId, ratingValue) => {
    event.preventDefault();
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/ratings/${auth.userId}/${movieId}`,
        "POST",
        JSON.stringify({ rating: ratingValue }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      console.log("success frontend: post rating");
    } catch (err) {
      try {
        await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/ratings/${auth.userId}/${movieId}`,
          "PATCH",
          JSON.stringify({ rating: ratingValue }),
          {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          }
        );
        console.log("success frontend: patch rating");
      } catch (err2) {
        console.log("fail frontend: post rating #" + err);
        console.log("fail frontend: patch rating #" + err2);
      }
    }
  };

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
    } catch (err) {
      console.log("fail frontend: delete rating #" + err);
    }
  };

  const updateTopN = async (event) => {
    event.preventDefault();

    const generatedMovies = { movies: [] };
    const generatedMovieIds = [
      JSONMovies.movies[Math.floor(Math.random() * JSONMovies.movies.length)]
        .movieId,
      JSONMovies.movies[Math.floor(Math.random() * JSONMovies.movies.length)]
        .movieId,
      JSONMovies.movies[Math.floor(Math.random() * JSONMovies.movies.length)]
        .movieId,
      JSONMovies.movies[Math.floor(Math.random() * JSONMovies.movies.length)]
        .movieId,
      JSONMovies.movies[Math.floor(Math.random() * JSONMovies.movies.length)]
        .movieId,
      JSONMovies.movies[Math.floor(Math.random() * JSONMovies.movies.length)]
        .movieId,
      JSONMovies.movies[Math.floor(Math.random() * JSONMovies.movies.length)]
        .movieId,
      JSONMovies.movies[Math.floor(Math.random() * JSONMovies.movies.length)]
        .movieId,
      JSONMovies.movies[Math.floor(Math.random() * JSONMovies.movies.length)]
        .movieId,
    ];

    JSONMovies.movies.forEach((m) => {
      generatedMovieIds.forEach((mid) => {
        if (mid === m.movieId) {
          generatedMovies.movies.push({
            movieId: m.movieId,
            title: m.title,
            imdbId: m.imdbId,
            genre: m.genres,
          });
        }
      });
    });

    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/users/${auth.userId}/topn`,
        "PATCH",
        JSON.stringify(generatedMovies),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      console.log("success frontend: patch topn");
      history.go(0);
    } catch (err) {
      console.log("fail frontend: patch topn #" + err);
    }
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <main>
        <div className={classes.heroContent}>
          <Container maxWidth="sm">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="textPrimary"
              gutterBottom
            >
              adviceist
            </Typography>
            <Typography
              variant="h5"
              align="center"
              color="textSecondary"
              paragraph
            >
              The product developed in this project is an online recommender
              system software executed on a web browser. This software includes
              the web application that the user interacts with, as well as the
              programs running in the background and the improved machine
              learning model.
            </Typography>
            <div className={classes.heroButtons}>
              <Grid container spacing={2} justify="center">
                <Grid item>
                  <Button variant="outlined" color="primary" href="/">
                    How Do Recommender Systems Work?
                  </Button>
                </Grid>
                {auth.isLoggedIn && (
                  <Grid item>
                    <Button
                      onClick={updateTopN}
                      variant="contained"
                      color="primary"
                    >
                      Update TopN
                    </Button>
                  </Grid>
                )}
              </Grid>
            </div>
          </Container>
        </div>
        <Container className={classes.cardGrid} maxWidth="md">
          <Grid container spacing={4}>
            {loadedTopN &&
              (loadedTopN.length === 0 ? (
                <Typography
                  variant="h3"
                  align="center"
                  color="textSecondary"
                  paragraph
                >
                  No movies found.
                </Typography>
              ) : (
                loadedTopN.map((movieCard) => (
                  <Grid item key={movieCard.movieId} xs={12} sm={6} md={4}>
                    <MovieCard
                      movieId={movieCard.movieId}
                      title={movieCard.title}
                      imdbId={movieCard.imdbId}
                      genre={movieCard.genre}
                      createRating={createRatingHandler}
                      deleteRating={deleteRatingHandler}
                    />
                  </Grid>
                ))
              ))}
          </Grid>
        </Container>
      </main>
    </React.Fragment>
  );
};

export default HomePage;
