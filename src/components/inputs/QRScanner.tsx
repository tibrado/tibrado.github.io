import React from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { Box, Typography } from '@mui/material';

type Props = {
    onSubmit: (text: string) => void; 
    msg?: string;
    nope?: boolean; 
};
const QRScanner: React.FC<Props> = ({onSubmit, msg, nope}) => (
    <Box
        sx={{
            borderRadius: '5px',
            p: '4px',
            boxShadow: `0px 3px 10px ${nope ? 'red' : 'rgba(255, 255, 255, 1)'}`,
            background: 'rgba(255, 255, 255, 1)'
        }}
    >
        <Typography 
            variant='caption'
            color= 'gray'
        >
            {msg}
        </Typography>
        <Scanner
            onScan={(code) => onSubmit(code[0].rawValue)}
            onError={(error) => console.error(error)}
            sound={true}
        />
    </Box>
);

export default QRScanner; 