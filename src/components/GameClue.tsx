import React from 'react';
import ReactMarkdown from 'react-markdown';
import GameInputs from './inputs/GameInputs';
import type { InputTypes } from '../assets/types';
import {Box} from '@mui/material';

export type Props ={
    showClue: boolean;
    clue: string;
    nope: boolean;
    inputType: InputTypes; 
    hint: string; 
    validateResponse: (response: string) => void; 
}; 

export const GameClue: React.FC<Props> = ({showClue, clue, validateResponse, hint, inputType, nope}) => {

    return ( 
        !showClue 
        ? <Box sx={{height: '100%', width: '100%', p: 0, m: 0, overflowY: 'auto'}}> 
           <ReactMarkdown children={clue}/>
        </Box>
        : <GameInputs 
            onSubmit={validateResponse} 
            inputType={inputType}
            helperText={hint}
            label="code"
            nope={nope}
            textRows={7}
        />
    ); 
}; 