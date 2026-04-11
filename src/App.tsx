import React, { useState, useEffect, type ReactNode } from 'react';
import { Box, CssBaseline, Paper, ThemeProvider, createTheme } from '@mui/material';
import { StartPage } from './pages/StartPage';
import {GameMap} from './components/map/GameMap';
import { LeaderBoard } from './components/LeaderBoard';
import type { World, Page } from './assets/types';
import Done from './pages/DonePage';
import { PostPlayer, GetPlayers } from './handlers/ApiHandler';
import { LoadWorldPage } from './pages/LoadPage';

const theme = createTheme();

export const App: React.FC = () => {
    const [world, setWorld] = useState<World | undefined>(undefined);

    // Monitor Game Scores
    useEffect(() => {
        if(world){
            if(world.player.score > 0){
                PostPlayer(world.player); 
                GetPlayers(world, setWorld)
            }
        }
    }, [world?.player.score]); 

    // Enter fullscreen on first click anywhere
    /*
    document.addEventListener('click', () => {
        if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
        }
    }, { once: true });
    */
    const Pages: Record<Page, ReactNode> = {
        start: <StartPage setWorld={setWorld} />,
        game: world ? 
            <Box sx={{position: 'relative'}}>
                <LeaderBoard world={world} setWorld={setWorld}/>
                <GameMap world={world} setWorld={setWorld} /> 
            </Box>
        : <>World does not exists.</>,
        end: <Done />,
    };


    return (
        <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
            sx={{
                minWidth: '100dvw',
                minHeight: '100dvh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'hsla(230, 59%, 25%, 1)', // fallback
                backgroundImage: 'linear-gradient(180deg, hsla(230,59%,25%,1) 0%, hsla(359,73%,39%,1) 70%, hsla(32,97%,59%,1) 100%)',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                overflow: 'hidden'
            }}
        >
            
            <LoadWorldPage load={world?.loading ?? false}/>
            <Paper elevation={0} sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'transparent',
                p: 1
            }}>
                {Pages[world ? world.page : 'start']}
            </Paper>
        </Box>
        </ThemeProvider>
    );
};