import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';

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
import { getAllRoomsBySiteId } from '../../services/index';

const useStyles = makeStyles((theme) => ({
    emptyRoomsGrid: {
      display: "flex",
      justifyContent: "center",
      padding: "370px",
    },
  }));

function RoomList(props) {

    const { siteId } = useParams(); // Retrieve the siteId param from the URL
    const classes = useStyles();

    const [rooms, setRooms] = useState([]);
    const [errorSB, setErrorSB] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);
    const closeErrorSB = () => setErrorSB(false);

    const fetchRooms = () => {
      getAllRoomsBySiteId(siteId).then((data) => {
          if (data.error) {
          setErrorMsg(data.error);
          setErrorSB(true);
          } else {
              console.log("roomList data: " + data);
              setRooms(data);
          }
      });
    };

    // useEffect(() => {
    //   fetchRooms();
    // }, []);

    useEffect(() => {
        fetchRooms();
      }, [siteId]);

    useEffect(() => {
      const inret = setInterval(async() => {
        fetchRooms();
      }, 3000);
      return () => clearInterval(inret); //This is important
    }, [siteId]);

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
        <Grid container spacing={2} className={rooms.length === 0 ? classes.emptyRoomsGrid : ""}>
            {rooms.length == 0 ? 
            <div><h1>No rooms yet</h1></div>
            : rooms.map((room, index) => (
                <Grid item lg={3} key={index}>
                {/* <Grid item xs={4}> */}
                    <Room
                        status={room?.status}
                        imagePath={room?.imagePath}
                        name={room?.name}
                        roomId={room?._id}
                        />
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