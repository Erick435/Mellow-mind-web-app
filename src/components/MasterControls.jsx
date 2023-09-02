import React, { useState, useEffect } from "react";
import { FaPlay, FaPause } from "react-icons/fa6";
import { FaFastForward, FaFastBackward } from "react-icons/fa";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";

const MasterControls = ({
  audios,
  prev,
  next,
  mainSongPlaying,
  setMainSongPlaying,
  selectedSound,
  playingSounds,
  setPlayingSounds
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };


  const playSong = () => {
    // Only play the selected audio
    const audioElement = document.querySelector(`audio[src="${selectedSound}"]`);
    if (audioElement) {
        audioElement.play();
    }
    setMainSongPlaying(true);

    // Update the playingSounds array
    if (!playingSounds.includes(selectedSound)) {
        setPlayingSounds([...playingSounds, selectedSound]);
    }
};



const pauseSong = () => {
  const allAudioElements = document.getElementsByTagName("audio");
  for (let i = 0; i < allAudioElements.length; i++) {
      allAudioElements[i].pause();
  }
  setMainSongPlaying(false);
};




  useEffect(() => {
    // Pause music when focus timer ends
    const handleFocusEnd = () => {
        pauseSong();
    };
    // Play music when break timer ends
    const handleBreakEnd = () => {
        playSong();
    };

    window.addEventListener('onFocusEnd', handleFocusEnd);
    window.addEventListener('onBreakEnd', handleBreakEnd);

    return () => {
        window.removeEventListener('onFocusEnd', handleFocusEnd);
        window.removeEventListener('onBreakEnd', handleBreakEnd);
    };
}, []);

  return (
    <>
      <div
        className={`w-[100vw] h-auto fixed flex bottom-10 justify-center ${
          isCollapsed ? "opacity-0 pointer-events-none" : "opacity-100 h-auto"
        } transition-all duration-300`}
      >
        <div className="flex gap-4 justify-around bg-white bg-opacity-50 px-4 rounded-full py-2 items-center">
          <button onClick={prev} className="p-2 bg-white rounded-full">
            <FaFastBackward className=" text-2xl" />
          </button>
          {!mainSongPlaying ? (
            <button onClick={playSong} className="p-3 bg-white rounded-full">
              <FaPlay className=" text-3xl" />
            </button>
          ) : (
            <button onClick={pauseSong} className="p-3 bg-white rounded-full">
              <FaPause className="text-3xl" />
            </button>
          )}

          <button
            onClick={next}
            className="p-2 flex gap-2 bg-white rounded-full"
          >
            <FaFastForward className=" text-2xl" />
          </button>
        </div>
      </div>
      <div className="w-[100vw] fixed flex bottom-0 justify-center">
        <button
          onClick={toggleCollapse}
          className="toggle-controls-btn p-2 bg-white rounded-t-md bg-opacity-50 text-sm"
        >
          {isCollapsed ? <div>Show Controls</div> : <div>Hide</div>}
        </button>
      </div>
    </>
  );
};

export default MasterControls;
