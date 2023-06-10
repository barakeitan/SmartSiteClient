import { isAuthenticated } from '../services/index';
import React, { useEffect, useState } from "react";
import { Route, useNavigate } from "react-router-dom";
import MDBox from "components/MDBox";
import Grid from "@mui/material/Grid";
import MDSnackbar from "components/MDSnackbar";
import LoaderComponent from './LoaderComponent';

const ProtectedRoute = (props) => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [errorSB, setErrorSB] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);

    const closeErrorSB = () => setErrorSB(false);

    const checkUserToken = async () => {
        let userToken = localStorage.getItem('accessToken');
        try {
            const isAccessTokenValid = await isAuthenticated(userToken);
            if (!userToken || userToken === 'undefined' || !isAccessTokenValid) {
                setIsLoggedIn(false);
                return isAccessTokenValid?.message;
            }
            setIsLoggedIn(true);
            return null; // Return null when the user token is valid
        } catch (error) {
            setIsLoggedIn(false);
            return "Failed to sign in. Please log in again.";
        }
        
    }
    // useEffect(() => {
    //         const errMsg = checkUserToken();
    //         if (!isLoggedIn) {
    //             showErrorSB(errMsg);
    //             navigate('/authentication/sign-in');
    //           }
    //     }, [isLoggedIn]);

    useEffect(() => {
        const handleTokenCheck = async () => {
          const errMsg = await checkUserToken();
          if (errMsg) {
            showErrorSB(errMsg);
           // window.location.href = '/authentication/sign-in';
            // throw new Error("Your session expired. please sign in again");
            setTimeout(() => {
                navigate('/authentication/sign-in');
            }, 3000); // Delay the navigation for 3 seconds (adjust as needed)
          }
        };
    
        handleTokenCheck();
    }, []);

    const showErrorSB = (message) => {
        setErrorMsg(message);
        setErrorSB(true);
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

    const renderProtectedRoute = () => {
        if (isLoggedIn) {
          return <>{props.children}</>;
        } else {
          return <LoaderComponent />; // Replace with your loading spinner or placeholder component
        }
    };

    return (
        // <div>
        //     <React.Fragment>
        //         {isLoggedIn ? props.children : null}
        //         <MDBox pt={2} px={2}>
        //             <Grid item xs={12} sm={6} lg={3}>
        //                 {renderErrorSB}
        //             </Grid>
        //         </MDBox>
        //     </React.Fragment>
        // </div>
        <React.Fragment>
            {renderProtectedRoute()}
            <MDBox pt={2} px={2}>
                <Grid item xs={12} sm={6} lg={3}>
                {renderErrorSB}
                </Grid>
            </MDBox>
        </React.Fragment>
    );
}
export default ProtectedRoute;
