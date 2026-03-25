import React, { useState, useEffect, type ReactNode } from 'react';
import { Box, CssBaseline, Paper, ThemeProvider, createTheme } from '@mui/material';
import { StartPage } from './pages/StartPage';
import {GameMap} from './components/map/GameMap';
import { LeaderBoard } from './components/LeaderBoard';
import type { Game, GameStates } from './assets/types';
import Done from './pages/DonePage';
import Timer from './components/Timer';
import { PostPlayer, GetPlayers } from './handlers/PlayerApiHandler';

const theme = createTheme();

export const App: React.FC = () => {
    const [game, setGame] = useState<Game | undefined>(undefined);
  
    // Monitor Game Scores
    useEffect(() => {
        if(game){
            if(game.player.score > 0){
                PostPlayer(game.player); 
                GetPlayers(game, setGame)
            }
        }
    }, [game?.player.score]); 

    // Enter fullscreen on first click anywhere
    document.addEventListener('click', () => {
        if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
        }
    }, { once: true });

    const States: Record<GameStates, ReactNode> = {
        start: <StartPage setGame={setGame} />,
        game: game ? 
        <Box sx={{position: 'relative'}}>
            <Timer game={game} setGame={setGame}/>
            <LeaderBoard game={game}/>
            <GameMap game={game} setGame={setGame} /> 
        </Box>
        : <>-_-</>,
        victory: <Done />,
        transition: undefined,
        loading: undefined
    };


    return (
        <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
            sx={{
            minHeight: '100dvh',
            minWidth: '100dvw',
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
            <Paper elevation={0} sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'transparent',
            p: 1
            }}>
            {States[game ? game.statue : 'start']}
            </Paper>
        </Box>
        </ThemeProvider>
    );
};