import { useEffect} from 'react'; 
import {AccessAlarm} from '@mui/icons-material';
import {Typography, Box } from '@mui/material';
import { useWorld } from '../context';

export default function Timer(){
    const {world, setWorld} = useWorld(); 

    useEffect(() => {
        let interval: number | undefined; 

        if(world?.uuid){
            interval = window.setInterval(() => {
                setWorld(pre => ({...pre, worldTime: pre.worldTime + 1})); 
            }, 1000); 
        }
        else {
            setWorld(pre => ({...pre, worldTime: 0})); 
        }; 

        return () =>  window.clearInterval(interval); 
    }, [world?.uuid]); 
    
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
                display: "flex", 
                alignItems: "center", 
                fontFamily: 'system-ui', 
                color: '#0000007d', 
                bgcolor: '#fdfdfd45',
                borderRadius: '3px',
                boxShadow: '2px 2px 5px #00000023',
                p: '3px'
            }}
        >
            <AccessAlarm sx={{fontSize: '15px', ml: '2px'}}/>
            <Typography sx={{fontSize: '12px', mb: '-5px'}}>
                {formatTime(world?.worldTime ?? 0)}
            </Typography>
        </Box>
    );
}; 