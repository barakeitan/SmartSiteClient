import React, { useState, useMemo} from "react";
import { RadialGauge } from "react-canvas-gauges";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";


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
import Footer from "examples/Footer";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

import Sensor from "./components/sensor/index";
import Icon from "@mui/material/Icon";
import MDSnackbar from "components/MDSnackbar";


import { handleRefreshTokenValidation } from '../../services/index';

function Sensors() {

  const [response, setResponse] = useState(null);
  const [errorSB, setErrorSB] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const closeErrorSB = () => setErrorSB(false);

  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentSidenav, whiteSidenav, darkMode, sidenavColor } = controller;
  const [cpu, setCpu] = useState({cpu_data: 70, ts_cpu: ""});
  const [disk, setDisk] = useState({disk_data: 75, ts_disk: ""});
  const [memory, setMemory] = useState({memory_data: 22, ts_memory: ""});
  const tbl_cols = useMemo(()=>[{Header:"Sensor", accessor:"ts_cpu"},
                            {Header:"Last data", accessor:"cpu_data"},
                            {Header:"Date", accessor:"ts_disk"},
                            {Header:"Melfunction", accessor:"disk_data"},
                            {Header:"Level of risk", accessor:"ts_memory"},
                            {Header:"Treated?", accessor:"memory_data"}],[]);
  const [tbl_rows, setRows] = useState([{ts_cpu:cpu.ts_cpu, cpu_data:cpu.cpu_data, 
    ts_disk:disk.ts_disk, disk_data:disk.disk_data, 
    ts_memory:memory.ts_memory, memory_data:memory.memory_data}]);

  const fetchData = async () => {
    try{
      // const response = await fetch("http://localhost:8001");
      await handleRefreshTokenValidation();
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

      setRows([{
        cpu_data: "7.89",
        ts_cpu: "[2023-03-28T19:56:49.3559798Z]",
        disk_data: "3.2",
        ts_disk: "[2023-03-28T19:56:49.3559798Z]",
        memory_data: "10.1",
        ts_memory: "[2023-03-28T19:56:49.3559798Z]"
      },{
        cpu_data: "3.21",
        ts_cpu: "[2023-03-28T19:56:50.3559798Z]",
        disk_data: "3.2",
        ts_disk: "[2023-03-28T19:56:50.3559798Z]",
        memory_data: "16.789",
        ts_memory: "[2023-03-28T19:56:50.3559798Z]"
      },{
        cpu_data: "17.463",
        ts_cpu: "[2023-03-28T19:57:49.3559798Z]",
        disk_data: "1.77",
        ts_disk: "[2023-03-28T19:57:49.3559798Z]",
        memory_data: "9.486",
        ts_memory: "[2023-03-28T19:57:49.3559798Z]"
      },{
        cpu_data: "4.786",
        ts_cpu: "[2023-03-28T19:58:49.3559798Z]",
        disk_data: "1.8",
        ts_disk: "[2023-03-28T19:58:49.3559798Z]",
        memory_data: "3.74",
        ts_memory: "[2023-03-28T19:58:49.3559798Z]"
      }]);
    } catch(e){
      setErrorMsg(e.message);
      setErrorSB(true);
    }
    
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
      <Icon fontSize="medium" color="inherit">
            {"leaderboard"}
      </Icon>
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={4}>
              <Sensor
                title='Temperature'
                label='temperature sensore'
                severity='1'
                minData='-4'
                maxData='50'
                currentValue='26'
              />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <Sensor
                title='Sound'
                label='sound sensore'
                severity='2'
                minData='10'
                maxData='100'
                currentValue='50'
                />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
              <Sensor
                title='Water'
                label='water sensore'
                severity='3'
                minData='0'
                maxData='15'
                currentValue='9'
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
              Melfunction Table
            </MDTypography>
          </MDBox>
          <MDBox pt={3}>
            <DataTable
              table={{ columns: tbl_cols, rows: tbl_rows }}
              isSorted={false}
              entriesPerPage={false}
              showTotalEntries={false}
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

export default Sensors;
