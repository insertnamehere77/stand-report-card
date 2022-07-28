import React, { BaseSyntheticEvent, useCallback, useRef, useState } from 'react';
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
  resetStand(): void;
}
function ReportCard(props: ReportCardProps): JSX.Element {
  const { imageUrl, name, stats } = props.stand;
  return (
    <>
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
      <button onClick={props.resetStand}>
        Start Over
      </button>
    </>
  );
}


interface UploadBoxProps {
  setStand(newStand: Stand): void;
  stand: Stand | undefined;
}

function UploadBox(props: UploadBoxProps): JSX.Element {
  const inputRef = useRef() as React.MutableRefObject<HTMLInputElement>;

  const handleFile = (file: File) => {

    if (props.stand) {
      URL.revokeObjectURL(props.stand.imageUrl);
    }

    const url = URL.createObjectURL(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      if (!event.target?.result) {
        return;
      }
      const view = new Uint8Array(event.target.result as ArrayBuffer);
      const newStats = generateStats(view);

      const newStand = {
        name: file.name.replace(/\.[^/.]+$/, "").toUpperCase(),
        imageUrl: url,
        stats: newStats
      }
      props.setStand(newStand);
    }

    reader.readAsArrayBuffer(file);
  }

  const triggerUpload = () => {
    if (!inputRef.current) {
      console.error("No input ref, did it render?");
      return;
    }
    inputRef.current.click();
  }

  const onUpload = (event: BaseSyntheticEvent) => {
    event.stopPropagation();
    event.preventDefault();
    const file = event.target.files[0];
    handleFile(file);
  }

  const onDrop = (event: BaseSyntheticEvent) => {
    event.stopPropagation();
    event.preventDefault();
    const file = (event.nativeEvent as any).dataTransfer.files[0];
    handleFile(file);
  }

  const doNothing = (event: BaseSyntheticEvent) => {
    event.stopPropagation();
    event.preventDefault();
  }


  return (
    <div className='tarotCardBorder filterShadow'>
      <input type="file"
        accept="image/*"
        style={{ display: 'none' }}
        ref={inputRef}
        onChange={onUpload}
      />
      <div className="uploadZone"
        onClick={triggerUpload}
        onDrop={onDrop}
        onDragOver={doNothing}
        onDragEnter={doNothing}
        onDragLeave={doNothing}>
        Upload or drag an image to begin
      </div>
    </div>);
}


interface UploadPreviewProps {
  setStand: Function;
  stand: Stand;
}


function UploadPreview(props: UploadPreviewProps): JSX.Element {
  const { imageUrl, name } = props.stand;

  const onNameChange = (event: BaseSyntheticEvent) => {
    const name = event.target.value as string;
    props.setStand((currStand: any) => ({ ...currStand, name }));
  };

  return (<div className='tarotCardBorder filterShadow'>
    <img className="standPreviewImage"
      src={imageUrl}
      alt="The file uploaded by the user depicting their stand" />
    <input className="previewNameInput filterShadow" type="text" value={name} onChange={onNameChange} />
  </div>)
}


interface UploadFormProps {
  uploadStand(newStand: Stand): void;
}

function UploadForm(props: UploadFormProps): JSX.Element {
  const [stand, setStand] = useState<Stand>();



  return (<>
    {
      stand ?
        <>
          <UploadPreview setStand={setStand} stand={stand} />
          <button onClick={() => props.uploadStand(stand)}>
            Start Grading
          </button>
        </> :
        <UploadBox setStand={setStand} stand={stand} />
    }
  </>);
}

function LoadingIndicator() {
  return <div className='tarotCardBorder filterShadow loadingIndicator'>
    LOADING...
  </div>
}


function generateRandomNumber(min: number, max: number): number {
  const range = max - min;
  return (Math.random() * range) + min;
}


function App(): JSX.Element {
  const [stand, setStand] = useState<Stand>();
  const [isGrading, setIsGrading] = useState<boolean>();

  const uploadStand = useCallback((newStand: Stand) => {
    setIsGrading(true);
    const displayStand = () => {
      setStand(newStand);
      setIsGrading(false);
    }
    setTimeout(displayStand, generateRandomNumber(1000, 3000));
  }, []);

  const resetStand = useCallback(() => {
    setIsGrading(false);
    setStand(undefined);
  }, []);

  return (
    <div className="App">

      {!stand && !isGrading && <UploadForm uploadStand={uploadStand} />}
      {isGrading && <LoadingIndicator />}
      {stand && <ReportCard stand={stand} resetStand={resetStand} />}

    </div>
  );
}

export default App;
