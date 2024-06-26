import React, { useEffect, useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Link from "@material-ui/core/Link";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import AuthHeader from "../component/AuthHeader";
import { Paper } from "@material-ui/core";
import ContactMailIcon from "@material-ui/icons/ContactMail";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://nPOD.org/">
        nPOD
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    // minHeight: "150vh",
    backgroundImage: `url(${
      process.env.PUBLIC_URL + "/assets/contactPage.png"
    })`,
    backgroundRepeat: "repeat",
    // backgroundSize: "cover",
    display: "flex",
    justifyContent: "flex-start",
  },
  centerBox: {
    marginLeft: "auto",
    marginRight: "auto",
    width: "72%",
  },
  paper: {
    marginTop: theme.spacing(12),
    minHeight: "85vh",
    padding: theme.spacing(2),
    paddingBottom: theme.spacing(15),
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    backgroundColor: "#24282e",
  },
  title: {
    margin: theme.spacing(5),
    fontWeight: 600,
    textTransform: "uppercase",
    color: "white",
  },
  title2: {
    margin: theme.spacing(5),
    fontWeight: 300,
    textTransform: "uppercase",
    color: "white",
  },
  cardList: {
    display: "flex",
    flexWrap: "wrap",
  },
  card: {
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(7),
    marginBottom: theme.spacing(1),
    padding: theme.spacing(2),
    paddingRight: theme.spacing(3),
    minWidth: "450px",
    minHeight: "70px",
    backgroundColor: "#404852",
    color: "white",
    borderRadius: "3px",
    boxShadow:
      "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
    display: "flex",
    flexDirection: "row",

    "& img": {
      height: "100px",
      width: "100px",
      objectFit: "cover",
    },
  },
  cardText: {
    marginLeft: theme.spacing(3),
    marginTop: "5px",
    display: "flex",
    flexDirection: "column",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
}));

function Contact(props) {
  const classes = useStyles();
  return (
    <div>
      <AuthHeader location="Contact" />
      <div className={classes.root}>
        <div className={classes.centerBox}>
          <CssBaseline />
          <Paper className={classes.paper}>
            <Typography variant="h3" className={classes.title}>
              Contact Us
            </Typography>

            <Typography variant="h6" className={classes.title2}>
              For general information
            </Typography>
            <div className={classes.cardList}>
              <a
                href="mailto:inkusmartseva@ufl.edu"
                style={{ textDecoration: "none" }}
              >
                <div className={classes.card}>
                  <img
                    src={`${process.env.PUBLIC_URL}/assets/contactPage/Irina-Kusmartseva.jpg`}
                    style={{ objectPosition: "0 0" }}
                  />
                  <div className={classes.cardText}>
                    <Typography variant="h6">
                      Irina Kusmartseva, Ph.D
                    </Typography>
                    <Typography variant="subtitle1">nPOD Director</Typography>
                    <Typography variant="subtitle1">
                      inkusmartseva@ufl.edu
                    </Typography>
                  </div>
                </div>
              </a>
              <a
                href="mailto:brittany.pratts@ufl.edu"
                style={{ textDecoration: "none" }}
              >
                <div className={classes.card}>
                  <img
                    src={`${process.env.PUBLIC_URL}/assets/contactPage/Brittany-Pratt.jpg`}
                  />
                  <div className={classes.cardText}>
                    <Typography variant="h6">Brittany Pratt, BA</Typography>
                    <Typography variant="subtitle1">
                      nPOD Investigator Coordinator
                    </Typography>
                    <Typography variant="subtitle1">
                      brittany.pratts@ufl.edu
                    </Typography>
                  </div>
                </div>
              </a>
            </div>

            <Typography variant="h6" className={classes.title2}>
              For case information, pathology and sample inventory
            </Typography>
            <div className={classes.cardList}>
              <a
                href="mailto:hhiller@ufl.edu"
                style={{ textDecoration: "none" }}
              >
                <div className={classes.card}>
                  <img
                    src={`${process.env.PUBLIC_URL}/assets/contactPage/Helmut-Hiller.jpg`}
                  />
                  <div className={classes.cardText}>
                    <Typography variant="h6">Helmut Hiller, MS</Typography>
                    <Typography variant="subtitle1">
                      nPOD OPPC Core Research Manager
                    </Typography>
                    <Typography variant="subtitle1">hhiller@ufl.edu</Typography>
                  </div>
                </div>
              </a>
            </div>

            <Typography variant="h6" className={classes.title2}>
              For data submission
            </Typography>
            <div className={classes.cardList}>
              <a
                href="mailto:Bobbie-Jo.Webb-Robertson@pnnl.gov"
                style={{ textDecoration: "none" }}
              >
                <div className={classes.card}>
                  <img
                    src={`${process.env.PUBLIC_URL}/assets/contactPage/Webb-Robertson.png`}
                    style={{ objectPosition: "0 10%" }}
                  />
                  <div className={classes.cardText}>
                    <Typography variant="h6">
                      Bobbie-Jo Webb-Robertson
                    </Typography>
                    <Typography variant="body1">Ph.D</Typography>
                    <Typography variant="body1">
                      Bobbie-Jo.Webb-Robertson@pnnl.gov
                    </Typography>
                  </div>
                </div>
              </a>
            </div>

            <Typography variant="h6" className={classes.title2}>
              For technical issues
            </Typography>
            <div className={classes.cardList}>
              <a
                href="mailto:nPOD@pathology.ufl.edu"
                style={{ textDecoration: "none" }}
              >
                <div className={classes.card}>
                  <ContactMailIcon style={{ fontSize: "32px" }} />
                  <div className={classes.cardText}>
                    <Typography variant="body1">
                      nPOD@pathology.ufl.edu
                    </Typography>
                  </div>
                </div>
              </a>
            </div>
          </Paper>
          <Box mt={8}>
            <Copyright />
          </Box>
        </div>
      </div>
    </div>
  );
}

export default Contact;
