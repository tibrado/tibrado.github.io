import {useState, useEffect} from 'react'; 
import { Box, Typography } from '@mui/material';

type Props = {
    active: boolean;  
    getTime: (time: number) => void; 
}; 

export default function Timer({active, getTime}: Props){
    const [time, setTime] = useState<number>(0); 

    useEffect(() => {getTime(time)}, [time]); 

    useEffect(() => {
        let interval: number | undefined; 

        if(active){
            interval = window.setInterval(() => {
                setTime(pre => pre + 1); 
            }, 1000); 
        };

        return () =>  window.clearInterval(interval); 
    }, [active]); 
    
    // formate time 
    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600); 
        const m = Math.floor((seconds % 3600) / 60); 
        const s = seconds % 60; 

        return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':'); 
    }; 


    return (
        <Box
            sx={{
                position: 'absolute', // Locks it relative to the container
                top: 10,
                left: '42%',
                zIndex: 1,           // Ensures it stays above the map
                pl: 1, pr: 2, pb: 0,
                width: '100px',
                height: '25px',
                pointerEvents: 'none',
                textAlign: 'center',
                borderRadius: '5px',
                border: '1px solid #00000000'

            }}
        >
            <Typography
                color='black'
                gutterBottom
            >{formatTime(time)}</Typography>
        </Box>
    );
}; 