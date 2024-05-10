import React, { useState, useRef, useEffect } from 'react';
import screenfull from 'screenfull';

const FullScreenButton = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const containerRef = useRef(null);

  const toggleFullScreen = () => {
    if (isFullScreen) {
      screenfull.exit();
    } else {
      screenfull.request(containerRef.current);
    }
    setIsFullScreen(!isFullScreen);
  };

  useEffect(() => {
    const changeHandler = () => {
      setIsFullScreen(screenfull.isFullscreen);
    };

    screenfull.on('change', changeHandler);

    return () => screenfull.off('change', changeHandler);
  }, []);

  return (
    <div ref={containerRef}>
      {/* Your component content to be displayed in full screen */}
      <button onClick={toggleFullScreen}>
        {isFullScreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
      </button>
    </div>
  );
};

export default FullScreenButton;
