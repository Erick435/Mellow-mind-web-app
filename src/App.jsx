import React from 'react';
import Soundboard from './components/Soundboard';
import './App.css';

function App() {
  const [isSidebarVisible, setSidebarVisibility] = React.useState(true);

  const [selectedVideo, setSelectedVideo] = React.useState("/path/to/default/video.mp4");  // default video path

  const videoOptions = [
    { label: "Moonlight", path: "/moonlight.mp4" },
    { label: "Sunset", path: "/sunset.mp4" },
    { label: "Resting Fire", path: "/resting-fire.mp4" },
    { label: "Nightsky", path: "/nightsky.mp4" },
    
    // ... more video paths
  ];

  const toggleSidebar = () => {
    setSidebarVisibility(!isSidebarVisible);
  };

  return (
    // Background Video
    <>
      <div style={{ width: "100%", height: "100vh", position: "absolute", top: 0, left: 0, zIndex: -1 }}>
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

 {/* Sidebar Toggle Button */}
<button className={`sidebar-toggle ${isSidebarVisible ? '' : 'hidden'}`} onClick={toggleSidebar}>
          {isSidebarVisible ? '◀' : '▶'}
        </button>


        {/* Video Sidebar */}
        <div className={`sidebar-left ${isSidebarVisible ? '' : 'hidden'}`}>
          <i className='video-option-head'>Backgrounds<br />-</i>
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
