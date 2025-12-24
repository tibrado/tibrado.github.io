import React from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { Box, Typography } from '@mui/material';

type Props = {
    onSubmit: (text: string) => void; 
    msg?: string;
    nope?: boolean; 
};
const QRScanner: React.FC<Props> = ({onSubmit, msg = 'uess', nope}) => (
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
            sx={{
                pl: 1, 
                alignContent: 'center',
                fontFamily: 'system-ui',
                textShadow: '0px 1px 5px rgba(0, 0, 0, 0.5)',
                color: `${nope ? 'red' : '#000000e1'}`
            }}
        >
            {msg}
        </Typography>
        <Scanner
            onScan={(code) => onSubmit(code[0].rawValue)}
            onError={(error) => console.error(error)}
        />
    </Box>
);

export default QRScanner; 