import React, { useState, useEffect } from 'react';

const LiveTimer = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const formatTime = (time) => {
    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    // const seconds = time.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <div className="live-timer">
      <div className="digital-clock">{formatTime(currentTime)}</div>
    </div>
  );
};

export default LiveTimer;
