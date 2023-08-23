import React from "react";
import SoundButton from "./SoundButton";
import Timer from "./Timer";

const soundData = [
    //Get music background
    { id: 1, soundSrc: '/Crescent-Moon.mp3', label: "Midnight-Vibe" },
    { id: 2, soundSrc: '/Next-door.mp3', label: "Jam Session Next Door" },
    { id: 3, soundSrc: '/Jazz.mp3', label: "Jazz" },
    //Get Background ambience
    { id: 4, soundSrc: '/forest.mp3', label: "Forest" },
    { id: 5, soundSrc: '/walking-on-water.mp3', label: "Beach" },
    { id: 6, soundSrc: '/cafe.mp3', label: "Cafe" },

    //Get sound effects
    { id: 7, soundSrc: '/fireplace.mp3', label: "Fireplace" },
    { id: 8, soundSrc: '/Rain.mp3', label: "Raining" },
    { id: 9, soundSrc: '/chatter.mp3', label: "Chatter" },


    // Add more sound data objects as needed
];

const Soundboard = () => {
    const [selectedSound, setSelectedSound] = React.useState(soundData[0].soundSrc); // Default to the first sound
    const [showSoundboard, setShowSoundboard] = React.useState(false);


    const handleMasterPause = () => {
        const audioElements = document.getElementsByTagName('audio');
        for (let i = 0; i < audioElements.length; i++) {
            if (!audioElements[i].paused) {
                audioElements[i].pause();
            }
        }
    };

    const handleAudioPause = () => {
        const audioElements = document.getElementsByTagName('audio');
        for (let i = 0; i < audioElements.length; i++) {
            if (!audioElements[i].paused) {
                audioElements[i].pause();
            }
        }
        for (let i = 0; i < audioElements.length; i++) {
            let event = new Event('audioPaused');
            audioElements[i].dispatchEvent(event);
        }
    };
    
    const toggleSoundboard = () => {
        setShowSoundboard(!showSoundboard);
    };
    
    
    
    
    return (
        <div className="soundboard-container">
            <div className="soundboard">
                <h1>Mellow Mind</h1>
                
                {/* Soundboard Content: Timer, Selected Songs, Sound Buttons */}
                <div className="soundboard-content">

                    {/* Timer Section */}
                    <div className="timer-section">
                        <Timer onPause={handleAudioPause} onRestStart={handleAudioPause} />
                    </div>

                    {/* Selected Songs Section */}
                    <div className="selected-songs-section">
                        <div className="selected-songs">
                            {soundData.slice(0, 3).map((sound) => (
                                <a
                                    key={sound.id}
                                    href="#"
                                    className={selectedSound === sound.soundSrc ? 'active' : ''}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setSelectedSound(sound.soundSrc);
                                    }}
                                >
                                    {sound.label}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Toggle Soundboard Button */}
                    <button className="toggle-soundboard" onClick={toggleSoundboard}>
                        {showSoundboard ? 'Hide Soundboard' : 'Show Soundboard'}
                    </button>


                    {/* Sound Buttons Section */}
                    {showSoundboard && (
                        <div className="sound-buttons-section">
                            <div className="sound-buttons">
                                <SoundButton soundSrc={selectedSound} label="Selected Sound" />
                                {soundData.slice(3).map((sound) => (
                                    <SoundButton key={sound.id} soundSrc={sound.soundSrc} label={sound.label} />
                                ))}
                            </div>
                        </div>
                    )}


                </div>

                {/* Master Pause Button */}
                <button className="master-pause" onClick={handleMasterPause}>
                    Pause All
                </button>
            </div>
        </div>
    );
};


export default Soundboard;
