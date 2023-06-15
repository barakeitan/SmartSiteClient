
import React, { useEffect, useState } from 'react';
import { Button, Menu, MenuItem } from '@mui/material';
// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDSnackbar from "components/MDSnackbar";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

// Data
import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";

// Dashboard components
import Projects from "layouts/dashboard/components/Projects";
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";
import {
  useMaterialUIController,
  setMiniSidenav,
  setTransparentSidenav,
  setWhiteSidenav,
} from "context";

import { getAllSites, getAllRooms } from '../../services/index';

function Dashboard() {
  const { sales, tasks } = reportsLineChartData;
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentSidenav, whiteSidenav, darkMode, sidenavColor } = controller;
  const [sites, setSites] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedSite, setSelectedSite] = useState('');
  const [errorSB, setErrorSB] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const closeErrorSB = () => setErrorSB(false);

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOptionSelect = (site) => {
    setSelectedSite(site);
    setAnchorEl(null);
  };

  useEffect(() => {
    //change all data in the dashboard according to the specific site selected
  }, [selectedSite]);


  useEffect(() => {
    const fetchSites = async () => {
        getAllSites().then((data) => {
            if (data.error) {
            setErrorMsg(data.error);
            setErrorSB(true);
            } else {
                console.log("siteList data: " + data);
                setSites(data);
            }
        });
    };

    const fetchRooms = async () => {
      getAllRooms().then((data) => {
          if (data.error) {
          setErrorMsg(data.error);
          setErrorSB(true);
          } else {
              console.log("roomList data: " + data);
              setRooms(data);
          }
      });
  };

    fetchSites();
    fetchRooms();
  }, []);


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
                Choose Site
        </MDButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          {sites.map((site, index) => (
            <MenuItem onClick={() => { handleOptionSelect(site); handleClose(); }}>{site.name}</MenuItem>
          ))}
        </Menu>
      </div>
      <br></br>
      {selectedSite && (
        <MDBox py={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={3}>
              <MDBox mb={1.5}>
                <ComplexStatisticsCard
                  color="dark"
                  icon="list"
                  title="Number of Rooms"
                  count={rooms.length}
                  
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <MDBox mb={1.5}>
                <ComplexStatisticsCard
                  icon="speed"
                  title="Most irregular CPU gauge"
                  count="2,300"
                  // percentage={{
                  //   color: "success",
                  //   amount: "+3%",
                  //   label: "than last month",
                  // }}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <MDBox mb={1.5}>
                <ComplexStatisticsCard
                  color="success"
                  icon="store"
                  title="Most irregular Temperator sensor"
                  count="34k"
                  // percentage={{
                  //   color: "success",
                  //   amount: "+1%",
                  //   label: "than yesterday",
                  // }}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <MDBox mb={1.5}>
                <ComplexStatisticsCard
                  color="primary"
                  icon="person_add"
                  title="Most irregular Water sensor"
                  count="+91"
                  // percentage={{
                  //   color: "success",
                  //   amount: "",
                  //   label: "Just updated",
                  // }}
                />
              </MDBox>
            </Grid>
          </Grid>
          <br></br>
          {/* <MDBox mt={4.5}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6} lg={4}>
                <MDBox mb={3}>
                  <ReportsBarChart
                    color="info"
                    title="website views"
                    description="Last Campaign Performance"
                    date="campaign sent 2 days ago"
                    chart={reportsBarChartData}
                  />
                </MDBox>
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <MDBox mb={3}>
                  <ReportsLineChart
                    color="success"
                    title="daily sales"
                    description={
                      <>
                        (<strong>+15%</strong>) increase in today sales.
                      </>
                    }
                    date="updated 4 min ago"
                    chart={sales}
                  />
                </MDBox>
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <MDBox mb={3}>
                  <ReportsLineChart
                    color="dark"
                    title="completed tasks"
                    description="Last Campaign Performance"
                    date="just updated"
                    chart={tasks}
                  />
                </MDBox>
              </Grid>
            </Grid>
          </MDBox> */}
          <MDBox>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6} lg={8}>
                <Projects />
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <OrdersOverview />
              </Grid>
            </Grid>
          </MDBox>
        </MDBox>
      )}
      <MDBox pt={2} px={2}>
            <Grid item xs={12} sm={6} lg={3}>
                {renderErrorSB}
            </Grid>
      </MDBox>
      {/* <Footer /> */}
    </DashboardLayout>
  );
}

export default Dashboard;












// // @mui material components
// import Grid from "@mui/material/Grid";

// // Material Dashboard 2 React components
// import MDBox from "components/MDBox";
// import Card from "@mui/material/Card";
// import MDTypography from "components/MDTypography";
// import DataTable from "examples/Tables/DataTable";

// // Material Dashboard 2 React example components
// import React, { useState, useMemo} from "react";
// import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
// import DashboardNavbar from "examples/Navbars/DashboardNavbar";
// import Gauge from "../gauges/components/gauge";
// import Sensor from "../sensors/components/sensor";

// function Dashboard() {
//   // const [cpu, setCpu] = useState({cpu_data: 70, ts_cpu: ""});
//   // const tbl_cols = useMemo(()=>[{Header:"Sensor", accessor:"ts_cpu"},
//   //                           {Header:"Last data", accessor:"cpu_data"},
//   //                           {Header:"Date", accessor:"ts_disk"},
//   //                           {Header:"Severity", accessor:"disk_data"},
//   //                           {Header:"Description", accessor:"ts_memory"},
//   //                           {Header:"Treated?", accessor:"memory_data"}],[]);
//   // const [tbl_rows, setRows] = useState([{ts_cpu:cpu.ts_cpu, cpu_data:cpu.cpu_data}]);


