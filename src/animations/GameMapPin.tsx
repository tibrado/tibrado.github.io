import React from 'react';
import { Card, CardContent, Box } from '@mui/material';
import { Whatshot } from '@mui/icons-material';


type Props = {
};

const GameMapPin: React.FC<Props> = () => {
  return (
    <Box
        sx={{
            perspective: '1000px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '50px', // Extra height for the bobbing range
            width: '50px',
        }}
    >
      {/* 1. OUTER BOX: Controls the Bobbing (translateY) */}
      <Box
        sx={{
            animation: 'bob 2.5s ease-in-out infinite',
            '@keyframes bob': {
                '0%, 50%': { transform: 'translateY(0px)' },
                '50%': { transform: 'translateY(-15px)' },
          },
        }}
      >
        {/* 2. INNER BOX: Controls the Spinning (rotateY) */}
        <Box
          sx={{
            animation: 'spinY 3s linear infinite',
            '@keyframes spinY': {
              '0%': { transform: 'rotateY(0deg)' },
              '100%': { transform: 'rotateY(360deg)' },
            },
          }}
        >
            <Card
                sx={{
                    width: 30,
                    height: 35,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'primary.main',
                    color: 'white',
                    borderRadius: 1,
                    overflow: 'hidden',
                    position: 'relative',
                    // Fire Gradient Background
                    background: 'linear-gradient(-45deg, #e62117, #f0610e, #ffba08, #f0610e)',
                    backgroundSize: '400% 400%',
                    
                    // Combined Animations: fire background movement AND the glow pulse
                    animation: `
                    fireMove 5s ease infinite, 
                    glowPulse 2s ease-in-out infinite
                    `,

                    '@keyframes fireMove': {
                    '0%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                    '100%': { backgroundPosition: '0% 50%' },
                    },

                    // The Glow Animation
                    '@keyframes glowPulse': {
                    '0%, 100%': {
                        boxShadow: '0 0 1px #e62117, 0 0 5px #f0610e',
                    },
                    '50%': {
                        boxShadow: '0 0 2px #f0610e, 0 0 10px #ffba08',
                    },
                    },
                }}
            >
                <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
                    <Whatshot/>
                </CardContent>
            </Card>
        </Box>
      </Box>
    </Box>
  );
};


export default GameMapPin; 