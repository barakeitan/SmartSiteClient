import React, { useState } from "react";
import { RadialGauge } from "react-canvas-gauges";
// import {Gauge}  from 'react-gauge';
import GaugeChart from 'react-gauge-chart';

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";


function Gauge(props) {

  return (
    <MDBox mb={3}>
        <div className="gauge" style={{"display": "flex", "flexDirection": "column", "alignItems": "center"}}>
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
          {/* <Gauge
          value={75}
          min={0}
          max={100}
          width={200}
          height={150}
          label="My Gauge"
          color="#3366ff"
          /> */}
          {/* <GaugeChart
            id="gauge-chart"
            percent={75}
            nrOfLevels={6}
            arcPadding={0.1}
            textColor="#333"
            arcColors={['#FF5F6D', '#FFC371']}
          /> */}
        <br/>
        <div>{props.value_ts}</div>
        <br/>
      </div>
    </MDBox>
  );
}

export default Gauge;
