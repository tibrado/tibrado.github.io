import React from "react";
import { Box, CircularProgress, Typography, Backdrop } from '@mui/material';
export type LoadStatus = {
    map: boolean; 
    games: boolean;
    leaderboard: boolean;
};


type Props = {
    load: boolean;
};
export const LoadWorldPage: React.FC<Props> = ({load}) => {

    return (
        <Backdrop
            open={load}
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
        </Box>
  
        
        <Typography variant="caption" sx={{ mt: 10, fontStyle: 'italic', opacity: 0.5 }}>
            "Tip: Keep your eyes on the prize!"
        </Typography>

        </Backdrop>
    );
   
}; 