import React, { useState, useEffect } from "react";
import { RadialGauge } from "react-canvas-gauges";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend
  } from "chart.js";
  import { Line } from "react-chartjs-2";
  import { faker } from '@faker-js/faker';
  import Grid from "@mui/material/Grid";

function Sensor(props) {

    const [statusColor, setStatusColor] = useState('green');

  const handleWebSocketMessage = (message) => {
    // Do something with the received message
    console.log('Received message:', message);
  };

  useEffect(() => {
    //   if (props.severity === "1") {
    //       setStatusColor('green');
    //   } else if (props.severity === "2") {
    //       setStatusColor('orange');
    //   } else if (props.severity === "3") {
    //       setStatusColor('red');
    //   } else {
    //       setStatusColor('green');
    //   }
    switch(props.severity){
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

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend
  );

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" 
      },
      title: {
        display: true,
        text: props.text
      }
    }
  };
  
  const labels = ["January", "February", "March", "April", "May", "June", "July"];
  
  const data = {
    labels,
    datasets: [
      {
        fill: true,
        label: props.label,
        data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
        borderColor: "rgb(53, 162, 255)",
        backgroundColor: "rgba(53, 162, 235, 0.5)"
      }
    ]
  };

  const circleStyle = {
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    backgroundColor: statusColor,
  };


  return (

    <div>
        <div style={circleStyle}></div>
        <Grid  xs={12} md={6} xl={3}>
            <div></div>
        </Grid>
        <Line options={options} data={data} />
    </div>
    // <MDBox mb={3}>
    //     <div className="gauge" style={{"display": "flex", "flexDirection": "column", "alignItems": "center"}}>
    //     {/* <WebSocketComponent onMessageReceived={handleWebSocketMessage} /> */}
    //     <RadialGauge
    //       style={{"width": "50px !important",
    //         "height": "50px !important"}}
    //       units="%"
    //       title={props.title}
    //       value={props.value}
    //       minValue={0}
    //       maxValue={100}
    //       animationDuration={1.5}
    //       animationRule="linear"
    //       colorPlate="#fff"
    //       colorMajorTicks="#000"
    //       fontValue="Arial"
    //       needleWidth={2}
    //     />
    //       {/* <Gauge
    //       value={75}
    //       min={0}
    //       max={100}
    //       width={200}
    //       height={150}
    //       label="My Gauge"
    //       color="#3366ff"
    //       /> */}
    //       {/* <GaugeChart
    //         id="gauge-chart"
    //         percent={75}
    //         nrOfLevels={6}
    //         arcPadding={0.1}
    //         textColor="#333"
    //         arcColors={['#FF5F6D', '#FFC371']}
    //       /> */}
    //     <br/>
    //     <div>{props.value_ts}</div>
    //     <br/>
    //   </div>
    // </MDBox>
  );
}

export default Sensor;


// import React from "react";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Filler,
//   Legend
// } from "chart.js";
// import { Line } from "react-chartjs-2";
// import faker from "faker";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Filler,
//   Legend
// );

// export const options = {
//   responsive: true,
//   plugins: {
//     legend: {
//       position: "bottom" as const
//     },
//     title: {
//       display: true,
//       text: "Chart.js Line Chart"
//     }
//   }
// };

// const labels = ["January", "February", "March", "April", "May", "June", "July"];

// export const data = {
//   labels,
//   datasets: [
//     {
//       fill: true,
//       label: "Dataset 2",
//       data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
//       borderColor: "rgb(53, 162, 255)",
//       backgroundColor: "rgba(53, 162, 235, 0.5)"
//     }
//   ]
// };

// export function App() {
//   return <Line options={options} data={data} />;
// }
