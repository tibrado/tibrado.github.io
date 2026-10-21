import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Typography, Backdrop } from '@mui/material';
import { GpsHandler } from "../handlers/GpsHandler";
import type { LatLng, AppPermissionOptions } from "../assets/types";
import { useWorld } from "../context";
import { GetGames } from "../handlers/ApiHandler";
import { GetTutorialGameInfo } from "../handlers/Tutorial";
import Dialog from "../components/Dialog";

export type LoadStatus = {
    map: boolean;
    games: boolean;
    leaderboard: boolean;
};


type Props = {
    loading: boolean;
    setLoading: (loading: boolean) => void;
};
export const LoadWorldPage: React.FC<Props> = ({ loading, setLoading }) => {
    const { world, setWorld } = useWorld();
    const [gps, setGps] = useState<LatLng | undefined>();
    const [gpsFail, setGpsFail] = useState<boolean>(false);
    const [status, setStatus] = useState<AppPermissionOptions>('prompt');

    const noGps: boolean = (status === 'denied' || 'error' || 'unsupported') && gpsFail;

    function updatePlayerGPS(lat: number, lng: number){
        setWorld(pre => ({
            ...pre,
            player: {
                ...pre.player,
                location: {
                    ...pre.player.location,
                    latitude: lat,
                    longitude: lng,
                    noGps: noGps
                },
            }
        }));

        // Exit Load Page
        GetGames(
            setWorld, 
            GetTutorialGameInfo(lat, lng), 
            {latitude: lat, longitude: lng}
        );

        setLoading(false);
    };

    useEffect(() => {
        GpsHandler(setStatus, setGps); 

        const timer = setTimeout(() => {
            setGpsFail(true)
        }, 10000); 

        return () => clearTimeout(timer); 
    }, []);

    useEffect(() => {
        if (!gps) return;

        if (gps && world) {
            updatePlayerGPS(gps.latitude, gps.longitude);
        }
    }, [gps]);


    return (
        <Backdrop
            open={loading}
            sx={{
                backgroundColor: 'hsla(230, 59%, 25%, 1)', // fallback
                backgroundImage: 'linear-gradient(180deg, hsla(230,59%,25%,1) 0%, hsla(359,73%,39%,1) 70%, hsla(32,97%,59%,1) 100%)',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                color: 'white',
                zIndex: (theme) => theme.zIndex.drawer + 1,
                flexDirection: 'column',
            }}
        >{
            noGps
            ? <Dialog 
                title={`GPS ACCESS ${status.toLocaleUpperCase()}`} 
                message={"Some game features require location services. A full experience cannot be guaranteed without GPS enabled."} 
                handleResponse={() => updatePlayerGPS(0, 0)} 
                trueText="Accept" 
            />
            : <>
                <Box sx={{ mb: 4, textAlign: 'center' }}>
                    <CircularProgress size={60} enableTrackSlot thickness={4} sx={{ color: '#ffffff' }} />
                    <Typography variant="h5" sx={{ mt: 2, fontWeight: 'bold', letterSpacing: 2 }}>
                        LOADING WORLD
                    </Typography>
                </Box>


                <Typography variant="caption" sx={{ mt: 10, fontStyle: 'italic', opacity: 0.5 }}>
                    "Tip: Keep your eyes on the prize!"
                </Typography>
            </>
        }</Backdrop>
    );

}; 