import React, { BaseSyntheticEvent, useState } from 'react';
import './App.css';
import { StandStats, generateStats } from './StandStats';
import Chart from './Chart';

function App() {
  const [imgUrl, setImgUrl] = useState<string>();
  const [stats, setStats] = useState<StandStats>();
  const [standName, setStandName] = useState<string>();

  const onChange = (event: BaseSyntheticEvent) => {
    const url = URL.createObjectURL(event.target.files[0]);
    setImgUrl(url);

    const reader = new FileReader();
    reader.onload = (event) => {
      if (!event.target?.result) {
        return;
      }
      const view = new Uint8Array(event.target.result as ArrayBuffer);
      const newStats = generateStats(view);
      setStats(newStats);
    }
    const file = event.target.files[0];
    setStandName(file.name.replace(/\.[^/.]+$/, ""));
    reader.readAsArrayBuffer(file);
  }

  return (
    <div className="App">
      {imgUrl && <img src={imgUrl} alt="The file uploaded by the user depicting their stand" />}
      <input type="file"
        id="avatar" name="avatar"
        accept="image/png, image/jpeg"
        onChange={onChange}
      />
      <br />
      <br />
      <br />
      {standName && `「${standName}」`}

      <Chart stats={stats} />

    </div>
  );
}

export default App;
