import {useState, useEffect} from 'react'; 
import {Typography } from '@mui/material';
import type { World } from '../assets/types';

type Props = {
    world: World | undefined;  
    setWorld: (world: World) => void; 
}; 

export default function Timer({world, setWorld}: Props){
    const [time, setTime] = useState<number>(0); 

    useEffect(() => {
        if(world){
            setWorld({...world, worldTime: time})
        }
    }, [time]); 

    useEffect(() => {
        let interval: number | undefined; 

        if(world){
            interval = window.setInterval(() => {
                setTime(pre => pre + 1); 
            }, 1000); 
        };

        return () =>  window.clearInterval(interval); 
    }, [world]); 
    
    // formate time 
    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600); 
        const m = Math.floor((seconds % 3600) / 60); 
        const s = seconds % 60; 

        return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':'); 
    }; 


    return (
        <Typography variant="subtitle2" color='#0000007d'>
            {formatTime(time)}
        </Typography>
    );
}; 