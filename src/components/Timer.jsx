import React, { useState, useEffect, useRef } from 'react';
import 'font-awesome/css/font-awesome.min.css';


const Timer = ({ onPause, onRestStart, onResume }) => {
    const [wholeTime, setWholeTime] = useState(25 * 60);
    const [timeLeft, setTimeLeft] = useState(wholeTime);
    const [isPaused, setIsPaused] = useState(true);
    const [isStarted, setIsStarted] = useState(false);
    const [timerType, setTimerType] = useState('main'); // 'main' for main timer, 'additional' for 20% timer
    const [isMainTimer, setIsMainTimer] = useState(true);  // true for main, false for additional
    const [displayTime, setDisplayTime] = useState(`${Math.floor(wholeTime / 60).toString().padStart(2, '0')}:${(wholeTime % 60).toString().padStart(2, '0')}`);



    const intervalRef = useRef(null);

    const progressBarRef = useRef(null);
    const pointerRef = useRef(null);

    const resetTimer = () => {
        setWholeTime(25 * 60);
        setTimeLeft(25 * 60);
        setIsStarted(false);
        setIsMainTimer(true); // ensure main timer will start next
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
                            setIsMainTimer(false);
                            onRestStart();  // Call the onRestStart callback when the rest timer starts
                            const newTime = Math.round(wholeTime * 0.2);
                            return newTime;
                        } else {
                            setIsMainTimer(true);
                            return wholeTime;
                        }
                    }
                    return prevTime - 1;
                });
            }, 1000);
        }

        const newDisplayTime = `${Math.floor(timeLeft / 60).toString().padStart(2, '0')}:${(timeLeft % 60).toString().padStart(2, '0')}`;
        setDisplayTime(newDisplayTime);

        return () => clearInterval(intervalRef.current);
    }, [isPaused, isStarted, wholeTime, isMainTimer, onRestStart, timeLeft]); // Add onRestStart to the dependency array



    const handleSetterClick = (setterType) => {
        if (!isStarted) {
            let timeAdjustment;

            switch (setterType) {
                case 'minutes-plus':
                    timeAdjustment = 60;
                    break;
                case 'minutes-minus':
                    timeAdjustment = -60;
                    break;
                case 'seconds-plus':
                    timeAdjustment = 1;
                    break;
                case 'seconds-minus':
                    timeAdjustment = -1;
                    break;
                default:
                    timeAdjustment = 0;
            }

            console.log(displayTime)
            const newTime = Math.max(wholeTime + timeAdjustment, 0);
            setWholeTime(newTime);
            setTimeLeft(newTime);
            setIsMainTimer(true); // reset back to the main timer
        }
    };

    const togglePause = () => {
        // console.log("Toggling pause", { isStarted, isPaused });
        if (timerType === 'additional' && isPaused && !isStarted) {
            setTimerType('main');
            setTimeLeft(wholeTime);
        } else if (!isStarted) {
            setIsStarted(true);
            setIsPaused(false);
        } else {
            setIsPaused((prevPauseState) => {
                if (!prevPauseState) {
                    onPause(); // Call the onPause callback when pausing the timer
                } else {
                    // onResume(); // Call the onResume callback when resuming the timer
                }
                return !prevPauseState;
            });
        }
    };



    useEffect(() => {
        const length = Math.PI * 2 * 100;
        progressBarRef.current.style.strokeDasharray = length;

        const updatePointer = (value) => {
            const offset = -length - (length * value / wholeTime);
            progressBarRef.current.style.strokeDashoffset = offset;
            pointerRef.current.style.transform = `rotate(${360 * value / wholeTime}deg)`;
        };

        updatePointer(timeLeft);
    }, [timeLeft, wholeTime]);

    // Functions allow the timer display to be changed manually instead of buttons
    const handleTimeInputChange = (e) => {
        let value = e.target.value;

        // Strip out non-numeric characters
        value = value.replace(/\D/g, '');

        // Ensure the value is not too long
        if (value.length <= 4) {
            // Add leading zeros if needed
            while (value.length < 4) value = '0' + value;

            // Insert the colon to make it MM:SS format
            value = value.slice(0, 2) + ':' + value.slice(2);

            setDisplayTime(value);
        }
    };



    const handleTimeInputBlur = () => {
        // Convert the display time to seconds and update the timer
        const [minutes, seconds] = displayTime.split(":").map(Number);
        const totalTimeInSeconds = (minutes * 60) + seconds;

        setWholeTime(totalTimeInSeconds);
        setTimeLeft(totalTimeInSeconds);
    };



    return (
        <div>
            <div className="setters">
                <div className={`message ${!isPaused ? "pulsing" : ""}`}>
                    <b>{isMainTimer ? "Focus" : "Rest"}</b>
                </div>
                {!isStarted && (
                    <>
                        <div className="minutes-set">
                            <button data-setter="minutes-minus" onClick={() => handleSetterClick('minutes-minus')}>-</button>
                            <button data-setter="minutes-plus" onClick={() => handleSetterClick('minutes-plus')}>+</button>
                        </div>
                        <div className="seconds-set">
                            <button data-setter="seconds-minus" onClick={() => handleSetterClick('seconds-minus')}>-</button>
                            <button data-setter="seconds-plus" onClick={() => handleSetterClick('seconds-plus')}>+</button>
                        </div>
                    </>
                )}
            </div>
            <div className="circle">
                <svg width="300" viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg">
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
            <div className="controlls">
                <input
                    type="text"
                    value={displayTime}
                    className="display-remain-time"
                    onChange={handleTimeInputChange}
                    onBlur={handleTimeInputBlur}
                    onClick={(e) => e.target.select()}  // Add this line
                />

                <button id="pause" className={isPaused ? 'play' : 'pause'} onClick={togglePause}></button>
                {isPaused && displayTime !== '25:00' && ( // The button only appears when the timer is paused and not started
                    <button id="reset" className="reset-button" onClick={resetTimer}>
                        <i className="fa fa-refresh"></i>
                    </button>
                )}

            </div>
        </div>
    );
};

export default Timer;
