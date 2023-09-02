import React, { useEffect, useState } from "react";
import SoundButton from "./SoundButton";
import Timer from "./Timer";
import LiveTimer from "./LiveTimer";
import Modal from "react-modal";
import { FaGear } from "react-icons/fa6";
import MasterControls from "./MasterControls";
import { createPortal } from "react-dom";


const soundData = [
    //Get music background
    { id: 1, soundSrc: "/Crescent-Moon.mp3", label: "Midnight Vibe" },
    { id: 2, soundSrc: "/Next-door.mp3", label: "Jam Session" },
    { id: 3, soundSrc: "/Jazz.mp3", label: "Jazz" },
    //Get Background ambience
    { id: 4, soundSrc: "/forest.mp3", label: "Forest" },
    { id: 5, soundSrc: "/walking-on-water.mp3", label: "Beach" },
    { id: 6, soundSrc: "/cafe.mp3", label: "Cafe" },

    //Get sound effects
    { id: 7, soundSrc: "/fireplace.mp3", label: "Fireplace" },
    { id: 8, soundSrc: "/Rain.mp3", label: "Raining" },
    { id: 9, soundSrc: "/chatter.mp3", label: "Chatter" },

    // Add more sound data objects as needed
];

Modal.setAppElement("#root");

const Soundboard = () => {

    const [selectedSoundIndex, setSelectedSoundIndex] = React.useState(0);
    const [selectedSound, setSelectedSound] = React.useState(soundData[selectedSoundIndex].soundSrc);
    const [mainSongPlaying, setMainSongPlaying] = useState(false);
    const [showSoundboard, setShowSoundboard] = React.useState(false);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [focusTime, setFocusTime] = React.useState(25); // default 25 mins
    const [breakTime, setBreakTime] = React.useState(5);
    const [isMainTimer, setIsMainTimer] = useState(true);
    const [playingSounds, setPlayingSounds] = useState([soundData[0].soundSrc]); // The first sound is playing by default



    const selectedSoundSources = soundData.slice(0, 3).map((sound) => sound.soundSrc); // Extract the sources of the selected songs

    const handleMasterPause = () => {
        const audioElements = document.getElementsByTagName("audio");
        for (let i = 0; i < audioElements.length; i++) {
            if (!audioElements[i].paused && selectedSoundSources.includes(audioElements[i].getAttribute('src'))) {
                audioElements[i].pause();
            }
        }
        const event = new Event('audioPausedProgrammatically');
        window.dispatchEvent(event);
    };


    // Function to add or remove a sound from the playingSounds array
    const togglePlayingSound = (soundSrc) => {
        setPlayingSounds((prevPlayingSounds) => {
            if (prevPlayingSounds.includes(soundSrc)) {
                console.log("Removing:", soundSrc);  // Log for debugging
                return prevPlayingSounds.filter((src) => src !== soundSrc);
            } else {
                console.log("Adding:", soundSrc);  // Log for debugging
                return [...prevPlayingSounds, soundSrc];
            }
        });
    };


    const toggleSoundboard = () => {
        setShowSoundboard(!showSoundboard);
    };

    useEffect(() => {
        setSelectedSound(soundData[selectedSoundIndex].soundSrc);
        const audioElement = document.querySelector(`audio[src="${soundData[selectedSoundIndex].soundSrc}"]`);
        if (audioElement) {
            audioElement.play();
        }
        setMainSongPlaying(true);
        // Reset playingSounds state when main song changes
        setPlayingSounds([soundData[selectedSoundIndex].soundSrc]);
    
    }, [selectedSoundIndex]);
    


    useEffect(() => {
        if (!mainSongPlaying) {
            setPlayingSounds([]);
        }
    }, [mainSongPlaying]);


    useEffect(() => {
        const handlePauseMusic = () => {
            handleAudioPause(true);  // force pause
        };

        const handlePlayMusic = () => {
            handleAudioResume();
        };

        window.addEventListener('pauseMusic', handlePauseMusic);
        window.addEventListener('playMusic', handlePlayMusic);

        return () => {
            window.removeEventListener('pauseMusic', handlePauseMusic);
            window.removeEventListener('playMusic', handlePlayMusic);
        };
    }, []);


    const handleAudioPause = (forcePause = false) => {
        if (!forcePause && !isMainTimer) return;

        const audioElements = document.getElementsByTagName("audio");
        for (let i = 0; i < audioElements.length; i++) {
            if (!audioElements[i].paused) {
                fadeOut(audioElements[i], 2000);
            }
        }
        setMainSongPlaying(false);
    };


    const handleAudioResume = () => {
        const audioElements = document.getElementsByTagName("audio");
        for (let i = 0; i < audioElements.length; i++) {
            fadeIn(audioElements[i], 2000);
        }
        setMainSongPlaying(true);
    };

    function fadeOut(audio, duration) {
        const startVolume = audio.volume;
        const startTime = Date.now();

        const fade = () => {
            const elapsed = Date.now() - startTime;
            if (elapsed < duration) {
                audio.volume = startVolume * (1 - elapsed / duration);
                requestAnimationFrame(fade);
            } else {
                audio.volume = 0;
            }
        };

        fade();
    }


    function fadeIn(audio, duration) {
        const startVolume = 0;
        const targetVolume = 0.2;
        const startTime = Date.now();

        const fade = () => {
            const elapsed = Date.now() - startTime;
            if (elapsed < duration) {
                audio.volume = startVolume + targetVolume * (elapsed / duration);
                requestAnimationFrame(fade);
            } else {
                audio.volume = targetVolume;
            }
        };

        fade();
    }

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    // ------ MASTER CONTROLS SWITCHING ONLY THE SONG AUDIO (NOT SOUND) ---------------

    const selectedSounds = ["Midnight-Vibe", "Jam Session Next Door", "Jazz"];

    const pauseAllAudiosExceptSelected = (selectedAudio) => {
        const audioElements = document.getElementsByTagName("audio");
        for (let i = 0; i < audioElements.length; i++) {
            if (audioElements[i] !== selectedAudio) {
                audioElements[i].pause();
            }
        }
    };

    const prev = () => {
        handleMasterPause();
        setSelectedSoundIndex((prevIndex) =>
            prevIndex !== 0 ? prevIndex - 1 : selectedSounds.length - 1
        );
        const audioElement = document.querySelector(`audio[src="${selectedSound}"]`);
        pauseAllAudiosExceptSelected(audioElement);
    };

    const next = () => {
        handleMasterPause();
        setSelectedSoundIndex((prevIndex) =>
            (prevIndex + 1) % selectedSounds.length
        );
        const audioElement = document.querySelector(`audio[src="${selectedSound}"]`);
        pauseAllAudiosExceptSelected(audioElement);
    };



    return (
        <div className="soundboard-container">
            <div className="soundboard">
                <div className="clock-section">
                    <LiveTimer />
                </div>
                <button onClick={openModal} className="settings-btn">
                    <FaGear color="white" size="3em" />
                </button>

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
                                onChange={(e) => setFocusTime(Math.max(0, e.target.value))} // Ensure non-negative values
                            />
                        </label>
                        <label>
                            Break (mins):
                            <input
                                type="number"
                                value={breakTime}
                                onChange={(e) => setBreakTime(Math.max(0, e.target.value))} // Ensure non-negative values
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
                            onResume={handleAudioResume}
                            onRestStart={() => handleAudioPause(true)} // Force pausing when the main "Focus" timer ends
                            focusTime={focusTime}
                            breakTime={breakTime}
                            showSoundboard={showSoundboard}
                        />
                    </div>

                    {/* Toggle Soundboard Button */}
                    <button className="toggle-soundboard" onClick={toggleSoundboard}>
                        <div className="toggle-soundboard-button">
                            {showSoundboard ? <div className="text-4xl mb-2">▼</div> : <div className="text-4xl mb-2">▲</div>}
                        </div>
                    </button>


                    {/* Sound Buttons Section */}
                    <div className="sound-buttons-section">
                        <div className="sound-buttons">
                            {soundData.map((sound) => (
                                <SoundButton key={sound.id}
                                    soundSrc={sound.soundSrc}
                                    label={sound.label}
                                    isSelected={selectedSound === sound.soundSrc}
                                    showSoundboard={showSoundboard}
                                    id={sound.id}
                                    playingSounds={playingSounds}
                                    isPlaying={playingSounds.includes(sound.soundSrc)} // Change this line
                                    togglePlayingSound={togglePlayingSound} // Change this line
                                />
                            ))}

                        </div>
                    </div>


                </div>
                {createPortal(
                    <MasterControls
                        next={next}
                        prev={prev}
                        audios={document.getElementsByTagName("audio")}
                        mainSongPlaying={mainSongPlaying}
                        setMainSongPlaying={setMainSongPlaying}
                        selectedSound={selectedSound}
                        playingSounds={playingSounds}
                        setPlayingSounds={setPlayingSounds}
                    />,
                    document.body
                )}
            </div>
        </div>
    );
};

export default Soundboard;