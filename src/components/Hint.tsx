import React, { type ReactElement } from 'react'; 
import { Tooltip } from '@mui/material';
import {Wifi, DirectionsWalk, DriveEta, Place, Psychology, Home } from '@mui/icons-material';
import type{ HintIconTypes } from '../assets/types';

type Props = {
    hint: HintIconTypes;
}; 

export const Hint: React.FC<Props> = ({hint}) => {
    const tips  = {
        internet: "use internet for solution",
        walk: "solution to clue is less than 1 mile from where clue was recived",
        drive: "solution to clue is more than 1 mile from where clue was recived",
        here: "solution to clue is within field of view",
        think: "solution to clue is based on something experienced in this game",
        building: "solution to clue is in the building this clue was recived"
    }; 
    const hintIcons: Record<string, ReactElement> = {
        'internet': <Wifi/>,
        'walk': <DirectionsWalk/>,
        'drive': <DriveEta/>,
        'here': <Place/>,
        'think': <Psychology/>,
        'building': <Home/>,
    }; 

    return (
        <Tooltip 
            title={tips[hint]}
            children={hintIcons[hint]}
        />
    );
}; 