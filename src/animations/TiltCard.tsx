import React, { useRef, useState, useEffect, type MouseEvent, type ReactNode } from 'react';
import MuiCard from '@mui/material/Card';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

interface TiltCardProps {
  children: ReactNode;
  maxTilt?: number;
  perspective?: number;
}

// --- Styled Components ---

// Container defines the 3D perspective and passes CSS variables
const StyledTiltContainer = styled(Box)(({ }) => ({
  transition: 'transform 0.1s ease-out',
  position: 'relative',
  overflow: 'hidden', 
}));

// Card applies the rotation and the holofoil pseudo-element
const StyledCard = styled(MuiCard)(({ theme }) => ({
  height: '100%',
  width: '100%',
  // This transform uses CSS variables for the tilt rotation
  transform: 'rotateX(var(--rotateX, 0deg)) rotateY(var(--rotateY, 0deg))',
  transition: 'transform 0.1s ease-out, box-shadow 0.3s ease',
  position: 'relative',
  zIndex: 1, 

  // The Holofoil effect overlay
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.5, 
    pointerEvents: 'none',
    // Background position uses CSS variables for the glare origin
    background: `radial-gradient(
      circle at var(--glareX, 50%) var(--glareY, 50%),
      #ffffff80,
      #ff00f333 10%,
      #00c4ff33 30%,
      #00ff2f33 50%,
      #fffb0033 70%,
      #ff000033 90%,
      #ffffff00
    )`,
    // This transform should mirror the parent card's rotation
    transform: 'rotateX(var(--rotateX, 0deg)) rotateY(var(--rotateY, 0deg))',
    // FIX: Only transition opacity and the background position itself.
    // The `transform` transition is managed by the main card transition above.
    transition: 'opacity 0.3s ease-out, background-position 0.1s ease-out',
  },
  '&:hover::before': {
    opacity: 0.8,
  },
  boxShadow: theme.shadows[4],
  '&:hover': {
    boxShadow: theme.shadows[16],
  }
}));


// --- Main TiltCard Component ---

const TiltCard: React.FC<TiltCardProps> = ({ children, maxTilt = 5, perspective = 1000 }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });

  // Centralized function to calculate both tilt and glare
  const handleMovement = (dx: number, dy: number, offsetWidth: number, offsetHeight: number) => {
    // Tilt calculations (in degrees)
    const tiltX = (dy / offsetHeight) * maxTilt;
    const tiltY = -(dx / offsetWidth) * maxTilt;
    setRotation({ x: tiltX, y: tiltY });

    // Glare calculations (in percentage 0-100)
    // dx/offsetWidth is a value from roughly -0.5 to 0.5
    // We adjust it to map to 0 to 1 range, then multiply by 100
    const glareX = (dx / offsetWidth + 0.5) * 100;
    const glareY = (dy / offsetHeight + 0.5) * 100;
    setGlarePosition({ x: glareX, y: glareY });
  };

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const { clientX, clientY } = event;
    const { offsetWidth, offsetHeight, offsetLeft, offsetTop } = cardRef.current;
    
    // Calculate distance from the center of the container
    const dx = clientX - (offsetLeft + offsetWidth / 2);
    const dy = clientY - (offsetTop + offsetHeight / 2);
    
    handleMovement(dx, dy, offsetWidth, offsetHeight);
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
    setGlarePosition({ x: 50, y: 50 });
  };

  const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
    if (event.beta === null || event.gamma === null || !cardRef.current) return;
    
    const { offsetWidth, offsetHeight } = cardRef.current;
    // Normalize device sensor inputs roughly (values typically range from -90 to 90)
    // We map them to our expected input range for the handleMovement function
    const dx = (event.gamma || 0) * (offsetWidth / 180); 
    const dy = (event.beta || 0) * (offsetHeight / 180);
    handleMovement(dx, dy, offsetWidth, offsetHeight);
  };
  
  useEffect(() => {
    // We use React's built-in onMouseMove/onMouseLeave in the return JSX below for mouse events.
    // We imperatively add the device orientation listener for phone tilt functionality.
    if (typeof window !== 'undefined' && window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleDeviceOrientation, true);
    }

    return () => {
      // Cleanup the listener when the component unmounts
      if (typeof window !== 'undefined' && window.DeviceOrientationEvent) {
        window.removeEventListener('deviceorientation', handleDeviceOrientation, true);
      }
    };
  }, []); // Empty dependency array means this runs once on mount/unmount

  return (
    <StyledTiltContainer
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      // Pass the state variables as CSS custom properties
      sx={{
        perspective: `${perspective}px`,
        '--rotateX': `${rotation.x}deg`,
        '--rotateY': `${rotation.y}deg`,
        '--glareX': `${glarePosition.x}%`,
        '--glareY': `${glarePosition.y}%`,
      }}
    >
      <StyledCard>
        {children}
      </StyledCard>
    </StyledTiltContainer>
  );
};

export default TiltCard;