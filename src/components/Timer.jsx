import React, { useState, useEffect, useRef } from 'react';

const Timer = () => {
    const [wholeTime, setWholeTime] = useState(25 * 60);
    const [timeLeft, setTimeLeft] = useState(wholeTime);
    const [isPaused, setIsPaused] = useState(true);
    const [isStarted, setIsStarted] = useState(false);
    const intervalRef = useRef(null);

    const progressBarRef = useRef(null);
    const pointerRef = useRef(null);

    useEffect(() => {
        if (!isStarted) return;

        if (isPaused) {
            clearInterval(intervalRef.current);
        } else {
            intervalRef.current = setInterval(() => {
                setTimeLeft((prevTime) => {
                    if (prevTime <= 1) {
                        setIsPaused(true);
                        setIsStarted(false);
                        clearInterval(intervalRef.current);
                        return wholeTime;
                    }
                    return prevTime - 1;
                });
            }, 1000);
        }

        return () => clearInterval(intervalRef.current);
    }, [isPaused, isStarted, wholeTime]);

    const handleSetterClick = (setterType) => {
        // console.log("Button clicked:", setterType); // Check which button is clicked
    // console.log("Is the timer started?", isStarted); // Check the state of the timer
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
    
            const newTime = Math.max(wholeTime + timeAdjustment, 0);
            setWholeTime(newTime);
            setTimeLeft(newTime); // Set the time left to the new whole time.
        }
    };
    

    const togglePause = () => {
        if (!isStarted) {
            setIsStarted(true);
            setIsPaused(false);
        } else {
            setIsPaused((prevPauseState) => !prevPauseState);
            // window.alert("STOP")
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

    const displayTime = `${Math.floor(timeLeft / 60).toString().padStart(2, '0')}:${(timeLeft % 60).toString().padStart(2, '0')}`;

    return (
        <div>
            <div className="setters">
                <div className="minutes-set">
                    <button data-setter="minutes-minus" onClick={() => handleSetterClick('minutes-minus')}>-</button>
                    <button data-setter="minutes-plus" onClick={() => handleSetterClick('minutes-plus')}>+</button>
                </div>
                <div className="seconds-set">
                    <button data-setter="seconds-minus" onClick={() => handleSetterClick('seconds-minus')}>-</button>
                    <button data-setter="seconds-plus" onClick={() => handleSetterClick('seconds-plus')}>+</button>
                </div>
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
                <div className="display-remain-time">{displayTime}</div>
                <button id="pause" className={isPaused ? 'play' : 'pause'} onClick={togglePause}></button>
            </div>
        </div>
    );
};

export default Timer;
