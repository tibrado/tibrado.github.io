import React from 'react';
import {Box} from '@mui/material';
import ReactMarkdown from 'react-markdown';

export type Props ={
    clue: string;
}; 

export const GameClue: React.FC<Props> = ({clue}) => {
    return (
        <Box sx={{
            overflowY: 'auto', height: '70dvh', pl: 1, pr: 1,
            fontFamily: 'system-ui',
            boxShadow: '4px',
            color: 'wheat'
        }}>
            <ReactMarkdown>
                {clue}
            </ReactMarkdown>
        </Box>
    ); 
}; 