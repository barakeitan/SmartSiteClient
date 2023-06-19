import React, { useState, useMemo, useEffect} from "react";
import { RadialGauge } from "react-canvas-gauges";
import { Link, useParams } from 'react-router-dom';
// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
// import DateTimePicker from '@mui/lab/DateTimePicker';
// import TextField from '@mui/material/TextField';

import AdapterDateFns from '@mui/lab/AdapterDateFns';
// import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { MuiPickersUtilsProvider, KeyboardDateTimePicker } from '@material-ui/pickers';
// import {DateFnsUtils} from "@date-io/date-fns"


// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";

import DataTable from "examples/Tables/DataTable";
import { Menu, MenuItem } from '@mui/material';
import Select from 'react-select';

import {
  useMaterialUIController,
  setMiniSidenav,
  setTransparentSidenav,
  setWhiteSidenav,
} from "context";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

import Gauge from "./components/gauge";
import Icon from "@mui/material/Icon";
import MDSnackbar from "components/MDSnackbar";

import styles from './Gauges.module.css';
import MDInput from "components/MDInput";


import { handleRefreshTokenValidation, getComputersByRoomId, getLastTelemetryData, getTelemetryTableUpdates } from '../../services/index';

function Gauges() {

  const [errorSB, setErrorSB] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const closeErrorSB = () => setErrorSB(false);
  const { roomId } = useParams(); // Retrieve the roomId param from the URL
  const [currentTelemetryEntity, setCurrentTelemetryEntity] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);


  const [controller, dispatch] = useMaterialUIController();
  // const [FromValue, setFrom] = React.useState(new Date('2014-08-18T21:11:54'));
  const [FromValue, setFrom] = useState();
  
  const handleFromDateChange = (newValue) => {
    setFrom(newValue);
  };
  const { miniSidenav, transparentSidenav, whiteSidenav, darkMode, sidenavColor } = controller;
  const [anchorEl, setAnchorEl] = useState(null);
  const [computerList, setComputerList] = useState([]);

  const [telemetryData, setTelemetryData] = useState([]); 
  const [cpu, setCpu] = useState({cpu_data: 70, ts_cpu: ""});
  const [disk, setDisk] = useState({disk_data: 75, ts_disk: ""});
  const [memory, setMemory] = useState({memory_data: 22, ts_memory: ""});
  const tbl_cols = useMemo(()=>[{Header:"CPU TimeStamp", accessor:"ts_cpu"},
                            {Header:"CPU Usage", accessor:"cpu"},
                            {Header:"DISK TimeStamp", accessor:"ts_disk"},
                            {Header:"DISK Usage", accessor:"disk"},
                            {Header:"MEMORY TimeStamp", accessor:"ts_memory"},
                            {Header:"MEMORY Usage", accessor:"memory"}],[]);

  const [tbl_rows, setRows] = useState([{}]);

  

  useEffect(() => {
    try {
      // get the list of computers in the specific room
      const fetchComputerList = () => {
        getComputersByRoomId(roomId).then((data) => {
          if (data?.error) {
            setErrorMsg(data.error);
            setErrorSB(true);
          } else {
            console.log("computerList: " , data.data);
            setComputerList(data.data);
            setCurrentTelemetryEntity(data.data[0]);
            // fetchLastTelemetryData();
            // fetchTableUpdates();
          }
        }).catch((err) => {
          console.log("err in gauges page: ", err);
        });
        
      }
  
      fetchComputerList();
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    if(currentTelemetryEntity){
      fetchLastTelemetryData();
      fetchTableUpdates();
    }
  }, [currentTelemetryEntity]);

  useEffect(() => {
    const inret = setInterval(() => {
      if(currentTelemetryEntity){
        fetchLastTelemetryData();
        fetchTableUpdates();
      }
    }, 3000);
  return () => clearInterval(inret); //This is important
  }, [currentTelemetryEntity]);

  
  
  // useEffect(() => {
  //   const inter = setInterval(() => {
  //     if(currentTelemetryEntity){
  //       fetchLastTelemetryData();
  //       fetchTableUpdates();
  //     }
  //   }, 6000);
  //   clearInterval(inter);
  // }, []);

  const fetchLastTelemetryData = async () => {
    const data = await getLastTelemetryData(currentTelemetryEntity?._id);
    let telemetryOnlyData = [];
    const regex = /percent=(\d+\.\d+)/;
    data.forEach(el => {

      // Extracting the percentage value using regular expressions
      const match = el.sensorData.match(regex);

      if (match) {
        const percentage = parseFloat(match[1]);
        telemetryOnlyData[el.sensorTypeId.name.split(" ")[0]] = {
          title: determineGaugeTitle(el.sensorTypeId.name.split(" ")[0]),
          percentage: percentage,
          timestamp: el.date
        }
      } else {
        telemetryOnlyData[el.sensorTypeId.name.split(" ")[0]] = {
          title: determineGaugeTitle(el.sensorTypeId.name.split(" ")[0]),
          percentage: el.sensorData,
          timestamp: el.date
        }
      }
    });
    setTelemetryData(telemetryOnlyData);
  }

  const determineGaugeTitle = (name) => {
    switch(name){
      case "Cpu":
        return "CPU Usage";
      case "Disk":
        return "Disk Utilization";
        case "Ram":
          return "RAM Memory"
    }
  }

  const convertToLocalTime = (utcDate) => {
    const localDate = new Date(Date.parse(utcDate)).toString().split(" GMT")[0];
    return localDate.toString(); // Modify options as per your requirement
  };

  const convertTableUpdates = async (rows_data, resArr) => {
    const cpuSensorRecords = rows_data.cpu.length > 0 ? rows_data.cpu.shift() : null;
    const diskSensorRecords = rows_data.disk.length > 0 ? rows_data.disk.shift() : null;
    const memorySensorRecords = rows_data.memory.length > 0 ? rows_data.memory.shift(): null;

    if(!cpuSensorRecords || !diskSensorRecords || !memorySensorRecords){
      return resArr;
    }

      resArr.push({
        ts_cpu:  cpuSensorRecords ? convertToLocalTime(cpuSensorRecords?.date) : "",
        cpu: cpuSensorRecords ? cpuSensorRecords?.sensorData : "",
        ts_disk: diskSensorRecords ? convertToLocalTime(diskSensorRecords?.date) : "",
        disk: diskSensorRecords ? diskSensorRecords?.sensorData : "",
        ts_memory: memorySensorRecords ? convertToLocalTime(memorySensorRecords?.date) : "",
        memory: memorySensorRecords ? memorySensorRecords?.sensorData : ""
      })
    convertTableUpdates(rows_data, resArr);
  }

  const fetchTableUpdates = async () => {
    console.log("currentTelemetryEntity?._id: ", currentTelemetryEntity?._id);
    const rows_data = await getTelemetryTableUpdates(currentTelemetryEntity?._id);
    console.log("table rows ------>", rows_data);

    let newRowsArr = []
    await convertTableUpdates(rows_data, newRowsArr);

    setRows(newRowsArr);
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChange = (selectedItems) => {
    setSelectedOptions(selectedItems);
  };

  const handleOptionSelect = (computer) => {
    console.log("computer:::", computer)
    setCurrentTelemetryEntity(computer);
    setAnchorEl(null);
  };

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
      <MDBox style={{display: "flex", justifyContent: "space-between"}}>
        <div>
          <Icon fontSize="medium" color="inherit">
                {"leaderboard"}
          </Icon>
          <MDButton style={{marginLeft: "20px"}}
                  component="button"
                  target="_blank"
                  rel="noreferrer"
                  variant="contained"
                  color={sidenavColor}
                  onClick={handleClick}
                >
                  Choose Computer
          </MDButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            {(computerList || [])?.map((computer, index) => (
              <MenuItem key={index} onClick={() => { handleOptionSelect(computer); handleClose(); }}>{computer?.telemetryEntityName}</MenuItem>
            ))}
          </Menu>
        </div>
        <Link to={`/${roomId}/sensors`}>
          <MDButton
                component="button"
                target="_blank"
                rel="noreferrer"
                variant="gradient"
                color={sidenavColor}
                fullWidth
              >
                see sensors page
            </MDButton>
        </Link>
      </MDBox>
      <MDBox py={3}>
        <Grid container spacing={3}>
          {Object.keys(telemetryData).map((item, index) => {
            return (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <Gauge
                  title={telemetryData[item]?.title}
                  value={telemetryData[item]?.percentage}
                  value_ts={telemetryData[item]?.timestamp}
                />
              </Grid>
            );
          })}
          {/* <Grid item xs={12} md={6} lg={4}>
            <Gauge
                  title="Disk Utilization"
                  value={disk.disk_data}
                  value_ts={disk.ts_disk}
                />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
              <Gauge
                  title="RAM Memory"
                  value={memory.memory_data}
                  value_ts={memory.ts_memory}
                />
          </Grid> */}
        </Grid>
        {/* <MDBox p={2} mt="auto">
          <MDButton
              component="button"
              target="_blank"
              rel="noreferrer"
              variant="gradient"
              color={sidenavColor}
              fullWidth
              onClick={fetchData}
            >
              fetch data
            </MDButton>
        </MDBox> */}
      </MDBox>

      {/* Time pickers */}
      <MDBox p={2} mt="auto">
        {/* <MDBox>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  label="Date&Time picker"
                  inputFormat="MM/dd/yyyy"
                  value={FromValue}
                  onChange={handleFromDateChange}
                  renderInput={(params) => <TextField {...params} />}
                />
            </LocalizationProvider>
            test text
        </MDBox> */}
        {/* <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDateTimePicker
            // margin="normal"
            // id="date-time-picker"
            // label="Date and Time"
            // format="yyyy-MM-dd'T'HH:mm:ss"
            value={FromValue}
            onChange={handleFromDateChange}
            // KeyboardButtonProps={{
            //   'aria-label': 'change date and time',
            // }}
          />
        </MuiPickersUtilsProvider> */}


        {/* <MDInput type="datetime"  label="Start Time"/>
        <MDInput type="datetime" label="End Time"  /> */}
      </MDBox>

      {/* Table */}
      <MDBox>
        <Card>
          <MDBox
            mx={2}
            mt={-3}
            py={3}
            px={2}
            variant="gradient"
            bgColor="info"
            borderRadius="lg"
            coloredShadow="info"
          >
            <MDTypography variant="h6" color="white">
              Telemetry Table
            </MDTypography>
          </MDBox>
          <MDBox pt={3}>
          {/* <Select
            options={options}
            isMulti
            value={selectedOptions}
            onChange={handleChange}
            classNamePrefix="react-select"
            closeMenuOnSelect={false}
            components={{
              IndicatorSeparator: () => null,
            }}
          /> */}
            <DataTable
              table={{ columns: tbl_cols, rows: tbl_rows }}
              isSorted={false}
              entriesPerPage={{ defaultValue: 10, entries: [5, 10, 15, 20, 25] }}
              showTotalEntries={true}
              noEndBorder
            />
          </MDBox>
        </Card>
      </MDBox>
      <MDBox pt={2} px={2}>
        <Grid item xs={12} sm={6} lg={3}>
          {renderErrorSB}
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default Gauges;
