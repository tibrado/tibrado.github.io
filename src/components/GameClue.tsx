import React from 'react';
import {Box} from '@mui/material';
import ReactMarkdown from 'react-markdown';

export type Props ={
    clue: string;
}; 

export const GameClue: React.FC<Props> = ({clue}) => {
    return (
        <Box sx={{overflowY: 'auto', height: '500px', pl: 1, pr: 1}}>
            <ReactMarkdown>
                {clue}
            </ReactMarkdown>
        </Box>
    ); 
}; 