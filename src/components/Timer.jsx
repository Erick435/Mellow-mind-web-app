import React, { useState, useEffect, useRef } from "react";
import "font-awesome/css/font-awesome.min.css";


const Timer = ({ onPause, onResume, onFocusEnd, onBreakEnd, focusTime = 25, breakTime = 5, showSoundboard }) => {
    const focusTimeInSeconds = focusTime * 60;
    const [wholeTime, setWholeTime] = useState(focusTimeInSeconds);
    const [timeLeft, setTimeLeft] = useState(focusTimeInSeconds);
    const [isPaused, setIsPaused] = useState(true);
    const [isStarted, setIsStarted] = useState(false);
    const [isMainTimer, setIsMainTimer] = useState(true); // true for main, false for additional

    const intervalRef = useRef(null);

    const progressBarRef = useRef(null);
    const pointerRef = useRef(null);

    const resetTimer = (isForFocus = true) => {
        const newTime = isForFocus ? focusTime * 60 : breakTime * 60;
        setWholeTime(newTime);
        setTimeLeft(newTime);
        setIsStarted(false);
        setIsMainTimer(isForFocus); // ensure main timer will start next
    };

    useEffect(() => {
        if (!isStarted) return;
        
        if (isPaused) {
            clearInterval(intervalRef.current);
        } else {
            intervalRef.current = setInterval(() => {
                setTimeLeft((prevTime) => {
                    if (prevTime <= 1) {
                        clearInterval(intervalRef.current);
        
                        if (isMainTimer) {
                            onFocusEnd && onFocusEnd();
                            
                            // Emit a custom event to pause the music
                            // window.dispatchEvent(new Event('pauseMusic'));
                            window.dispatchEvent(new CustomEvent('onFocusEnd'));
    
                            resetTimer(false);
                            setIsStarted(true);
                            return breakTime * 60;
                        } else {
                            onBreakEnd && onBreakEnd();
    
                            // Emit a custom event to play the music
                            // window.dispatchEvent(new Event('playMusic'));
                            window.dispatchEvent(new CustomEvent('onBreakEnd'));
    
                            resetTimer(true);
                            setIsStarted(true);
                            return focusTimeInSeconds;
                        }
                    }
                    return prevTime - 1;
                });
            }, 1000);
        }
        return () => clearInterval(intervalRef.current);
    }, [
        isPaused, isStarted, wholeTime, isMainTimer, breakTime, focusTimeInSeconds, onFocusEnd, onBreakEnd
    ]);
    
    useEffect(() => {
        resetTimer();
    }, [focusTime, breakTime]);

    const togglePause = () => {
    if (!isStarted) {
        setIsStarted(true);
        setIsPaused(false);
    } else {
        setIsPaused(prevPauseState => !prevPauseState);
    }
};

    
    

    useEffect(() => {
        const length = Math.PI * 2 * 100;
        progressBarRef.current.style.strokeDasharray = length;

        const updatePointer = (value) => {
            const offset = -length - (length * value) / wholeTime;
            progressBarRef.current.style.strokeDashoffset = offset;
            pointerRef.current.style.transform = `rotate(${(360 * value) / wholeTime} deg)`;
        };

        updatePointer(timeLeft);
    }, [timeLeft, wholeTime]);

    const displayTime = `${Math.floor(timeLeft / 60).toString().padStart(2, "0")}:${(timeLeft % 60).toString().padStart(2, "0")}`;

    return (
        <div>
            <div className="setters">
                <div className={`message mt-7 ${!isPaused ? "pulsing" : ""} ${!showSoundboard ? 'message-push-down' : ''}`}>
                    <b>{isMainTimer ? "Focus" : "Rest"}</b>
                </div>

            </div>
            <div className="circle">
                <svg
                    width="500"
                    viewBox="0 0 220 220"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <g transform="translate(110,110)">
                        <circle r="100" className="e-c-base" />
                        <g transform="rotate(-90)">
                            <circle r="100" className="e-c-progress" ref={progressBarRef} />
                            <g id="e-pointer" ref={pointerRef}>
                                <circle cx="100" cy="0" r="8" className="e-c-pointer" />
                            </g>
                        </g>
                    </g>
                </svg>
            </div>
            <div className={`controlls ${!showSoundboard ? 'controlls-push-down' : ''}`}>
                <div className="display-remain-time">{displayTime}</div>
                <button
                    id="pause"
                    className={isPaused ? "play" : "pause"}
                    onClick={togglePause}
                ></button>
                {isPaused &&
                    displayTime !== "25:00" && (
                        <button id="reset" className="reset-button" onClick={resetTimer}>
                            <i className="fa fa-refresh"></i>
                        </button>
                    )}
            </div>

        </div>
    );
};
export default Timer;