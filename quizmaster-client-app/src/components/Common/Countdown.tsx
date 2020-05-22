import React, { useState } from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      marginTop: theme.spacing(2),
    },
  })
);

export default function LinearDeterminate(props: any) {
  const classes = useStyles();
  const [completed, setCompleted] = useState(100);

  React.useEffect(() => {
    function progress() {
      setCompleted((oldCompleted) => {
        return Math.max(oldCompleted - 10, 0);
      });
    }

    const timer = setInterval(progress, 1000);
    return () => {
      clearInterval(timer);
    };
  }, [props.percentageComplete]);

  return (
    <div className={classes.root}>
      <LinearProgress variant="determinate" value={completed} />
    </div>
  );
}
