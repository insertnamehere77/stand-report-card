import React, { BaseSyntheticEvent, useState } from 'react';
import './App.css';
import { StandStats, generateStats } from './StandStats';
import Chart from './Chart';


interface Stand {
  name: string;
  stats: StandStats;
  imageUrl: string;
}

interface ReportCardProps {
  stand: Stand;
}
function ReportCard(props: ReportCardProps): JSX.Element {
  const { imageUrl, name, stats } = props.stand;
  return (
    <div className='reportCard'>
      <div className='nameAndChart'>
        <div className='nameLabel textShadow'>「STAND NAME」</div>
        <div className='standName textShadow'>{name}</div>
        <Chart stats={stats} />
      </div>
      <img className="standImage filterShadow"
        src={imageUrl}
        alt="The file uploaded by the user depicting their stand" />
    </div>
  );
}



function App(): JSX.Element {
  const [stand, setStand] = useState<Stand>();

  const onChange = (event: BaseSyntheticEvent) => {
    const file = event.target.files[0];
    const url = URL.createObjectURL(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      if (!event.target?.result) {
        return;
      }
      const view = new Uint8Array(event.target.result as ArrayBuffer);
      const newStats = generateStats(view);

      const newStand = {
        name: file.name.replace(/\.[^/.]+$/, ""),
        imageUrl: url,
        stats: newStats
      }
      setStand(newStand);
    }

    reader.readAsArrayBuffer(file);
  }

  return (
    <div className="App">

      {!stand && <input type="file"
        id="avatar" name="avatar"
        accept="image/*"
        onChange={onChange}
      />}
      {stand && <ReportCard stand={stand} />}

    </div>
  );
}

export default App;
