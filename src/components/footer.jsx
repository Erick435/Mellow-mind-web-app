import React, { useState } from 'react';

function Footer() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="App" style={{ position: 'relative', zIndex: 0, marginBottom: '35px' }}>
      <div style={{ position: 'relative', bottom: '70px', width: '100%', padding: '10px 20px', textAlign: 'center' }}>
        <a 
          href="https://forms.gle/YP93waRthLBaf6Jg8" 
          target="_blank" 
          rel="noopener noreferrer" 
          style={{
            textDecoration: 'none', 
            color: isHovered ? 'black' : 'white',
            fontSize: '20px'  // adjust this value as per your requirement
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          Give us your feedback!
        </a>
      </div>
    </div>
  );
}

export default Footer;
