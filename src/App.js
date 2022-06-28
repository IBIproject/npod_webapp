import "./App.css";
import React, { useState, useEffect } from "react";
import { Amplify, API, Hub, Auth } from "aws-amplify";
import config from "./aws-exports";
import { withAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import Header from "./component/Header";
import LandingPage from "./route/LandingPage";
import AuthHeader from "./component/AuthHeader";
import SignIn from "./route/SignIn";
import SignUp from "./route/SignUp";
import SignUpConfirm from "./route/SignUpConfirm";
import { connect } from "react-redux";
import ForgotPassword from "./route/ForgotPassword";
import ChangePassword from "./route/ChangePassword";
import ExplorePage from "./route/ExplorePage";
import AdminPage from "./route/AdminPage";
import WriteInPage from "./route/WriteInPage";
import UserManagePage from "./route/UserManagePage";
import SupportPage from "./route/SupportPage";
import ContactPage from "./route/ContactPage";
import VerifyEmail from "./route/VerifyEmail";
import VerifyAttributeWithCode from "./route/VerifyAttributeWithCode";
import UserAgreementPage from "./route/UserAgreementPage";
import ResetPassword from "./route/ResetPassword";

Amplify.configure({
  ...config,
  Auth: {
    mandatorySignIn: true,
  },
});

function App(props) {
  useEffect(() => {
    checkAuth();
    authListener();
  }, []);

  async function checkAuth() {
    try {
      const authRes = await Auth.currentAuthenticatedUser();
      props.setSignedIn(true);
    } catch (error) {
      console.log(error);
      props.setSignedIn(false);
    }
  }

  async function authListener() {
    Hub.listen("auth", (data) => {
      switch (data.payload.event) {
        case "signIn":
          console.log("User signed in.");
          break;
        case "signOut":
          console.log("User signed out.");
          break;
        default:
          break;
      }
    });
  }

  return (
    <Router>
      <Route exact path="/" component={LandingPage} />
      <Route path="/signin" component={SignIn} />
      <Route path="/signup" component={SignUp} />
      <Route path="/signupconfirm" component={SignUpConfirm} />
      <Route path="/forgotpassword" component={ForgotPassword} />
      <Route path="/verifyemail" component={VerifyEmail} />
      <Route path="/changepassword" component={ChangePassword} />
      <Route path="/explore" component={ExplorePage} />
      <Route exact path="/admin" component={AdminPage} />
      <Route path="/admin/writein" component={WriteInPage} />
      <Route path="/admin/usermanage" component={UserManagePage} />
      <Route path="/support" component={SupportPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/verify" component={VerifyAttributeWithCode} />
      <Route path="/useragreement" component={UserAgreementPage} />
      <Route path="/resetpassword" component={ResetPassword} />
    </Router>
  );
}

// Subscribe
const mapStateToProps = (state) => {
  return {
    signedIn: state.auth.signedIn,
  };
};

// Update
const mapDispatchToProps = (dispatch) => {
  return {
    setSignedIn: (newSignedIn) =>
      dispatch({ type: "SET_SIGNEDIN", value: newSignedIn }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
