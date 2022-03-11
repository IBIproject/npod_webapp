import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import { connect } from "react-redux";
import DonorInformation from "./component/DonorInformation";
import LabTestResults from "./component/LabTestResults";
import HighResolutionHLA from "./component/HighResolutionHLA";
import TransplantHLA from "./component/TransplantHLA";

const useStyles = makeStyles((theme) => ({
  title: {
    paddingBottom: theme.spacing(2),
  },
  content: {
    paddingTop: theme.spacing(2),
  },
  paper: {
    padding: theme.spacing(2),
    color: theme.palette.text.primary,
    height: "70vh",
    maxHeight: "75vh",
    overflow: "auto",
  },
}));

function DonorSummary(props) {
  const classes = useStyles();

  return (
    <div>
      <Grid container spacing={2} justify={"flex-start"} alignItems={"stretch"}>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
          <Paper elevation={3} className={classes.paper}>
            <DonorInformation />
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
          <Paper elevation={3} className={classes.paper}>
            <LabTestResults />
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
          <Paper elevation={3} className={classes.paper}>
            <TransplantHLA />
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
          <Paper elevation={3} className={classes.paper}>
            <HighResolutionHLA />
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}

// Subscribe
const mapStateToProps = (state) => {
  return {
    // Filtered Data
    currentCase: state.explore.currentCase,
  };
};

export default connect(mapStateToProps, null)(DonorSummary);
