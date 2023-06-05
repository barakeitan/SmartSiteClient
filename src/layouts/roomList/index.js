import React, { useState, useEffect } from "react";

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { makeStyles } from "@material-ui/core/styles";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

import MDBox from "components/MDBox";
import MDSnackbar from "components/MDSnackbar";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import  { useWebSocketMessages }  from '../../services/WebSocketProvider';
import Room from './components/room/index';
import { API } from '../../config';
import { getAllRooms } from '../../services/index';

function RoomList(props) {

    const [rooms, setRooms] = useState([]);
    const [errorSB, setErrorSB] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);
    const closeErrorSB = () => setErrorSB(false);

    useEffect(() => {
        const fetchRooms = async () => {
            //647b456a07ab16da82a6a0cb
            //props.siteId
            getAllRooms("647b456a07ab16da82a6a0cb").then((data) => {
                if (data.error) {
                setErrorMsg(data.error);
                setErrorSB(true);
                } else {
                    console.log("roomList data: " + data);
                    setRooms(data);
                }
            });
        };
    
        fetchRooms();
      }, []);

    const renderErrorSB = (
    <MDSnackbar
        color="error"
        icon="warning"
        title="Error occured"
        content={errorMsg}
        open={errorSB}
        onClose={closeErrorSB}
        close={closeErrorSB}
        bgWhite
    />
    );

  return (
    <DashboardLayout>
      <DashboardNavbar />
        <Grid container spacing={2}>
            {rooms.map((room, index) => (
                <Grid item xs={4} key={index}>
                {/* <Grid item xs={4}> */}
                    <Room
                        status={room.status}
                        imagePath={room.imagePath}
                        name={room.name}
                        />

                        {/* <Room
                            status="1"
                            imagePath="https://www.dtech.com.sg/wp-content/uploads/2022/07/BI2_DataCenters.jpg"
                            name="testRoom"
                        /> */}

                    {/* <Card className={classes.root}>
                        <CardMedia
                            className={classes.media}
                            title="Paella dish"
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="h2">
                            {room.name}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" component="p">
                            The CardMedia component sets a background image to cover available
                            space.
                            </Typography>
                        </CardContent>
                    </Card> */}
                </Grid>
            ))}
        </Grid>
        <MDBox pt={2} px={2}>
            <Grid item xs={12} sm={6} lg={3}>
                {renderErrorSB}
            </Grid>
        </MDBox>
    </DashboardLayout>
  );
}

export default RoomList