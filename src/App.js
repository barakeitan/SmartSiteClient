import React, { useState } from "react";
import { RadialGauge } from "react-canvas-gauges";

function App() {

  const [response, setResponse] = useState(null);
  const [cpu, setCpu] = useState(70);
  const [disk, setDisk] = useState(75);
  const [memory, setMemory] = useState(22);

  const fetchData = async () => {
    const response = await fetch("http://localhost:8001");
    const data = await response.json();
    setResponse(data);
    console.log(data);
    setCpu({cpu_data: data.cpu, ts_cpu: data.ts_cpu});
    setDisk({disk_data: data.disk, ts_disk: data.ts_disk});
    setMemory({memory_data: data.memory, ts_memory: data.ts_memory});
  };

  return (
    <div>
      <button onClick={fetchData}>Fetch Data</button>
      <div className="container">

      <div className="gauge" style={{"display": "flex", "flex-direction": "column", "align-items": "center"}}>
        <RadialGauge
          style={{"width": "50px !important",
            "height": "50px !important"}}
          units="%"
          title="CPU Usage"
          value={cpu.cpu_data}
          minValue={0}
          maxValue={100}
          animationDuration={1.5}
          animationRule="linear"
          colorPlate="#fff"
          colorMajorTicks="#000"
          fontValue="Arial"
          needleWidth={2}
        />
        <br/>
        <div>{cpu.ts_cpu}</div>
        <br/>
      </div>

      <div className="gauge" style={{"display": "flex", "flex-direction": "column", "align-items": "center"}}>
        <RadialGauge
          units="%"
          title="Disk Utilization"
          value={disk.disk_data}
          minValue={0}
          maxValue={100}
          animationDuration={1.5}
          animationRule="linear"
          colorPlate="#fff"
          colorMajorTicks="#000"
          fontValue="Arial"
          needleWidth={2}
        />
        <br/>
        <div>{disk.ts_disk}</div>
        <br/>
      </div>

      <div className="gauge" style={{"display": "flex", "flex-direction": "column", "align-items": "center"}}>
        <RadialGauge
          units="%"
          title="RAM Memory"
          value={memory.memory_data}
          minValue={0}
          maxValue={100}
          animationDuration={1.5}
          animationRule="linear"
          colorPlate="#fff"
          colorMajorTicks="#000"
          fontValue="Arial"
          needleWidth={2}
        />
        <br/>
        <div>{memory.ts_memory}</div>
        <br/>
      </div>
      </div>
    </div>
  );
}

export default App;
