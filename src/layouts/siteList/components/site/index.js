import React, { useState, useEffect } from "react";

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { makeStyles } from "@material-ui/core/styles";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import  { useWebSocketMessages }  from '../../../../services/WebSocketProvider';
import RoomList from "../../../roomList/index";
import './SiteList.css';

const useStyles = makeStyles({
    root: {
        maxWidth: 345,
        borderRadius: "10px",
        height: "300px"
      },
      media: {
        height: "200px"
      }
  });

function Site(props) {

    const lastJsonMessage = useWebSocketMessages();
    const [statusColor, setStatusColor] = useState('green');
    const classes = useStyles();

    const navigateToRoomList =  () => {
        return (
            <RoomList siteId={props.siteId}/>
        );
    }

    useEffect(() => {
        switch(props.status){
            case "1":
                setStatusColor('green');
                break;
            case "2":
                setStatusColor('orange');
                break;
            case "3":
                setStatusColor('red');
                break;
            default:
                setStatusColor('green');
                break;
        }
    }, [props]);

  return (
    <Card className={classes.root}>
        <CardMedia style={{borderTopLeftRadius: "10px", borderTopRightRadius: "10px"}}
            className={classes.media}
            image={props.imagePath}
        />
        {/* <div > */}
            <CardContent>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <Typography gutterBottom variant="h5" component="h2">
                        {props.name}
                    </Typography>
                    <div className="circle" style={{backgroundColor: statusColor, marginTop: "8px"}}></div>
                </div>
                <Typography variant="body2" color="textSecondary" component="p">
                    site
                </Typography>
            </CardContent>
        {/* </div> */}
    </Card>
  );
}

export default Site