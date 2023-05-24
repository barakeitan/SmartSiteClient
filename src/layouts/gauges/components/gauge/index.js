import React, { useEffect, useState } from "react";
import { RadialGauge } from "react-canvas-gauges";
// import {Gauge}  from 'react-gauge';
import GaugeChart from 'react-gauge-chart';
import  { WebSocketProvider, useWebSocketMessages }  from '../../../../services/WebSocketProvider';

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";


function Gauge(props) {

  const lastJsonMessage = useWebSocketMessages();

  useEffect(() => {
    console.log('WebSocket message:', lastJsonMessage);
  }, [lastJsonMessage])

  // const handleWebSocketMessage = (message) => {
  //   // Do something with the received message
  //   console.log('Received message:', message);
  // };

  

  return (
    <MDBox mb={3}>
        <div className="gauge" style={{"display": "flex", "flexDirection": "column", "alignItems": "center"}}>
        {/* <WebSocketComponent onMessageReceived={handleWebSocketMessage}/> */}
        <RadialGauge
          style={{"width": "50px !important",
            "height": "50px !important"}}
          units="%"
          title={props.title}
          value={props.value}
          minValue={0}
          maxValue={100}
          animationDuration={1.5}
          animationRule="linear"
          colorPlate="#fff"
          colorMajorTicks="#000"
          fontValue="Arial"
          needleWidth={2}
        />
        <br/>
        <div>{props.value_ts}</div>
        <br/>
      </div>
    </MDBox>
  );
}

export default Gauge;