//   return (
//     <DashboardLayout>
//       <DashboardNavbar />
//       {/* <Grid container spacing={3}>
//           <Grid item xs={12} md={6} lg={4}>
//               <br></br>
//               <br></br>
//               <Gauge
//                 title="CPU Usage"
//                 value={cpu.cpu_data}
//                 value_ts={cpu.ts_cpu}
//               />
//           </Grid>
//           <Grid item xs={12} md={6} lg={4}>
//               <Sensor
//                 title='Temperature'
//                 label='temperature sensore'
//                 severity='2'
//                 minData='-4'
//                 maxData='50'
//                 currentValue='26'
//               />
//           </Grid>
//           <Grid item xs={12} md={6} lg={4}>
//               <Sensor
//                 title='Water'
//                 label='water sensore'
//                 severity='3'
//                 minData='0'
//                 maxData='15'
//                 currentValue='9'
//                 />
//           </Grid>
//       </Grid>
//       <br></br>
//       <br></br>
//       <br></br>
//       <MDBox>
//         <Card>
//           <MDBox
//             mx={2}
//             mt={-3}
//             py={3}
//             px={2}
//             variant="gradient"
//             bgColor="info"
//             borderRadius="lg"
//             coloredShadow="info"
//           >
//             <MDTypography variant="h6" color="white">
//               Recent Melfunctions
//             </MDTypography>
//           </MDBox>
//           <MDBox pt={3}>
//             <DataTable
//               table={{ columns: tbl_cols, rows: tbl_rows }}
//               isSorted={false}
//               entriesPerPage={false}
//               showTotalEntries={false}
//               noEndBorder
//             />
//           </MDBox>
//         </Card>
//       </MDBox> */}



//       <MDBox py={3}>
//         <Grid container spacing={3}>
//           <Grid item xs={12} md={6} lg={3}>
//             <MDBox mb={1.5}>
//               <ComplexStatisticsCard
//                 color="dark"
//                 icon="weekend"
//                 title="Bookings"
//                 count={281}
//                 percentage={{
//                   color: "success",
//                   amount: "+55%",
//                   label: "than lask week",
//                 }}
//               />
//             </MDBox>
//           </Grid>
//           <Grid item xs={12} md={6} lg={3}>
//             <MDBox mb={1.5}>
//               <ComplexStatisticsCard
//                 icon="leaderboard"
//                 title="Today's Users"
//                 count="2,300"
//                 percentage={{
//                   color: "success",
//                   amount: "+3%",
//                   label: "than last month",
//                 }}
//               />
//             </MDBox>
//           </Grid>
//           <Grid item xs={12} md={6} lg={3}>
//             <MDBox mb={1.5}>
//               <ComplexStatisticsCard
//                 color="success"
//                 icon="store"
//                 title="Revenue"
//                 count="34k"
//                 percentage={{
//                   color: "success",
//                   amount: "+1%",
//                   label: "than yesterday",
//                 }}
//               />
//             </MDBox>
//           </Grid>
//           <Grid item xs={12} md={6} lg={3}>
//             <MDBox mb={1.5}>
//               <ComplexStatisticsCard
//                 color="primary"
//                 icon="person_add"
//                 title="Followers"
//                 count="+91"
//                 percentage={{
//                   color: "success",
//                   amount: "",
//                   label: "Just updated",
//                 }}
//               />
//             </MDBox>
//           </Grid>
//         </Grid>
//         <MDBox mt={4.5}>
//           <Grid container spacing={3}>
//             <Grid item xs={12} md={6} lg={4}>
//               <MDBox mb={3}>
//                 <ReportsBarChart
//                   color="info"
//                   title="website views"
//                   description="Last Campaign Performance"
//                   date="campaign sent 2 days ago"
//                   chart={reportsBarChartData}
//                 />
//               </MDBox>
//             </Grid>
//             <Grid item xs={12} md={6} lg={4}>
//               <MDBox mb={3}>
//                 <ReportsLineChart
//                   color="success"
//                   title="daily sales"
//                   description={
//                     <>
//                       (<strong>+15%</strong>) increase in today sales.
//                     </>
//                   }
//                   date="updated 4 min ago"
//                   chart={sales}
//                 />
//               </MDBox>
//             </Grid>
//             <Grid item xs={12} md={6} lg={4}>
//               <MDBox mb={3}>
//                 <ReportsLineChart
//                   color="dark"
//                   title="completed tasks"
//                   description="Last Campaign Performance"
//                   date="just updated"
//                   chart={tasks}
//                 />
//               </MDBox>
//             </Grid>
//           </Grid>
//         </MDBox>
//         <MDBox>
//           <Grid container spacing={3}>
//             <Grid item xs={12} md={6} lg={8}>
//               <Projects />
//             </Grid>
//             <Grid item xs={12} md={6} lg={4}>
//               <OrdersOverview />
//             </Grid>
//           </Grid>
//         </MDBox>
//       </MDBox>
//       {/* <Footer /> */}
//     </DashboardLayout>
//   );
// }

// export default Dashboard;
