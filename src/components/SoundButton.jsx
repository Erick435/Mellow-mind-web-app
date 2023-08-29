import React, { useState, useRef, useEffect } from "react";

const SoundButton = ({ soundSrc, label, showSoundboard}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const[mainSongPlaying, setMainSongPlaying] = useState(false);

  const audioRef = useRef(null);

  const handleButtonClick = () => {
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      if (mainSongPlaying) {
        setMainSongPlaying(false);
      }
    } else {
      audioRef.current.play();
      setIsPlaying(true);
      if (!mainSongPlaying) {
        setMainSongPlaying(true);
      }
    }
  };
  

  const handleVolumeChange = (event) => {
    event.stopPropagation();
    audioRef.current.volume = event.target.value;
  };

  return (
    <div className="sound-button">
      {showSoundboard && (
        <>
          <button className="round-button" onClick={handleButtonClick}>
            <div>{label}</div>
            <br />
            {isPlaying ? "| |" : "▶"}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            defaultValue="0.5"
            onChange={handleVolumeChange}
          />
        </>
      )}
      <audio ref={audioRef} src={soundSrc} loop />
    </div>
  );
};

export default SoundButton;
