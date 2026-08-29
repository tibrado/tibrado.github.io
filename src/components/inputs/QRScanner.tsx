import React, {useState} from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { Box, Typography } from '@mui/material';

type Props = {
    OnSubmit: (v: boolean, p: number) => void; 
    responses: string[]; 
    hint?: string; 
};

const QRScanner: React.FC<Props> = ({OnSubmit, responses, hint}) => {
    const [pass, setPass] = useState<boolean>(false);
    
    const validate = (code: string): [boolean, number] => {
        if(code.trim() == "") return [false, 0]; 

        code = code.toLocaleLowerCase(); 

        // check for wild card
        if(responses.includes("-")) {
            return [true, responses.indexOf('-')]; 
        }
        
        if(responses.includes(code)){
            return [true, responses.indexOf(code)]
        }
        
        return  [false, 0]
    }; 

    const handleScan = (rawValue: string): [boolean, number] => {
        console.log(rawValue)
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
                height: '100%'
            }}
        >
            <Typography 
                variant='caption'
                sx={{
                    pl: 1, 
                    fontFamily: 'system-ui',
                    textShadow: '0px 1px 5px rgba(0, 0, 0, 0.5)',
                    color: `${pass ? 'red' : '#000000e1'}`
                }}
            >
                {hint}
            </Typography>
            <Scanner
                onScan={(code) => {
                    const _pass = handleScan(code[0].rawValue); 
                    setPass(_pass[0]); 

                    if(_pass){
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