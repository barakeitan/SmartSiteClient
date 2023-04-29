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

import Gauge from "./components/gauge";
import Icon from "@mui/material/Icon";


import styles from './Gauges.module.css';

function Gauges() {

  const [response, setResponse] = useState(null);
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentSidenav, whiteSidenav, darkMode, sidenavColor } = controller;
  const [cpu, setCpu] = useState({cpu_data: 70, ts_cpu: ""});
  const [disk, setDisk] = useState({disk_data: 75, ts_disk: ""});
  const [memory, setMemory] = useState({memory_data: 22, ts_memory: ""});
  const tbl_cols = useMemo(()=>[{Header:"CPU TimeStamp", accessor:"ts_cpu"},
                            {Header:"CPU Usage", accessor:"cpu_data"},
                            {Header:"DISK TimeStamp", accessor:"ts_disk"},
                            {Header:"DISK Usage", accessor:"disk_data"},
                            {Header:"MEMORY TimeStamp", accessor:"ts_memory"},
                            {Header:"MEMORY Usage", accessor:"memory_data"}],[]);
  // const tbl_rows = useMemo(()=>[cpu.ts_cpu, cpu.cpu_data, 
  //                               disk.ts_disk, disk.disk_data, 
  //                               memory.ts_memory, memory.memory_data],
                                
  //                               [cpu.ts_cpu, cpu.cpu_data, 
  //                               disk.ts_disk, disk.disk_data, 
  //                               memory.ts_memory, memory.memory_data]);
  const [tbl_rows, setRows] = useState([{ts_cpu:cpu.ts_cpu, cpu_data:cpu.cpu_data, 
    ts_disk:disk.ts_disk, disk_data:disk.disk_data, 
    ts_memory:memory.ts_memory, memory_data:memory.memory_data}]);

  const fetchData = async () => {
    // const response = await fetch("http://localhost:8001");
    const response = await fetch("http://localhost:3007/api/telemetry");    const data = await response.json();
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
              Projects Table
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
    </DashboardLayout>
  );
}

export default Gauges;
