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
    //minWidth: 650,
  },
  note: {
    maxHeight: "25vh",
    overflow: "auto",
  },
  noteText: {
    padding: "10px",
  },
}));

function HospitalLaboratoryPanel(props) {
  const classes = useStyles();
  const donorType = props.donorTypesMap[props.currentCase.donor_type_id];

  function createData(name, value) {
    return { name, value };
  }

  const rows = [
    createData(
      "Hemodiluted",
      props.currentCase.hemodiluted_status === null
        ? "Unavailable"
        : props.currentCase.hemodiluted_status
    ),
    createData(
      "Peak Glucose (mg/dL)",
      props.currentCase.peak_glucose_mg_dL === null
        ? "Unavailable"
        : props.currentCase.peak_glucose_mg_dL
    ),
    createData(
      "Infections",
      props.currentCase.infections === null
        ? "Unavailable"
        : props.currentCase.infections
    ),
  ];

  if (props.currentCase.SARS_COV_2_results != null) {
    rows.push(
      createData(
        "SARS-CoV-2",
        props.currentCase.SARS_COV_2_results === null
          ? "Unavailable"
          : props.currentCase.SARS_COV_2_results
      )
    );
  }

  return (
    <div>
      <div>
        <Typography variant="h5" className={classes.title}>
          Hospital Laboratory Panel
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

export default connect(mapStateToProps, null)(HospitalLaboratoryPanel);
