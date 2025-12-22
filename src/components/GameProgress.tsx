import React from 'react';
import { Slider, Box } from '@mui/material';

export type GameProgressInfo = {
    max: number;
    current: number; 
}; 

export const GameProgress: React.FC<GameProgressInfo> = (gpi) => {
    return  <Box>
        <Slider
            min={1}
            max={gpi.max}
            marks
            value={gpi.current}
            disabled
            valueLabelDisplay='on'
            sx={{
                // Target the specific MUI class for the value label
                '& .MuiSlider-valueLabel': {
                    fontFamily:'system-ui',
                    top: '38px', // Adjust this value to control vertical position
                    width: '20px', 
                    borderRadius: '20%',
                    background: '#ffffff1b',
                    boxShadow: '0 0 3px 0px rgba(129, 129, 129, 0.3)',
                    '&::before': {
                        // Optional: adjust the tooltip arrow if needed
                        bottom: 'unset',
                        top: '-8px', // Move the arrow above the label
                        left: '12.5px',
                        opacity: 0
                    }
                },
                '& .MuiSlider-thumb': {
                    height: 5,
                    width: 5,
                    borderRadius: '20%',
                    backgroundColor: '#ffffff1b',
                    boxShadow: '0 0 2px 0px rgba(0, 0, 0, 0)',
                    opacity: 1
                },
                '& .MuiSlider-mark': { // Target the mark element (the dot)
                    height: 8,
                    width: 4,
                    borderRadius: '20%', // Make it a circle
                    opacity: 1, // Ensure visibility
                },
                '& .MuiSlider-markActive': {
                    backgroundColor: '#fbfafaff', // Color for marks past the thumb
                }
            }}
        />
    </Box>
};