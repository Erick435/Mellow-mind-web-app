import React from "react";
import SoundButton from "./SoundButton";
import Timer from "./Timer";
import LiveTimer from "./LiveTimer";
import Modal from 'react-modal'
import { FaGear } from 'react-icons/fa6'

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

Modal.setAppElement('#root');

const Soundboard = () => {
    const [selectedSound, setSelectedSound] = React.useState(soundData[0].soundSrc); // Default to the first sound
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [focusTime, setFocusTime] = React.useState(25); // default 25 mins
    const [breakTime, setBreakTime] = React.useState(5); 

    
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

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };
    
    
    return (
        <div className="soundboard-container">
            <div className="soundboard">
                    <div className="clock-section">
                        <LiveTimer />
                    </div>
                <button onClick={openModal} className="settings-btn"><FaGear color='white' size='3em'/></button>

                <Modal
                    isOpen={isModalOpen}
                    onRequestClose={closeModal}
                    contentLabel="Settings Modal"
                    className="settings-modal"
                    overlayClassName="settings-modal-overlay"
                >
                    <h2>Settings</h2>

                    <div className="settings-form">
                        <label>
                            Focus (mins):
                            <input 
                                type="number" 
                                value={focusTime} 
                                onChange={e => setFocusTime(Math.max(0, e.target.value))} // Ensure non-negative values
                            />
                        </label>
                        <label>
                            Break (mins):
                            <input 
                                type="number" 
                                value={breakTime} 
                                onChange={e => setBreakTime(Math.max(0, e.target.value))} // Ensure non-negative values
                            />
                        </label>
                    </div>
                    

                    <button onClick={closeModal}>Close</button>
                </Modal>
                {/* Soundboard Content: Timer, Selected Songs, Sound Buttons */}
                <div className="soundboard-content">

                    {/* Timer Section */}
                    <div className="timer-section">
                        <Timer 
                            onPause={handleAudioPause} 
                            onRestStart={handleAudioPause} 
                            focusTime={focusTime}
                            breakTime={breakTime}
                        />
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

                    {/* Sound Buttons Section */}
                    <div className="sound-buttons-section">
                        <div className="sound-buttons">
                            <SoundButton soundSrc={selectedSound} label="Selected Sound" />
                            {soundData.slice(3).map((sound) => (
                                <SoundButton key={sound.id} soundSrc={sound.soundSrc} label={sound.label} />
                            ))}
                        </div>
                    </div>

                </div>

                {/* Master Pause Button */}
                <button className="master-pause" onClick={handleMasterPause}>
                <b>| |    </b>
                
                </button>
            </div>
        </div>
    );
};


export default Soundboard;
