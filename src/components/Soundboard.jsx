import React from "react";
import SoundButton from "./SoundButton";
import Timer from "./Timer";

const soundData = [
    //Get music background
    { id: 1, soundSrc: '/Crescent-Moon.mp3', label: "Midnight-Vibe" },
    { id: 2, soundSrc: '/Next-door.mp3', label: "Jam Session Next Door" },
    { id: 3, soundSrc: '/Jazz.mp3', label: "Jazz" },
    //Get Background ambience
    { id: 4, soundSrc: '/forest.mp3', label: "In The Forest" },
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

    const handleMasterPause = () => {
        const audioElements = document.getElementsByTagName('audio');
        for (let i = 0; i < audioElements.length; i++) {
            if (!audioElements[i].paused) {
                audioElements[i].pause();
            }
        }
    };

    const handleDropdownChange = (event) => {
        const selectedAudio = soundData.find(sound => sound.soundSrc === event.target.value);
        setSelectedSound(selectedAudio.soundSrc);
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
    
    // const handleAudioResume = () => {
    //     const audioElements = document.getElementsByTagName('audio');
    //     // Convert the HTMLCollection to an actual array
    //     const audioArray = Array.from(audioElements);
    //     audioArray.forEach(audio => {
    //         // audio.play();
    //         let event = new Event('audioResumed'); 
    //         audio.dispatchEvent(event);
    //     });
    // };
    
    
    
    
    return (
        <div className="soundboard-container">
            <div className="soundboard">
                <h1>Mellow Mind</h1>
                <Timer onPause={handleAudioPause} onRestStart={handleAudioPause} 
                // onResume={handleAudioResume} 
                />
                <select className="sound-select" value={selectedSound} onChange={handleDropdownChange}>
                    {soundData.slice(0, 3).map((sound) => (
                        <option key={sound.id} value={sound.soundSrc}>
                            {sound.label}
                        </option>
                    ))}
                </select>
                <div className="sound-buttons">
                    <SoundButton soundSrc={selectedSound} label="Selected Sound" />
                    {soundData.slice(3).map((sound) => (
                        <SoundButton key={sound.id} soundSrc={sound.soundSrc} label={sound.label} />
                    ))}
                </div>
                <button className="master-pause" onClick={handleMasterPause}>
                    Pause All
                </button>
            </div>
        </div>
    );
};

export default Soundboard;
