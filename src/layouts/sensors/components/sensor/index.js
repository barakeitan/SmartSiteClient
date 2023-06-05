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
import './Sensors.css';
import  { useWebSocketMessages }  from '../../../../services/WebSocketProvider';

const generateChartData = (selectedFilter, minData, maxData, label) => {
    const currentDate = new Date();
    let startDate, endDate;
  
    if (selectedFilter === 'Week') {
      startDate = new Date(currentDate);
      startDate.setDate(currentDate.getDate() - currentDate.getDay());
  
      endDate = new Date(currentDate);
      endDate.setDate(startDate.getDate() + 5);
    } else if (selectedFilter === 'Month') {
      startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    } else if (selectedFilter === 'Year') {
      startDate = new Date(currentDate.getFullYear(), 0, 1);
      endDate = new Date(currentDate.getFullYear(), 11, 31);
    }
  
    const labels = [];
    const data = [];
    const current = new Date(startDate);
  
    while (current.getTime() <= endDate.getTime()) {
      if (selectedFilter === 'Week') {
        labels.push(current.toLocaleDateString());
        const randomValue = Math.random() * (Number(maxData) - Number(minData)) + Number(minData);
        data.push(randomValue);
      } else if (selectedFilter === 'Month') {
        labels.push(`${current.getMonth() + 1}/${current.getDate()}`);
        const randomValue = Math.random() * (Number(maxData) - Number(minData)) + Number(minData);
        data.push(randomValue);
      } else if (selectedFilter === 'Year') {
        labels.push(current.toLocaleDateString('default', { month: 'short' }));
        const randomValue = Math.random() * (Number(maxData) - Number(minData)) + Number(minData);
        data.push(randomValue);
      }
  
      if (selectedFilter === 'Week') {
        current.setDate(current.getDate() + 1);
      } else if (selectedFilter === 'Month') {
        current.setDate(current.getDate() + 1);
      } else if (selectedFilter === 'Year') {
        current.setMonth(current.getMonth() + 1);
      }
    }
  
    return {
        labels: labels,
        datasets: [{
            fill: true,
            label: label,
            data: data,
            borderColor: ["rgb(53, 162, 255)", "rgba(255, 99, 132, 1)"],
            backgroundColor: ["rgba(53, 162, 235, 0.5)", "rgba(255, 99, 132, 0.5)"]
        }]
     };
}

