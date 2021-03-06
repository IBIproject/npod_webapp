import React from "react";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";

const useStyles = makeStyles((theme) => ({
  title: {
    paddingBottom: theme.spacing(2),
  },
  title2: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  container: {
    maxHeight: "56vh",
  },
  table: {
    paddingBottom: theme.spacing(2),
  },
  note: {
    maxHeight: "25vh",
    overflow: "auto",
  },
  noteText: {
    padding: "10px",
  },
}));

function CaseProcessing(props) {
  const classes = useStyles();
  const donorType = props.donorTypesMap[props.currentCase.donor_type_id];

  function createData(name, value) {
    return { name, value };
  }

  const rows = [
    createData(
      "Terminal Hospital Duration",
      props.currentCase.terminal_hospital_duration === null
        ? "Unavailable"
        : props.currentCase.terminal_hospital_duration
    ),
    createData(
      "Organ Transport Time",
      props.currentCase.organ_transport_time === null
        ? "Unavailable"
        : props.currentCase.organ_transport_time
    ),
    createData(
      "Tissue Recovery Type",
      props.currentCase.case_recovery_type === null
        ? "Unavailable"
        : props.currentCase.case_recovery_type
    ),
    createData(
      "Total Pancreas Weight (g)",
      props.currentCase.pancreas_weight_grams === null
        ? "Unavailable"
        : props.currentCase.pancreas_weight_grams
    ),
    createData(
      "Pancreas Head (g)",
      props.currentCase.pancreas_head_grams === null
        ? "Unavailable"
        : props.currentCase.pancreas_head_grams
    ),
    createData(
      "Pancreas Body (g)",
      props.currentCase.pancreas_body_grams === null
        ? "Unavailable"
        : props.currentCase.pancreas_body_grams
    ),
    createData(
      "Pancreas Tail (g)",
      props.currentCase.pancreas_tail_grams === null
        ? "Unavailable"
        : props.currentCase.pancreas_tail_grams
    ),
  ];

  return (
    <div>
      <div>
        <Typography variant="h5" className={classes.title}>
          Case Processing
        </Typography>
      </div>
      <div>
        <TableContainer component={Paper} className={classes.container}>
          <Table className={classes.table} size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="right">Value</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.name}>
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="right">{row.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      {typeof props.currentCase.pancreas_weight_comments === "string" &&
      props.currentCase.pancreas_weight_comments.length > 1 ? (
        <div>
          <div>
            <Typography variant="h5" className={classes.title2}>
              Pancreas Weight Comment
            </Typography>
          </div>
          <div>
            <Card variant="outlined" className={classes.note}>
              <Typography
                variant="body2"
                component="p"
                className={classes.noteText}
              >
                {props.currentCase.pancreas_weight_comments
                  ? props.currentCase.pancreas_weight_comments
                  : "Unavailable"}
              </Typography>
            </Card>
          </div>
        </div>
      ) : null}
    </div>
  );
}

// Subscribe
const mapStateToProps = (state) => {
  return {
    // Filtered Data
    currentCase: state.explore.currentCase,

    // Donor Types (map)
    donorTypesMap: state.explore.donorTypesMap,

    // Cause of Deaht map
    causeOfDeathMap: state.explore.causeOfDeathMap,
  };
};

export default connect(mapStateToProps, null)(CaseProcessing);
