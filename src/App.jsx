import React from 'react';
import Soundboard from './components/Soundboard';
import './App.css';

function App() {

  const [selectedVideo, setSelectedVideo] = React.useState("/path/to/default/video.mp4");  // default video path

  const videoOptions = [
    { label: "Moonlight", path: "/moonlight.mp4" },
    { label: "Sunset", path: "/sunset.mp4" },
    { label: "Resting Fire", path: "/resting-fire.mp4" },
    { label: "Nightsky", path: "/nightsky.mp4" },
    // ... more video paths
  ];


  return (
    // Background Video
    <>
      <div style={{ width: "100vw", height: "100vh", position: "absolute", top: 0, left: 0, zIndex: -1 }}>
        <video
          src={selectedVideo}
          width="100%"
          height="100%"
          style={{ position: "absolute", top: 0, left: 0, objectFit: "cover", pointerEvents: "none" }}
          autoPlay
          muted
          loop
        ></video>
      </div>
      
      <div className="App" style={{ position: 'relative', zIndex: 0 }}>
        <Soundboard />

        {/* Video Sidebar */}
        <div className="sidebar">
            {videoOptions.map(video => (
                <div
                    key={video.path}
                    className="video-option"
                    onClick={() => setSelectedVideo(video.path)}
                >
                    {video.label}
                </div>
            ))}
        </div>
    </div>
      </>
  );

}

export default App;
