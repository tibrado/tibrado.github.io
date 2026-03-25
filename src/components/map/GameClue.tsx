import React from 'react';
import ReactMarkdown from 'react-markdown';
import GameInputHandler from '../inputs/GameInputHandler';
import type { InputTypes } from '../../assets/types';
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
    console.log(hint)
    return ( 
        !showClue 
        ? <Box sx={{height: '100%', width: '100%', p: 0, m: 0, overflowY: 'auto'}}> 
           <ReactMarkdown children={clue}/>
        </Box>
        : <GameInputHandler 
            onSubmit={validateResponse} 
            inputType={inputType}
            hint={hint}
            label="code"
            nope={nope}
            textRows={7}
        />
    ); 
}; 