function Sensor(props) {

    const lastJsonMessage = useWebSocketMessages();

    const [statusColor, setStatusColor] = useState('green');
    // const [isWeekHover, setIsWeekHover] = useState(false);
    // const [isMonthHover, setIsMonthHover] = useState(false);
    // const [isYearHover, setIsYearHover] = useState(false);
    const [filter, setFilter] = useState('Week');
    const [chartData, setChartData] = useState(generateChartData('Week', props.minData, props.maxData, props.label));
    const [activeButton, setActiveButton] = useState('Week');

  const handleButtonClick = (button) => {
    setActiveButton(button);
  };

//    const handleMouse = (isEnter, Time) => {
//         switch(Time){
//             case 'Week':
//                 setIsWeekHover(isEnter ? true : false);
//                 setIsMonthHover(false);
//                 setIsYearHover(false);
//                 break;
//             case 'Month':
//                 setIsMonthHover(isEnter ? true : false);
//                 setIsWeekHover(false);
//                 setIsYearHover(false);
//                 break;
//             case 'Year':
//                 setIsYearHover(isEnter ? true : false);
//                 setIsWeekHover(false);
//                 setIsMonthHover(false);
//                 break;
//         }
//    };


// useEffect(() => {
//     if(activeButton){
//         $(`.${activeButton}`).css('background-color', 'fuchsia');
//         $(`.${activeButton}`).css('color', 'black');
//         $(`.${activeButton}`).css('border', 'none');
//     }
    
// }, [activeButton]);

   // Function to handle filter selection
  const handleFilterChange = (selectedFilter) => {
    // $(`.${selectedFilter.toLowerCase()}`).css('background-color', 'fuchsia');
    // $(`.${selectedFilter.toLowerCase()}`).css('color', 'black');
    // $(`.${selectedFilter.toLowerCase()}`).css('border', 'none');

    setActiveButton(selectedFilter);
    setFilter(selectedFilter);
    // Call a function to update the chart data based on the selected filter
    const newChartData = generateChartData(selectedFilter, props.minData, props.maxData, props.label)
    setChartData(newChartData);
  };

 
  

  const handleWebSocketMessage = (message) => {
    console.log('Received message:', message);
  };

  useEffect(() => {
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
    },
    scales: {
        y: {
          suggestedMin: props.minData, // Set the minimum value for the y-axis
          suggestedMax: props.maxData, // Set the maximum value for the y-axis
          beginAtZero: false
        },
      },
  };
  
//   const labels = ["January", "February", "March", "April", "May", "June", "July"];
  
//   const data = {
//     labels,
//     datasets: [
//       {
//         fill: true,
//         label: props.label,
//         data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
//         borderColor: "rgb(53, 162, 255)",
//         backgroundColor: "rgba(53, 162, 235, 0.5)"
//       }
//     ]
//   };

//   const circleStyle = {
//     // width: '16px',
//     // height: '16px',
//     // borderRadius: '50%',
//     backgroundColor: statusColor,
//   };

//   const filterContainer = {
//     width: '192px',
//     height: '30px',
//     backgroundColor: '#1a2035',
//     borderRadius: '6px',
//     borderColor: 'fuchsia',
//     borderStyle: 'solid',
//     lineHeight: '10px'
//   };

//   const filterButton = {
//     cursor: 'pointer',
//     // backgroundColor: isWeekHover || isMonthHover  || isYearHover ? 'fuchsia' :'transparent',
//     height: '50px',
//     borderColor: 'fuchsia',
//     boredr: '1px solid',
//     width: 'inherit',
//     height: '27px',
//     // color: isWeekHover || isMonthHover  || isYearHover ? 'white' : 'fuchsia',
//     fontSize: '16px',
//     padding: '0px 10px'
//   };



//   const weekStyle = {
//     backgroundColor: isWeekHover && !isMonthHover && !isYearHover ? 'fuchsia' :'transparent',
//     color: isWeekHover && !isMonthHover && !isYearHover ? 'black' : 'fuchsia',
//     border: 'none'
//   }
//   const monthStyle = {
//     backgroundColor: isMonthHover && !isWeekHover && !isYearHover ? 'fuchsia' :'transparent',
//     color: isMonthHover && !isWeekHover && !isYearHover ? 'black' : 'fuchsia',
//     border: 'none'
//   }

//   const yearStyle = {
//     backgroundColor: isYearHover && !isWeekHover && !isMonthHover ? 'fuchsia' :'transparent',
//     color: isYearHover && !isWeekHover && !isMonthHover ? 'black' : 'fuchsia',
//     border: 'none'
//   }

  return (

    <div>
        <div>
            <span className="sensorTitle"><span>{props.title}</span> sensor data</span>
            <div className="titleContainer">
                <span className="currentValueTitle">current value:</span>
                <span className="currentValueTitle">{props.currentValue}</span>
            </div>
            <div className="titleContainer">
                <div className="filterContainer">
                    <div style={{"display": "flex"}}>
                        {/* <button className="filterButton week" style={weekStyle} onClick={() => handleFilterChange('Week')} onMouseEnter={() => handleMouse(true, "Week")} onMouseLeave={() => handleMouse(false, "Week")}>week</button> */}
                        <button className="filterButton week" onClick={() => handleFilterChange('Week')}>week</button>
                        <div style={{"borderLeft": "2px solid fuchsia", "height": "26px"}}></div>
                        {/* <button className="filterButton month" style={monthStyle} onClick={() => handleFilterChange('Month')} onMouseEnter={() => handleMouse(true, "Month")} onMouseLeave={() => handleMouse(false, "Month")}>month</button> */}
                        <button className="filterButton month" onClick={() => handleFilterChange('Month')}>month</button>
                        <div style={{"borderLeft": "2px solid fuchsia", "height": "26px"}}></div>
                        {/* <button className="filterButton year" style={yearStyle} onClick={() => handleFilterChange('Year')} onMouseEnter={() => handleMouse(true, "Year")} onMouseLeave={() => handleMouse(false, "Year")}>year</button> */}
                        <button className="filterButton year" onClick={() => handleFilterChange('Year')}>year</button>

                    </div>
                </div>
                <div className="circle" style={{backgroundColor: statusColor}}></div>
            </div>
        </div>
        <div>
            <Line options={options} data={chartData} />
        </div>
    </div>
  );
}

export default Sensor