// /**
// =========================================================
// * Material Dashboard 2 React - v2.1.0
// =========================================================

// * Product Page: https://www.creative-tim.com/product/material-dashboard-react
// * Copyright 2022 Creative Tim (https://www.creative-tim.com)

// Coded by www.creative-tim.com

//  =========================================================

// * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// */

// import { useState } from "react";

// // react-router-dom components
// import { Link } from "react-router-dom";

// // @mui material components
// import Card from "@mui/material/Card";
// import Switch from "@mui/material/Switch";
// import Grid from "@mui/material/Grid";

// // @mui icons
// import FacebookIcon from "@mui/icons-material/Facebook";
// import GitHubIcon from "@mui/icons-material/GitHub";
// import GoogleIcon from "@mui/icons-material/Google";

// // Material Dashboard 2 React components
// import MDBox from "components/MDBox";
// import MDTypography from "components/MDTypography";
// import MDInput from "components/MDInput";
// import MDButton from "components/MDButton";
// import MDSnackbar from "components/MDSnackbar";


// // Authentication layout components
// import BasicLayout from "layouts/authentication/components/BasicLayout";

// // Images
// import bgImage from "assets/images/bg-sign-in-basic.jpeg";
// import { useNavigate } from "react-router-dom";

// import { signout, authenticate, isAuthenticated } from '../../../services/index';
// import WebSocketComponent from '../../../services/WebSocketComponent';

// function Basic() {

//   const navigate = useNavigate();
//   const [errorSB, setErrorSB] = useState(false);
//   const [errorMsg, setErrorMsg] = useState(null);

//   const closeErrorSB = () => setErrorSB(false);
  

//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const { user } = isAuthenticated();

//   const handleSignOut = (event) => {
//     event.preventDefault(); // so that browser does not reload
//     signout().then(() => {
//     //   if (data.error) {
//     //     setErrorMsg(data.error);
//     //     setErrorSB(true);
//     //   }
//     //   navigate("/gauges");
//     });
//   };

//   const renderErrorSB = (
//     <MDSnackbar
//       color="error"
//       icon="warning"
//       title="Failed to sign out"
//       content={errorMsg}
//       open={errorSB}
//       onClose={closeErrorSB}
//       close={closeErrorSB}
//       bgWhite
//     />
//   );

//   return (
//     <div></div>
//     // <BasicLayout image={bgImage}>
//     //   <Card>
//     //     <MDBox
//     //     >
//     //         <MDBox onChange={() => handleSignOut}></MDBox>
//     //       {/* <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
//     //         Sign in
//     //       </MDTypography>
//     //     </MDBox>
//     //     <MDBox pt={4} pb={3} px={3}>
//     //       <MDBox component="form" role="form">
//     //         <MDBox mb={2}>
//     //           <MDInput type="email" label="Email" fullWidth 
//     //           value={email}
//     //           onChange={(event) => {
//     //             console.log("event.target.value: " + event.target.value);
//     //             setEmail(event.target.value);
//     //           }}/>
//     //         </MDBox>
//     //         <MDBox mb={2}>
//     //           <MDInput type="password" label="Password" fullWidth 
//     //           value={password}
//     //           onChange={(event) => {
//     //             console.log("event.target.value: " + event.target.value);
//     //             setPassword(event.target.value);
//     //           }}/>
//     //         </MDBox>
//     //         <MDBox display="flex" alignItems="center" ml={-1}>
//     //           <Switch checked={rememberMe} onChange={handleSetRememberMe} />
//     //           <MDTypography
//     //             variant="button"
//     //             fontWeight="regular"
//     //             color="text"
//     //             onClick={handleSetRememberMe}
//     //             sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
//     //           >
//     //             &nbsp;&nbsp;Remember me
//     //           </MDTypography>
//     //         </MDBox>
//     //         <MDBox mt={4} mb={1}>
//     //           <MDButton variant="gradient" color="info" fullWidth onClick={clickSubmit}>
//     //             sign in
//     //           </MDButton>
//     //         </MDBox>
//     //         <MDBox mt={3} mb={1} textAlign="center">
//     //           <MDTypography variant="button" color="text">
//     //             Don&apos;t have an account?{" "}
//     //             <MDTypography
//     //               component={Link}
//     //               to="/authentication/sign-up"
//     //               variant="button"
//     //               color="info"
//     //               fontWeight="medium"
//     //               textGradient
//     //             >
//     //               Sign up
//     //             </MDTypography>
//     //           </MDTypography>
//     //         </MDBox>
//     //         </MDBox> */}
//     //     </MDBox>
//     //   </Card>
//     //   <MDBox pt={2} px={2}>
//     //     <Grid item xs={12} sm={6} lg={3}>
//     //       {renderErrorSB}
//     //     </Grid>
//     //   </MDBox>
//     // </BasicLayout>
//   );
// }

// export default Basic;
