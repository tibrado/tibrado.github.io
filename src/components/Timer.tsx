import { useEffect} from 'react'; 
import {Typography } from '@mui/material';
import { useWorld } from '../context';

export default function Timer(){
    const {world, setWorld} = useWorld(); 

    useEffect(() => {
        let interval: number | undefined; 

        if(world?.id){
            interval = window.setInterval(() => {
                setWorld(pre => ({...pre, worldTime: pre.worldTime + 1})); 
            }, 1000); 
        }
        else {
            setWorld(pre => ({...pre, worldTime: 0})); 
        }; 

        return () =>  window.clearInterval(interval); 
    }, [world?.id]); 
    
    // formate time 
    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600); 
        const m = Math.floor((seconds % 3600) / 60); 
        const s = seconds % 60; 

        return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':'); 
    }; 


    return (
        <Typography variant="subtitle2" color='#0000007d'>
            {formatTime(world?.worldTime ?? 0)}
        </Typography>
    );
}; 