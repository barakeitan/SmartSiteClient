import React, { useState, useMemo, useEffect} from "react";
import { useParams } from 'react-router-dom';
import { RadialGauge } from "react-canvas-gauges";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { Link } from 'react-router-dom';

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


import { getAllMalfunctionsByRoomId, getSensorsByRoomId, handleRefreshTokenValidation } from '../../services/index';

function Sensors() {

  const [response, setResponse] = useState(null);
  const [errorSB, setErrorSB] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const closeErrorSB = () => setErrorSB(false);

  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentSidenav, whiteSidenav, darkMode, sidenavColor } = controller;
  const { roomId } = useParams(); // Retrieve the roomId param from the URL
  // const [malfunctionsList, setMalfunctionsList] = useState([{}]);
  const [sensorsList, setSensorsList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Store current page number

  const tbl_cols = useMemo(() => [
        { Header: "Sensor", accessor: "sensorName" },
        { Header: "Last data", accessor: "recent_data" },
        { Header: "Date", accessor: "date" },
        { Header: "Severity", accessor: "severity" },
        { Header: "Description", accessor: "message" }
      ], []);
  const [tbl_rows, setRows] = useState([{}]);

  // const convertToLocalTime = (utcDate) => {
  //   const localDate = new Date(Date.parse(utcDate)).toString().split(" GMT")[0];
  //   return localDate.toString(); // Modify options as per your requirement
  // };

  const fetchMalfunctions = () => {
    getAllMalfunctionsByRoomId(roomId).then((data) => {
          if (data?.error) {
          setErrorMsg(data.error);
          setErrorSB(true);
          } else {
              console.log("MalfunctionsList data:!!!!!!!!!!!! " + data);
              data?.sort((a, b) => {
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);
                return dateB - dateA;
              });
              // setMalfunctionsList(data);
              console.log(data[0]['malfunctionTypeId']['riskDescription']);
              const rows = data.map((malfunction) => ({
                sensorName: malfunction?.sensorId?.sensorTypeId?.name ?? "",
                recent_data: malfunction?.recent_data ?? "",
                date: malfunction?.date ?? "",
                severity: malfunction?.severity ?? "",
                message: (malfunction?.malfunctionTypeId?.riskDescription != "undefined" ? 
                          malfunction?.malfunctionTypeId?.riskDescription + ". ": "") + malfunction?.message ?? ""
              }));
              setRows(rows);
          }
      });
  };

  useEffect(async () => {
    let sensorData = (await getSensorsByRoomId(roomId)).filter((sensor) => {
      return sensor.sensorTypeId.name === "Temperature Sensor" || sensor.sensorTypeId.name === "Sound Sensor" ||
             sensor.sensorTypeId.name === "Water Level Sensor";
    });
    setSensorsList(sensorData);
    fetchMalfunctions();
  }, []);

  useEffect(() => {
    const inret = setInterval(async() => {
      let sensorData = (await getSensorsByRoomId(roomId)).filter((sensor) => {
        return sensor.sensorTypeId.name === "Temperature Sensor" || sensor.sensorTypeId.name === "Sound Sensor" ||
               sensor.sensorTypeId.name === "Water Level Sensor";
      });
      setSensorsList(sensorData);
      fetchMalfunctions();
    }, 3000);
  return () => clearInterval(inret); //This is important
  }, []);

  // Function to handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
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
        <Icon fontSize="medium" color="inherit">
              {"leaderboard"}
        </Icon>
        <Link to={`/${roomId}/gauges`}>
          <MDButton
                component="button"
                target="_blank"
                rel="noreferrer"
                variant="gradient"
                color={sidenavColor}
                fullWidth
              >
                see Gauges page
            </MDButton>
        </Link>
      </MDBox>
      <MDBox py={3}>
        {
          sensorsList ?
          <Grid container spacing={sensorsList.length}>
            {sensorsList.map((sensor, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <Sensor
                  id={sensor._id}
                  label={sensor.sensorTypeId.name}
                  severity={sensor.status}
                  minData={sensor.sensorTypeId.minValue}
                  maxData={sensor.sensorTypeId.minValue}
                  currentValue={sensor.sensorData}
                />
              </Grid>
            ))}
            {/* <Grid item xs={12} md={6} lg={4}>
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
            </Grid> */}
          </Grid> : null
        }
        <br></br>
        <MDBox p={2} mt="auto">
          {/* <MDButton
              component="button"
              target="_blank"
              rel="noreferrer"
              variant="gradient"
              color={sidenavColor}
              fullWidth
              onClick={fetchData}
            >
              fetch data
            </MDButton> */}
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
              Malfunction Table
            </MDTypography>
          </MDBox>
          <MDBox pt={3}>
            <DataTable
              table={{ columns: tbl_cols, rows: tbl_rows }}
              isSorted={false}
              entriesPerPage={{ defaultValue: 10, entries: [5, 10, 15, 20, 25] }}
              showTotalEntries={true}
              currentPage={currentPage}
              handlePageChange={handlePageChange}
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
