import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Typography, Backdrop } from '@mui/material';
import { GpsHandler } from "../handlers/GpsHandler";
import { PermissionStatus } from "../handlers/PermissionStatus";
import type { Coordinates, AppPermissionOptions} from "../assets/types";
import { useWorld } from "../context";

export type LoadStatus = {
    map: boolean; 
    games: boolean;
    leaderboard: boolean;
};


type Props = {
    loading: boolean; 
    setLoading: (loading: boolean) => void; 
};
export const LoadWorldPage: React.FC<Props> = ({loading, setLoading}) => {
    const {world, setWorld} = useWorld(); 
    const [gps, setGps] = useState<Coordinates | undefined>(); 
    const [status, setStatus] = useState<AppPermissionOptions>('prompt'); 

    useEffect(() => {
        GpsHandler(setStatus, setGps)
    }, []); 
    
    useEffect(() => {
        if (!gps) return;

        if(gps && world){
            setWorld(pre => ({
                ...pre,
                player:{
                    ...world.player,
                    lat: gps.latitude,
                    lng: gps.longitude
                }
            })); 

            setLoading(false); 
        };
    }, [gps]); 

    return (
        <Backdrop
            open={loading}
            sx={{
                backgroundColor: 'hsla(230, 59%, 25%, 1)', // fallback
                backgroundImage: 'linear-gradient(180deg, hsla(230,59%,25%,1) 0%, hsla(359,73%,39%,1) 70%, hsla(32,97%,59%,1) 100%)',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                color:'white',
                zIndex: (theme) => theme.zIndex.drawer + 1,
                flexDirection: 'column',
            }}
        >
            {/* Decorative Icon or Logo */}
            <Box sx={{ mb: 4, textAlign: 'center' }}>
                <CircularProgress size={60} enableTrackSlot  thickness={4} sx={{ color: '#ffffff' }} />
                <Typography variant="h5" sx={{ mt: 2, fontWeight: 'bold', letterSpacing: 2 }}>
                    LOADING WORLD
                </Typography>
                {/* Gps Status*/}
                <PermissionStatus what="GPS" status={status} prompt="looking for gps" denied="app gps access denied"/>
            </Box>
        
        
            <Typography variant="caption" sx={{ mt: 10, fontStyle: 'italic', opacity: 0.5 }}>
                "Tip: Keep your eyes on the prize!"
            </Typography>
        </Backdrop>
    );
   
}; 