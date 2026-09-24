import React, {useState} from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { Box, Typography } from '@mui/material';

type Props = {
    OnSubmit?: (v: boolean, p: number) => void; 
    responses?: string[]; 
    getValue?: (v: string) => void; 
};

const QRScanner: React.FC<Props> = ({OnSubmit, responses, getValue}) => {
    const [_, setPass] = useState<boolean>(false);
    const [scan, setScan] = useState<string>("");
    

    const handleScan = (rawValue: string): [boolean, number] => {
        setScan(rawValue); 

        if(getValue) getValue(rawValue); 

        if (!responses) return [false, 0]; 

        // ----------
        const validate = (code: string): [boolean, number] => {
            if (code.trim() == "") return [false, 0];

            code = code.toLocaleLowerCase();

            // check for wild card
            if (responses.includes("-")) {
                return [true, responses.indexOf('-')];
            }

            if (responses.includes(code)) {
                return [true, responses.indexOf(code)]
            }

            return [false, 0]
        }; 
    
        try {
            // check if it's a url
            const url = new URL(rawValue);

            // is mine
            if(url.protocol === 'http:' || url.protocol === 'https:'){
                const _code = url.searchParams.get('gameCode') ?? undefined;

                if(_code) return validate(_code);
            }; 

            return validate(rawValue);
        } catch (error) {
            // still check
            return validate(rawValue);
        }        
    }; 
    
    return (
        <Box
            sx={{
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '100%',
            }}
        >

            <Box sx={{
                    position: 'absolute',
                    zIndex: 1,
                    width: '75%',
                    overflowX: 'auto',
                    pl: 1
                }}>
                    <Typography
                        variant='caption'
                        noWrap
                        sx={{
                            fontFamily: 'system-ui',
                            textShadow: '0px 1px 1px rgba(225, 240, 250, 0.5)',
                        }}
                    >
                        {scan}
                    </Typography>
            </Box>
            <Scanner
                
                onScan={(code) => {
                    const _pass = handleScan(code[0].rawValue); 
                    setPass(_pass[0]); 

                    if(OnSubmit){
                        OnSubmit(_pass[0], _pass[1]); 
                    };
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