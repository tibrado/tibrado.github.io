import React, { useEffect, useState } from 'react';
import { Typography, Box } from '@mui/material';
import { keyframes } from '@mui/system';

const floatUp = keyframes`
  0% {
    transform: translateY(20px);
    opacity: 0;
  }
  25% {
    transform: translateY(0);
    opacity: 0.5;
  }
  50% {
    transform: translateY(0);
    opacity: 1;
  }
  75% {
    transform: translateY(0);
    opacity: 0.5;
  }
  100% {
    transform: translateY(-60px);
    opacity: 0;
  }
`;

export default function CorrectAnswerBackdrop({score }: {score: number}): React.JSX.Element {
    const [play, setPlay] = useState<boolean>(false)
    
    useEffect(() => {
        if(score > 0) { setPlay(true); }
    }, [score]); 

    // Automatically trigger close handler after the 1-second animation finishes
    useEffect(() => {
    if (!play) return;

    const timer = setTimeout(() => {
        setPlay(false)
    }, 1000); // Matches the 1s animation duration

    return () => clearTimeout(timer); // Clean up timer on unmount or if open changes
    }, [play]);

    return (
        play ? (
        <Box
            sx={{
            position: 'absolute', // Completely removes it from normal document flow
            top: '50%',          // Centers it vertically
            left: '50%',         // Centers it horizontally
            transform: 'translate(-50%, -50%)', // Keeps it perfectly aligned in the middle
            zIndex: 10,
            pointerEvents: 'none', // Prevents it from blocking clicks to underlying buttons    
            animation: `${floatUp} 1s ease-in-out forwards`, // Duration changed to 1s
            }}
        >
        
            <Typography
            variant="h3"
            sx={{
                fontWeight: 'bold',
                color: '#4caf50',
                textShadow: '0px 0px 15px rgba(255, 255, 255, 0.6)',
            }}
            >
                {`+${score}`}
            </Typography>
        </Box>
        ) : <></>
    );
}