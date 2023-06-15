/**
=========================================================
* Material Dashboard 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useEffect, useState } from "react";

// react-router-dom components
import { Link, Navigate } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import Grid from "@mui/material/Grid";

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import MDSnackbar from "components/MDSnackbar";


// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";

// Images
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import { useNavigate } from "react-router-dom";

import { signin, authenticate, isAuthenticated } from '../../../services/index';
// import WebSocketComponent from '../../../services/WebSocketProvider';

function Basic() {

  const navigate = useNavigate();
  const [rememberMe, setRememberMe] = useState(false);
  const [errorSB, setErrorSB] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleSetRememberMe = () => setRememberMe(!rememberMe);
  const closeErrorSB = () => setErrorSB(false);
  

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // useEffect(() => {
  //   const accessToken = localStorage.getItem('accessToken');
  //   isAuthenticated(accessToken).then((data) => {
  //     if (data.error) {
  //       setErrorMsg(data.error);
  //       setErrorSB(true);
  //     } else {
  //       if(data.isAuthenticate){
  //         navigate('/gauges');
  //       }
  //     }
  //   });
    
  // });

  // const { user } = isAuthenticated();

  const clickSubmit = (event) => {
    event.preventDefault(); // so that browser does not reload
    signin({ email, password }).then((data) => {
      if (data.error) {
        setErrorMsg(data.error);
        setErrorSB(true);
      } else {
        authenticate(data, () => {
          // WebSocketComponent(user);
          navigate("/siteList");
        });
      }
    });
  };

  const renderErrorSB = (
    <MDSnackbar
      color="error"
      icon="warning"
      title="Failed to sign in"
      content={errorMsg}
      open={errorSB}
      onClose={closeErrorSB}
      close={closeErrorSB}
      bgWhite
    />
  );

  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Sign in
          </MDTypography>
          <MDTypography display="block" variant="button" color="white" my={1}>
            Enter your email and password to sign in
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form">
            <MDBox mb={2}>
              <MDInput type="email" label="Email" fullWidth 
              value={email}
              onChange={(event) => {
                console.log("event.target.value: " + event.target.value);
                setEmail(event.target.value);
              }}/>
            </MDBox>
            <MDBox mb={2}>
              <MDInput type="password" label="Password" fullWidth 
              value={password}
              onChange={(event) => {
                console.log("event.target.value: " + event.target.value);
                setPassword(event.target.value);
              }}/>
            </MDBox>
            <MDBox display="flex" alignItems="center" ml={-1}>
              {/* <Switch checked={rememberMe} onChange={handleSetRememberMe} />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                onClick={handleSetRememberMe}
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
              >
                &nbsp;&nbsp;Remember me
              </MDTypography> */}
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton variant="gradient" color="info" fullWidth onClick={clickSubmit}>
                sign in
              </MDButton>
            </MDBox>
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Don&apos;t have an account?{" "}
                <MDTypography
                  component={Link}
                  to="/authentication/sign-up"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Sign up
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
      <MDBox pt={2} px={2}>
        <Grid item xs={12} sm={6} lg={3}>
          {renderErrorSB}
        </Grid>
      </MDBox>
    </BasicLayout>
  );
}

export default Basic;
