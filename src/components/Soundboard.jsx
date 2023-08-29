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
    { id: 1, soundSrc: "/Crescent-Moon.mp3", label: "Midnight-Vibe" },
    { id: 2, soundSrc: "/Next-door.mp3", label: "Jam Session Next Door" },
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

    const [selectedSound, setSelectedSound] = React.useState(soundData[0].soundSrc); // Default to the first sound
    const [selectedSoundIndex, setSelectedSoundIndex] = React.useState(0); // Default to the first sound index
    const [mainSongPlaying, setMainSongPlaying] = useState(false);
    const [showSoundboard, setShowSoundboard] = React.useState(false);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [focusTime, setFocusTime] = React.useState(25); // default 25 mins
    const [breakTime, setBreakTime] = React.useState(5);

    const handleMasterPause = () => {
        const audioElements = document.getElementsByTagName("audio");
        for (let i = 0; i < audioElements.length; i++) {
            if (!audioElements[i].paused) {
                audioElements[i].pause();
            }
        }
    };


    const toggleSoundboard = () => {
        setShowSoundboard(!showSoundboard);
    };

    useEffect(() => {
        setSelectedSound(soundData[selectedSoundIndex].soundSrc);
        setMainSongPlaying(false);
    }, [selectedSoundIndex]);


    const handleAudioPause = () => {
        const audioElements = document.getElementsByTagName("audio");
        for (let i = 0; i < audioElements.length; i++) {
            if (!audioElements[i].paused) {
                fadeOut(audioElements[i], 2000); // Fade out over 2 seconds
            }
        }
        for (let i = 0; i < audioElements.length; i++) {
            let event = new Event("audioPaused");
            audioElements[i].dispatchEvent(event);
        }
    };

    const handleAudioResume = () => {
        const audioElements = document.getElementsByTagName("audio");
        for (let i = 0; i < audioElements.length; i++) {
            fadeIn(audioElements[i], 2000); // Fade in over 2 seconds
        }
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

    const prev = () => {
        const total =
            document.getElementsByClassName("selected-songs")[0].children.length;
        setSelectedSoundIndex((prevIndex) =>
            prevIndex !== 0 ? prevIndex - 1 : total - 1
        ); // Wrap around if at the end
    };

    const next = () => {
        setSelectedSoundIndex(
            (prevIndex) =>
                (prevIndex + 1) %
                document.getElementsByClassName("selected-songs")[0].children.length
        ); // Wrap around if at the end
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
                            onRestStart={handleAudioPause}
                            focusTime={focusTime}
                            breakTime={breakTime}
                            showSoundboard={showSoundboard}
                        />
                    </div>

                    {/* Toggle Soundboard Button */}
                    <button className="toggle-soundboard" onClick={toggleSoundboard}>
                        {showSoundboard ? 'Hide Soundboard' : 'Show Soundboard'}
                    </button>

                    {/* Selected Songs Section */}
                    <div className={`selected-songs-section ${!showSoundboard ? 'push-down' : ''}`}>
                        <div className="selected-songs">
                            {soundData.slice(0, 3).map((sound) => (
                                <a
                                    key={sound.id}
                                    href="#"
                                    className={selectedSound === sound.soundSrc ? "active" : ""}
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
                            <SoundButton soundSrc={selectedSound} label="Selected Sound" showSoundboard={showSoundboard} />
                            {soundData.slice(3).map((sound) => (
                                <SoundButton key={sound.id} soundSrc={sound.soundSrc} label={sound.label} showSoundboard={showSoundboard} />
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
                    />,
                    document.body
                )}
            </div>
        </div>
    );
};

export default Soundboard;
