import React, { useEffect, useState } from 'react';
import { Box, Button } from '@mui/material';
import { Logout } from '@mui/icons-material';

type Props = {
  text?: string;
};

const Done: React.FC<Props> = ({ text = "Good Job" }) => {
    const [trigger, setTrigger] = useState(false);

    // trigger animation
    useEffect(() => {
    const timer = setTimeout(() => {
        setTrigger(true); 
    }, 500); 

    return () => clearTimeout(timer); 
    }, []); 

    // close webpage 


    const handleClose = () => {
        // Attempt to close the window
        window.close();

        // Fallback: If window.close() is blocked by the browser, redirect to home or blank
        setTimeout(() => {
            window.location.href = "about:blank"; 
        }, 100);
    };

  return (
    <Box
        sx={{
            height: '90dvh',
            width: '90dvw',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            position: 'relative',
        }}
    >
      <Box
        sx={{
            display: 'inline-block',
            transformOrigin: 'top left',
            // Chaining: Hinge (2s) then Drop-In (1s) with a 2s delay
            animation: trigger ? 'hinge-effect 2s forwards, drop-in 1s 2.2s forwards' : 'none',
            
            '@keyframes hinge-effect': {
                '0%': { transform: 'rotate3d(0, 0, 1, 0deg)' },
                '20%, 60%': { transform: 'rotate3d(0, 0, 1, 80deg)' },
                '40%, 80%': { transform: 'rotate3d(0, 0, 1, 60deg)', opacity: 1 },
                '100%': { transform: 'translate3d(0, 100dvh, 0)', opacity: 0 },
            },

            '@keyframes drop-in': {
                '0%': { 
                    transform: 'translate3d(0, -100dvh, 0)', 
                    opacity: 0,
                    transformOrigin: 'center center' // Reset origin so it lands straight
                },
                '100%': { 
                    transform: 'translate3d(0, 0, 0)', 
                    opacity: 1,
                    transformOrigin: 'center center'
                },
            },
        }}
      >
        
        <Button
            startIcon={<Logout/>}
            variant="contained"
            color="success"
            onClick={handleClose}
            size='large'
        >
          {text}
        </Button> 
      </Box>
    </Box>
  );
};

export default Done;
