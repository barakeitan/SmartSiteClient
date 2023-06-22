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
import { getSensorRecordsBySensorId } from '../../../../services/index';

const generateChartData = (selectedFilter, minData, maxData, label) => {
    const currentDate = new Date();
    let startDate, endDate;
  
    if (selectedFilter === 'Today') {
        startDate = new Date(currentDate);
        startDate.setHours(currentDate.getHours() - 23, 0, 0, 0);

        // endDate = new Date(currentDate);
        // endDate.setHours(23, 59, 59, 999);
        endDate = new Date();
        endDate.setHours(currentDate.getHours(), currentDate.getMinutes(), currentDate.getSeconds(), currentDate.getMilliseconds());
    } else if (selectedFilter === 'Week') {
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
        if (selectedFilter === 'Today') {
            // labels.push(current.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
            // const randomValue = Math.random() * (Number(maxData) - Number(minData)) + Number(minData);
            // data.push(randomValue);
            // current.setHours(current.getHours() + 1);

        
            // labels.push(current.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }));
            // const randomValue = Math.random() * (Number(maxData) - Number(minData)) + Number(minData);
            // data.push(randomValue);
            // current.setHours(current.getHours() + 1);

            const hours = current.getHours().toString().padStart(2, '0');
            const minutes = current.getMinutes().toString().padStart(2, '0');
            labels.push(`${hours}:${minutes}`);
            const randomValue = Math.random() * (Number(maxData) - Number(minData)) + Number(minData);
            data.push(randomValue);
            current.setHours(current.getHours() + 1);
        } else if (selectedFilter === 'Week') {
            labels.push(current.toLocaleDateString());
            const randomValue = Math.random() * (Number(maxData) - Number(minData)) + Number(minData);
            data.push(randomValue);
            current.setDate(current.getDate() + 1);
        } else if (selectedFilter === 'Month') {
            labels.push(`${current.getMonth() + 1}/${current.getDate()}`);
            const randomValue = Math.random() * (Number(maxData) - Number(minData)) + Number(minData);
            data.push(randomValue);
            current.setDate(current.getDate() + 1);
        } else if (selectedFilter === 'Year') {
            labels.push(current.toLocaleDateString('default', { month: 'short' }));
            const randomValue = Math.random() * (Number(maxData) - Number(minData)) + Number(minData);
            data.push(randomValue);
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

    // const lastJsonMessage = useWebSocketMessages();
    // console.log('Latest WebSocket message:', lastJsonMessage);

    const [statusColor, setStatusColor] = useState('green');
    const [filter, setFilter] = useState('Week');
    // const [chartData, setChartData] = useState(generateChartData('Week', props.minData, props.maxData, props.label));
    const [selectedFilter, setSelectedFilter] = useState('Today');
    const [chartData, setChartData] = useState(null);


  useEffect(() => {
    fetchData(selectedFilter);
  }, [selectedFilter]);
  
  const fetchData = async (filter) => {
    try {
      let sensorRecordData = await getSensorRecordsBySensorId(props.id);
      const filteredList = removeDuplications(sensorRecordData);
      const chartData = filterData(filteredList, filter);
      setChartData(chartData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const removeDuplications = (sensorRecordData) => {
    // Set to store unique date fields
    const uniqueDates = new Set();

    // Filter the list, removing objects with duplicate date fields
    const filteredList = sensorRecordData.filter(obj => {
      if (uniqueDates.has(obj.date)) {
        return false; // Duplicate date, exclude the object from the list
      }
      uniqueDates.add(obj.date); // Add the date to the set
      return true; // Unique date, include the object in the list
    });
    return filteredList;
  }

  // const removeDuplications = (sensorRecordData) => {
  //   // Set to store unique date fields
  //   const uniqueDates = new Set();
  //   console.log("sensorRecordData ----:: ", sensorRecordData);

  //   // Filter the list, removing objects with duplicate date fields
  //   const filteredList = sensorRecordData.filter(obj => {
  //     if (uniqueDates.has(obj.date)) {
  //         // uniqueDates.delete(obj);
  //         // uniqueDates.add(obj); // Add the date to the set
  //       return false; // Duplicate date, exclude the object from the list
  //     } else {
  //       uniqueDates.add(obj); // Add the date to the set
  //       return true; // Unique date, include the object in the list
  //     }
  //   });


    // sensorRecordData.forEach(obj => {
    //   if (uniqueDates.has(obj.date)) {
    //       uniqueDates.delete(obj);
    //       uniqueDates.add(obj); // Add the date to the set
    //     // return false; // Duplicate date, exclude the object from the list
    //   } else {
    //     uniqueDates.add(obj); // Add the date to the set
    //     // return true; // Unique date, include the object in the list
    //   }
    // });
    // const filteredList = sensorRecordData.filter(obj=>{
    //   if(uniqueDates.has(obj._id)){
    //     return true;
    //   }
    //   return false;
    // })


  //   return filteredList;
  // }


  // Filter the data based on the selected filter
  const filterData = (data, filter) => {
    const currentDate = new Date();
    let startDate, endDate;
  
    if (filter === 'Today') {
      startDate = new Date(currentDate);
      startDate.setHours(currentDate.getHours() - 23, 0, 0, 0);
      endDate = new Date();
      endDate.setHours(currentDate.getHours(), currentDate.getMinutes(), currentDate.getSeconds(), currentDate.getMilliseconds());
    } else if (filter === 'Week') {
      startDate = new Date(currentDate);
      startDate.setDate(currentDate.getDate() - 7);

      endDate = new Date(currentDate);
      // endDate.setDate(startDate.getDate() + 6);
    } else if (filter === 'Month') {
      startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    } else if (filter === 'Year') {
      startDate = new Date(currentDate.getFullYear(), 0, 1);
      endDate = new Date(currentDate.getFullYear(), 11, 31);
    }


    const labels = [];
    const sensorData = [];
    data?.sort((a, b) => new Date(a.date) - new Date(b.date));
    const filteredData = data?.filter((item) => {
      //const itemDate = converToUtcTime(item?.date);
      const itemDate = new Date(new Date(item?.date).setHours(new Date(item?.date).getHours() - 3));
      let x = itemDate >= startDate && itemDate <= endDate;

      return x;
    });
    // let index = (filteredData.length > 0 ? filteredData.length - 1 : 0);
    let index = 0;
    if(filteredData.length > 0) {
      // let current = converToUtcTime(filteredData[index]?.date);
      // let current = new Date(filteredData[index]?.date);
      let current = new Date(new Date(filteredData[index]?.date).setHours(new Date(filteredData[index]?.date).getHours() - 3));

    
      while (current <= endDate) {
        if (filter === 'Today') {
            const hours = current.getHours().toString().padStart(2, '0');
            const minutes = current.getMinutes().toString().padStart(2, '0');
            labels.push(`${hours}:${minutes}`);
        } else if(filter == "Week"){
          labels.push(current.toLocaleDateString());
          // !(labels.indexOf(current.toLocaleDateString()) > -1) ? labels.push(current.toLocaleDateString()): null;
        } else if(filter == "Month") {
            labels.push(`${current.getMonth() + 1}/${current.getDate()}`);
        } else if(filter == "Year") {
            labels.push(current.toLocaleDateString('default', { month: 'short' }));
        }
        sensorData.push(filteredData[index].sensorData);
        index++;
        // current = converToUtcTime(filteredData[index]?.date);
        // current = new Date(filteredData[index]?.date);
        current = new Date(new Date(filteredData[index]?.date).setHours(new Date(filteredData[index]?.date).getHours() - 3));

      }
    }

    return {
      labels: labels,
      datasets: [{
          fill: true,
          label: props.label,
          data: sensorData || [],
          borderColor: ["rgb(53, 162, 255)", "rgba(255, 99, 132, 1)"],
          backgroundColor: ["rgba(53, 162, 235, 0.5)", "rgba(255, 99, 132, 0.5)"]
      }]
   };
  };

  const converToUtcTime = (myDate) => {
    const itemDate = new Date(myDate);
    const localHourOffset = itemDate.getTimezoneOffset() / 60; 
    itemDate.setUTCHours(itemDate.getUTCHours() + localHourOffset);
    return itemDate;
  } 

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
    animation: false,
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


  return (

    <div>
        <div>
            <span className="sensorTitle"><span>{props.label}</span> data</span>
            <div className="titleContainer">
                <span className="currentValueTitle">current value:</span>
                <span className="currentValueTitle">{props.currentValue}</span>
            </div>
            <div className="titleContainer">
                <div className="filterContainer">
                    <div style={{"display": "flex"}}>
                        <button className={selectedFilter === 'Today' ? 'filterButton active' : 'filterButton'} onClick={() => setSelectedFilter('Today')}>today</button>
                        <div style={{"borderLeft": "2px solid fuchsia", "height": "26px"}}></div>
                        <button className={selectedFilter === 'Week' ? 'filterButton active' : 'filterButton'} onClick={() => setSelectedFilter('Week')}>week</button>
                        <div style={{"borderLeft": "2px solid fuchsia", "height": "26px"}}></div>
                        <button className={selectedFilter === 'Month' ? 'filterButton active' : 'filterButton'} onClick={() => setSelectedFilter('Month')}>month</button>
                        <div style={{"borderLeft": "2px solid fuchsia", "height": "26px"}}></div>
                        <button className={selectedFilter === 'Year' ? 'filterButton active' : 'filterButton'} onClick={() => setSelectedFilter('Year')}>year</button>

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