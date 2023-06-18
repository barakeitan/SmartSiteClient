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

  const [response, setResponse] = useState(null);
  const [errorSB, setErrorSB] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const closeErrorSB = () => setErrorSB(false);
  const { roomId } = useParams(); // Retrieve the roomId param from the URL
  const [currentTelemetryEntity, setCurrentTelemetryEntity] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const options = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
    // Add more options as needed
  ];

  const [controller, dispatch] = useMaterialUIController();
  // const [FromValue, setFrom] = React.useState(new Date('2014-08-18T21:11:54'));
  const [FromValue, setFrom] = useState();
  
  const handleFromDateChange = (newValue) => {
    setFrom(newValue);
  };
  const { miniSidenav, transparentSidenav, whiteSidenav, darkMode, sidenavColor } = controller;
  const [anchorEl, setAnchorEl] = useState(null);
  const [computerList, setComputerList] = useState([]);

  const [cpu, setCpu] = useState({cpu_data: 70, ts_cpu: ""});
  const [disk, setDisk] = useState({disk_data: 75, ts_disk: ""});
  const [memory, setMemory] = useState({memory_data: 22, ts_memory: ""});
  const tbl_cols = useMemo(()=>[{Header:"CPU TimeStamp", accessor:"ts_cpu"},
                            {Header:"CPU Usage", accessor:"cpu"},
                            {Header:"DISK TimeStamp", accessor:"ts_disk"},
                            {Header:"DISK Usage", accessor:"disk"},
                            {Header:"MEMORY TimeStamp", accessor:"ts_memory"},
                            {Header:"MEMORY Usage", accessor:"memory"}],[]);
  // const tbl_rows = useMemo(()=>[cpu.ts_cpu, cpu.cpu_data, 
  //                               disk.ts_disk, disk.disk_data, 
  //                               memory.ts_memory, memory.memory_data],
                                
  //                               [cpu.ts_cpu, cpu.cpu_data, 
  //                               disk.ts_disk, disk.disk_data, 
  //                               memory.ts_memory, memory.memory_data]);

  const [tbl_rows, setRows] = useState([{ts_cpu:cpu.ts_cpu, cpu:cpu.cpu_data, 
      ts_disk:disk.ts_disk, disk:disk.disk_data, 
      ts_memory:memory.ts_memory, memory:memory.memory_data}]);

  const fetchData = async () => {
    //get the last line
    try{
      // await handleRefreshTokenValidation();
      // const accessToken = localStorage.getItem('accessToken');
      // const response = await fetch("http://localhost:3007/api/last"
      // , {
      //   headers: {
      //     Authorization: `Bearer ${accessToken}`
      //   }
      // }
      // );    
      const data = await getLastTelemetryData();
      setResponse(data);
      console.log(data);
      setCpu({cpu_data: data.cpu, ts_cpu: data.ts_cpu});
      setDisk({disk_data: data.disk, ts_disk: data.ts_disk});
      setMemory({memory_data: data.memory, ts_memory: data.ts_memory});

      //get Table rows
      // const rows_response = await fetch("http://localhost:3007/api/updates_table"
      // , {
      //   headers: {
      //     Authorization: `Bearer ${accessToken}`
      //   }
      // }
      // );
      const rows_data = await getTelemetryTableUpdates();
      setRows(rows_data);
    } 
    catch(e){
      setErrorMsg(e.message);
      setErrorSB(true);
    }
  };

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
            fetchLastTelemetryData();
            fetchTableUpdates();
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
    fetchLastTelemetryData();
    fetchTableUpdates();
  }, [currentTelemetryEntity]);

  const fetchLastTelemetryData = async () => {
    console.log("currentTelemetryEntity = " , currentTelemetryEntity);
    const data = await getLastTelemetryData(currentTelemetryEntity?._id);
    setResponse(data);
    console.log(data);
    setCpu({cpu_data: data.cpu, ts_cpu: data.ts_cpu});
    setDisk({disk_data: data.disk, ts_disk: data.ts_disk});
    setMemory({memory_data: data.memory, ts_memory: data.ts_memory});
  }

  const fetchTableUpdates = async () => {
    const rows_data = await getTelemetryTableUpdates(currentTelemetryEntity?._id);
    setRows(rows_data);
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
      <div>
        <MDButton
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
      <MDBox style={{display: "flex", justifyContent: "space-between"}}>
        <Icon fontSize="medium" color="inherit">
              {"leaderboard"}
        </Icon>
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
          <Grid item xs={12} md={6} lg={4}>
              <Gauge
                title="CPU Usage"
                value={cpu.cpu_data}
                value_ts={cpu.ts_cpu}
              />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
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
          </Grid>
        </Grid>
        <MDBox p={2} mt="auto">
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
        </MDBox>
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
        <MDInput type="datetime"  label="Start Time"/>
        <MDInput type="datetime" label="End Time"  />
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
