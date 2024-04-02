import React from 'react';
import { useRef } from 'react';
import { useState } from 'react';

const Progressbar = () => {
  const [progress, setProgress] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false); // Track if interaction has happened
  const progressBarRef = useRef(null);

  const stages = [
    { label: 'your image looks Poor', color: '#FF5733' },
    { label: 'your image looks Average', color: '#FFC300' },
    { label: 'your image looks Good', color: '#4CAF50' },
    { label: 'your image looks Excellent', color: '#00BCD4' },
  ];

  const calculateProgress = (clientX) => {
    const progressBarRect = progressBarRef.current.getBoundingClientRect();
    const offsetX = clientX - progressBarRect.left;
    const newProgress = Math.min(Math.max((offsetX / progressBarRect.width) * 100, 0), 100);

    const stageIndex = Math.floor(newProgress / 25);
    if (stages[stageIndex]) {
      const stageColor = stages[stageIndex].color;
      progressBarRef.current.style.background = `linear-gradient(to right, ${stageColor} ${newProgress}%, #eee ${newProgress}%)`;
      progressBarRef.current.style.setProperty('--progress-bar-color', stageColor);
    }

    return newProgress;
  };

  const handleMouseDown = (event) => {
    const newProgress = calculateProgress(event.clientX);
    setProgress(newProgress);
    setHasInteracted(true); // Interaction happened, show the message
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (event) => {
    const newProgress = calculateProgress(event.clientX);
    setProgress(newProgress);
  };

  const handleMouseUp = () => {
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  };

  const getLabel = () => {
    for (let i = 0; i < stages.length; i++) {
      if (progress < (i + 1) * 25) {
        return stages[i].label;
      }
    }
    return stages[stages.length - 1].label;
  };

  return (
    <>
      <div className="five-stage-progress">
        <div className="progress-icons" ref={progressBarRef} onMouseDown={handleMouseDown}>
          {stages.map((stage, index) => (
            <div
              key={index}
              className={`progress-icon ${progress >= (index + 1) * 25 ? 'filled' : ''}`}
              style={{
                backgroundColor: stage.color,
                borderRadius: '50%',
                width: '50px',
                height: '50px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {index + 1}
            </div>
          ))}
        </div>
        {hasInteracted && (
          <div className="progress-label" style={{ color: getLabel() }}>
            {getLabel()}
          </div>
        )}
      </div>
    </>
  );
};

export default Progressbar;
