import React, { useState, useEffect } from 'react';
import Soundboard from './components/Soundboard';
import SignIn from './components/googleSignin/SignIn'; //this is correct even if it's highlighting red
import { auth } from './components/googleSignin/config'
import { signOut } from '@firebase/auth';
import './App.css';
import TodoList from './components/todolist';
import Footer from './components/footer';



function App() {
  //setting up login/registration (firebase)
  const [user, setUsers] = useState(null);
  const [isSidebarVisible, setSidebarVisibility] = React.useState(true);
  const [selectedVideo, setSelectedVideo] = React.useState("/nightsky.mp4");  // default video path
  const [selectedTask, setSelectedTask] = useState(null);
  const [isFocusVisible, setFocusVisibility] = useState(false);


  const videoOptions = [
    { label: "Moonlight", path: "/moonlight.mp4" },
    { label: "Sunset", path: "/sunset.mp4" },
    { label: "Resting Fire", path: "/resting-fire.mp4" },
    { label: "Nightsky", path: "/nightsky.mp4" },
    // ... more video paths
  ];

  // ---------- FOCUS TASK TOGGLE VISIBILTY ---------------
  const handleTaskSelect = (task) => {
    setSelectedTask(task);
    if (task) {
      setFocusVisibility(true);// Show the focus-task-container when a task is selected
    }
    else {
      setFocusVisibility(false); // Hide the focus-task-container when no task is selected
    }
  };

  const toggleFocusVisibility = () => {
    setFocusVisibility(!isFocusVisible)
  }

  //========== GOOGLE FIREBASE =================================== 
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((userAuth) => {
      setUsers(userAuth);
    });
    //Cleanup listener on component unmount
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    }
  }, []);

  const toggleSidebar = () => {
    setSidebarVisibility(!isSidebarVisible);
  };

  //=============== HANDLING LOGIN AND LOGOUT FUNCTIONS FOR FIREBASE =========
  const handleLogin = (loggedInUser) => {
    setUsers(loggedInUser);
  };
  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
    signOut(auth)
      .then(() => {
        setUsers(null);  // reset the user state
      })
      .catch((error) => {
        console.error("Error Signing out ", error);
      })
  }

  if (!user) {
    return <SignIn handleLogin={handleLogin} />;
  }

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

        {/* ----------------- SIDE BAR --------------------- */}
        
        {/* Sidebar Toggle Button */}
        <button className={`sidebar-toggle ${!isSidebarVisible ? '' : 'hidden-bar'}`} onClick={toggleSidebar}>
          {isSidebarVisible ? '▶' : '◀'}
        </button>

        {/* Show Focus Task Container */}
        {isFocusVisible && (
          <div className='focus-task-container'>
            {selectedTask !== null ? selectedTask.text : <span style={{color: 'red', fontFamily:'aquatico'}}>Please select a focus task</span>}
          </div>
          )}

        {/* Video Sidebar */}
        <div className={`sidebar-left ${!isSidebarVisible ? '' : 'hidden-bar'}`}>
        <TodoList onTaskSelect={handleTaskSelect} />
        <div className="logo-container">
          <img src="/logo-trsprnt.png" alt="MellowMind Logo" />
          <h1 className="logo-text">MellowMind</h1>
        </div>

          <div>
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

          {/* --------------- TOGGLE FOCUS SIDEBAR TASKS/TODO -------------- */}

          {/* Toggle button for Focus task */}
          <div className='focus-sidebar-container'>
            <button className='toggle-focus-button' onClick={toggleFocusVisibility}>Toggle Focus Task</button>
          </div>


          {/* -------------- LOGOUT CONTAINER ------------------- */}
          {user && (
            <div className="logout-link-container" >
              <div className="logout-link" onClick={handleLogout}>
                Logout
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer formLink="https://docs.google.com/forms/d/e/1FAIpQLSeIYT5s7ct0A3Zyhfs4RQTXnhG0qF-AfqMrrnSfqw3i4gpRYQ/viewform?usp=sf_link" />
    </>
  );
}
export default App;