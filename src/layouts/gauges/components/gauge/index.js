import React, { useState } from "react";
import { RadialGauge } from "react-canvas-gauges";

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";


function Gauge(props) {

  return (
    <MDBox mb={3}>
        <div className="gauge" style={{"display": "flex", "flex-direction": "column", "align-items": "center"}}>
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
