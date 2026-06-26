import React, {useState} from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { Box, Typography } from '@mui/material';

type Props = {
    onSubmit: (text: string) => void; 
    msg?: string;
    nope?: boolean; 
};

const QRScanner: React.FC<Props> = ({onSubmit, msg = 'none', nope}) => {
    const [scan, setScan] = useState<string>('find the qr code'); 
    
    return (
        <Box
            sx={{
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '100%'
            }}
        >
            <Typography 
                variant='caption'
                sx={{
                    pl: 1, 
                    fontFamily: 'system-ui',
                    textShadow: '0px 1px 5px rgba(0, 0, 0, 0.5)',
                    color: `${nope ? 'red' : '#000000e1'}`
                }}
            >
                {scan == '' ? 'scan qr code' : scan}
            </Typography>
            <Scanner
                onScan={(code) => {
                    try {
                        const url = new URL(code[0].rawValue);

                        if(url.protocol === 'http:' || url.protocol === 'https:'){
                            // const _id = url.searchParams.get('gameId') ?? undefined;
                            const _code = url.searchParams.get('gameCode') ?? undefined;

                            if(_code){
                                setScan(_code); 
                                onSubmit(_code); 
                            }
                            else
                                setScan(msg)
                        }
                    } catch (_) {
                        setScan('invalid QR')
                    }
                }}
                onError={(error) => console.error(error)}
                styles={{
                    container: {
                        width: '100%',
                        height: '90%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: '3px',
                        backgroundColor: '#ffffff00'
                    },
                    video: {
                        width: '100%',
                        height: '100%',
                        objectFit: 'fill',
                    }
                }}
            />
        </Box>
    )
};

export default QRScanner; 