import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
  Link,
} from "@material-ui/core";
import { Rating } from "@material-ui/lab";

import DirectorImage from "../../images/director.jpg";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
    display: "flex",
    flexDirection: "column",
    "& > * + *": {
      marginTop: theme.spacing(1),
    },
  },
  media: {
    height: 100,
  },
}));

const MovieCard = (props) => {
  const classes = useStyles();
  const [ratingValue, setRatingValue] = useState(0);
  const { createRating, deleteRating } = props;

  return (
    <Card className={classes.root}>
      <CardActionArea>
        <Link href={"https://imdb.com/title/tt0" + props.imdbId}>
          <CardMedia
            className={classes.media}
            image={DirectorImage}
            title={props.title}
          >
            <Typography variant="subtitle1">IMDb Page</Typography>
          </CardMedia>
        </Link>
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {props.title}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {props.genre.split("|").map(function (genre, i) {
              return <li key={i}>{genre}</li>;
            })}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button
          onClick={(event) => deleteRating(event, props.movieId)}
          size="small"
          color="primary"
        >
          Unrate
        </Button>
        <Rating
          name={`half-rating${props.movieId}`} /* This value have to be unique */
          value={ratingValue}
          onChange={(event, newValue) => {
            setRatingValue(newValue);
            createRating(event, props.movieId, newValue);
          }}
          precision={0.5}
        />
      </CardActions>
    </Card>
  );
};

export default MovieCard;
