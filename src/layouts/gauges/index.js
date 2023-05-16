import React, { useState, useMemo} from "react";
import { RadialGauge } from "react-canvas-gauges";

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


import styles from './Gauges.module.css';
import MDInput from "components/MDInput";


function Gauges() {

  const [response, setResponse] = useState(null);
  const [controller, dispatch] = useMaterialUIController();
  // const [FromValue, setFrom] = React.useState(new Date('2014-08-18T21:11:54'));
  const [FromValue, setFrom] = React.useState();
  
  const handleFromDateChange = (newValue) => {
    setFrom(newValue);
  };
  const { miniSidenav, transparentSidenav, whiteSidenav, darkMode, sidenavColor } = controller;
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
    const accessToken = localStorage.getItem('accessToken');
    const response = await fetch("http://localhost:3007/api/telemetry", {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
    const data = await response.json();
    setResponse(data);
    console.log(data);
    setCpu({cpu_data: data.cpu, ts_cpu: data.ts_cpu});
    setDisk({disk_data: data.disk, ts_disk: data.ts_disk});
    setMemory({memory_data: data.memory, ts_memory: data.ts_memory});

    //get Table rows
    const rows_response = await fetch("http://localhost:3007/api/updates_table", {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    const rows_data = await rows_response.json();
    setRows(rows_data)
    // setRows([{
    //   cpu_data: "7.89",
    //   ts_cpu: "[2023-03-28T19:56:49.3559798Z]",
    //   disk_data: "3.2",
    //   ts_disk: "[2023-03-28T19:56:49.3559798Z]",
    //   memory_data: "10.1",
    //   ts_memory: "[2023-03-28T19:56:49.3559798Z]"
    // },{
    //   cpu_data: "3.21",
    //   ts_cpu: "[2023-03-28T19:56:50.3559798Z]",
    //   disk_data: "3.2",
    //   ts_disk: "[2023-03-28T19:56:50.3559798Z]",
    //   memory_data: "16.789",
    //   ts_memory: "[2023-03-28T19:56:50.3559798Z]"
    // },{
    //   cpu_data: "17.463",
    //   ts_cpu: "[2023-03-28T19:57:49.3559798Z]",
    //   disk_data: "1.77",
    //   ts_disk: "[2023-03-28T19:57:49.3559798Z]",
    //   memory_data: "9.486",
    //   ts_memory: "[2023-03-28T19:57:49.3559798Z]"
    // },{
    //   cpu_data: "4.786",
    //   ts_cpu: "[2023-03-28T19:58:49.3559798Z]",
    //   disk_data: "1.8",
    //   ts_disk: "[2023-03-28T19:58:49.3559798Z]",
    //   memory_data: "3.74",
    //   ts_memory: "[2023-03-28T19:58:49.3559798Z]"
    // }]);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Icon fontSize="medium" color="inherit">
            {"leaderboard"}
      </Icon>
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
              Telemetry Data Table
            </MDTypography>
          </MDBox>
          <MDBox pt={3}>
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
    </DashboardLayout>
  );
}

export default Gauges;
