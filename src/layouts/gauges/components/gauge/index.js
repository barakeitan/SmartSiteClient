import React, { useEffect, useState } from "react";
import { RadialGauge } from "react-canvas-gauges";
// import {Gauge}  from 'react-gauge';
import GaugeChart from 'react-gauge-chart';
import  { useWebSocketMessages }  from '../../../../services/WebSocketProvider';
import ReactSpeedometer from "react-d3-speedometer"

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";


function Gauge(props) {

  // const lastJsonMessage = useWebSocketMessages();


  // useEffect(() => {
  //   console.log('WebSocket message:', lastJsonMessage);
  // }, [lastJsonMessage])

  // const handleWebSocketMessage = (message) => {
  //   // Do something with the received message
  //   console.log('Received message:', message);
  // };

  

  return (
    <MDBox mb={3}>
        <div className="gauge" style={{"display": "flex", "flexDirection": "column", "alignItems": "center"}}>
        {/* <RadialGauge
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
        /> */}
     <ReactSpeedometer
        width={400}
        needleHeightRatio={0.7}
        minValue={0}
        maxValue={100}
        value={props.value}
        currentValueText={props.title + " : " + props.value}
        customSegmentStops={[0,75,90,100]}
        // segmentColors={['rgb(106, 215, 45)','rgb(174, 226, 40)','rgb(236, 219, 35)','rgb(246, 150, 30)','rgb(255, 71, 26)']}
        segmentColors={['rgb(106, 215, 45)', 'rgb(236, 219, 35)','rgb(255, 71, 26)']}
        customSegmentLabels={[
          // {
          //   text: 'Very Good',
          //   position: 'INSIDE',
          //   color: '#555', //rgb(255, 71, 26)
          // },
          {
            text: 'Normal',
            position: 'INSIDE',
            color: '#555',//rgb(246, 150, 30)
          },
          // {
          //   text: 'Ok',
          //   position: 'INSIDE',
          //   color: '#555',//rgb(236, 219, 35)
          //   fontSize: '19px',
          // },
          {
            text: 'Warning',
            position: 'INSIDE',
            color: '#555',//rgb(174, 226, 40)
          },
          {
            text: 'Danger',
            position: 'INSIDE',
            color: '#555',//rgb(106, 215, 45)
          },
        ]}
        ringWidth={47}
        needleTransitionDuration={3333}
        needleTransition="easeElastic"
        needleColor={'#90f2ff'}
        textColor={'#d8dee9'}
      />
        <br/>
        {/* <div>{(props.value_ts || "").split() }</div> */}
        <div>{new Date(Date.parse(props?.value_ts)).toString().split(" GMT")[0]}</div>
        <br/>
      </div>
    </MDBox>
  );
}

export default Gauge;
