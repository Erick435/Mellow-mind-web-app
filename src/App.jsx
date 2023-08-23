import React, { useState, useEffect } from 'react';
import Soundboard from './components/Soundboard';
import SignIn from './components/googleSignin/SignIn'; //this is correct even if it's highlighting red
import { auth } from './components/googleSignin/config'
import { signOut } from '@firebase/auth';
import './App.css';

function App() {
  //setting up login/registration (firebase)
  const [user, setUsers] = useState(null);
  // const usersRef = collection(db, "users");

  const [isSidebarVisible, setSidebarVisibility] = React.useState(true);
  const [selectedVideo, setSelectedVideo] = React.useState("/path/to/default/video.mp4");  // default video path

  const videoOptions = [
    { label: "Moonlight", path: "/moonlight.mp4" },
    { label: "Sunset", path: "/sunset.mp4" },
    { label: "Resting Fire", path: "/resting-fire.mp4" },
    { label: "Nightsky", path: "/nightsky.mp4" },

    // ... more video paths
  ];

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

  // useEffect(() => {
  //   const getUsers = async() => {
  //     const data = await getDocs(usersRef);
  //     console.log(data);
  //     setUsers(data.docs.map((doc) => ({...doc.data(), id: doc.id})))
  //   }
  //   getUsers()
  // }, [])




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

        {/* Sidebar Toggle Button */}
        <button className={`sidebar-toggle ${isSidebarVisible ? '' : 'hidden'}`} onClick={toggleSidebar}>
          {isSidebarVisible ? '◀' : '▶'}
        </button>


        {/* Video Sidebar */}
        <div className={`sidebar-left ${isSidebarVisible ? '' : 'hidden'}`}>
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
          {user && (
            <div>
              <button onClick={handleLogout} style={{ marginTop: '15px' }}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );

}

export default App;
