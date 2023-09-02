import React, { useRef, useState, useEffect } from "react";
import { FaPause, FaPlay } from "react-icons/fa6";

const SoundButton = ({ soundSrc, label, isSelected, showSoundboard, id, playingSounds, togglePlayingSound }) => {
  const [localIsPlaying, setLocalIsPlaying] = useState(playingSounds.includes(soundSrc));
  const [actionByUser, setActionByUser] = useState(true);


  const colors = ["#03e9f4", "hue-rotate(110deg)", "hue-rotate(270deg)"];
  const isPlaying = localIsPlaying;

  //This is to give different neon colors to the soundboard buttons
  const buttonStyle = {
    filter: `hue-rotate(${(id * 75) % 360}deg)`
  };

  const audioRef = useRef(null);

  const handleButtonClick = (event) => {
    event.stopPropagation();  // Stop the event from propagating up

    if (localIsPlaying) {
      console.log('Pausing:', soundSrc);  // Log for debugging
      audioRef.current.pause();
    } else {
      console.log('Playing:', soundSrc);  // Log for debugging
      audioRef.current.play();
    }
    togglePlayingSound(soundSrc);
  };





  const handleVolumeChange = (event) => {
    event.stopPropagation();
    audioRef.current.volume = event.target.value;
  };

  useEffect(() => {
    const handleAudioPausedProgrammatically = () => {
      setActionByUser(false);
    };

    window.addEventListener('audioPausedProgrammatically', handleAudioPausedProgrammatically);

    return () => {
      window.removeEventListener('audioPausedProgrammatically', handleAudioPausedProgrammatically);
    };
  }, []);

  useEffect(() => {
    setLocalIsPlaying(playingSounds.includes(soundSrc));
  }, [playingSounds, soundSrc]);


  return (
    <div className={`sound-button ${isSelected || isPlaying ? 'selected' : ''}`}>

      {showSoundboard && (
        <>
          <button style={buttonStyle} className={`round-button ${isSelected ? 'selected' : ''}`} onClick={handleButtonClick}>
            <div>{label}</div>
            <br />
            {isPlaying ? <FaPause className="text-3xl" /> : <FaPlay className=" text-3xl" />}
            {/* Add these spans for the animated borders */}
            <span></span>
            <span></span>
            <span></span>
            <span></span>
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
      <audio
        ref={audioRef}
        src={soundSrc}
        loop
      />

    </div>
  );
};

export default SoundButton;
