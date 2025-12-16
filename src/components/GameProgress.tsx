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
                    top: '41px', // Adjust this value to control vertical position
                    '&::before': {
                        // Optional: adjust the tooltip arrow if needed
                        bottom: 'unset',
                        top: '-7px', // Move the arrow above the label
                    }
                },
                '& .MuiSlider-thumb': {
                    height: 5,
                    width: 5,
                    borderRadius: 0,
                    backgroundColor: '#ff0000ff',
                    boxShadow: '0 0 2px 0px rgba(255, 0, 0, 1)',
                    '&:focus, &:hover, &.Mui-active': {
                        boxShadow: '0px 0px 3px 1px rgba(191, 255, 0, 1)',
                    },
                    '&:before': {
                        boxShadow:'0px 0px 1px 0px rgba(0,0,0,0.2), 0px 0px 0px 0px rgba(0,0,0,0.14), 0px 0px 1px 0px rgba(0,0,0,0.12)',
                    },
                },
            }}
        />
    </Box>
};