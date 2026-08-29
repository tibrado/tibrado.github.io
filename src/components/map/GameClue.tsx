import React, {type ReactElement} from 'react';
import ReactMarkdown from 'react-markdown';
import type { InputTypes } from '../../assets/types';
import {Box} from '@mui/material';
import TextInput from '../inputs/TextInput';
import ObjectClassifier from '../inputs/ObjectClassifier';
import QRScanner from '../inputs/QRScanner';

export type Props ={
    OnSubmit: (v: boolean, p: number) => void; 
    showClue: boolean;
    clue: string;
    responses: string[];
    inputType: InputTypes; 
    hint: string; 
}; 

export const GameClue: React.FC<Props> = ({OnSubmit, showClue, clue, responses, inputType, hint}) => {

    const Inputs: Record<InputTypes, ReactElement> = {
        text: <TextInput OnSubmit={OnSubmit} responses={responses} hint={hint}/>,
        scan: <QRScanner  OnSubmit={OnSubmit} responses={responses} hint={hint}/>,
        detect: <ObjectClassifier OnSubmit={OnSubmit}  responses={responses} hint={hint}/>

    };

    return ( 
        showClue ? 
            <Box sx={{height: '100%', width: '100%', p: 0, m: 0, overflowY: 'auto'}}> 
                <ReactMarkdown children={clue}/>
            </Box>
        : Inputs[inputType]
    ); 
}; 