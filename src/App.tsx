import React, { useState, useEffect, type ReactNode } from 'react';
import { Box, CssBaseline, Paper, ThemeProvider, createTheme } from '@mui/material';
import { StartPage } from './pages/StartPage';
import {LeaderBoardCard, RewardCard} from './pages/TestingPage';
import {GameMap} from './components/map/GameMap';
import type { Page, PlayerIcon } from './assets/types';
import Done from './pages/DonePage';
import { PostPlayer, GetPlayers } from './handlers/ApiHandler';
import { LoadWorldPage } from './pages/LoadPage';
import GameMenu, {GameMenuItem} from './components/GameMenu';
import { v4 as uuid } from 'uuid';
import { LoadGames } from './handlers/ApiHandler';
import { useWorld } from './context';

const theme = createTheme();
const TESTING: boolean = false; 

export const App: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(false); 
    const {world, setWorld} = useWorld(); 

    const OnStart = (name: string, icon: PlayerIcon) => {
        const params = new URLSearchParams(window.location.search); 
        const _id = params.get('gameId') ?? undefined;

        setWorld(pre => ({
            ...pre,
            id: _id,
            page: 'game',
            player: {game_id: _id ?? '', date: new Date(Date.now()), uuid: uuid(), name: name, score: 0, latitude: 0, longitude: 0, icon: icon as PlayerIcon}
        })); 
        
        LoadGames(setWorld); 
        setLoading(true); 
    }; 
    // check if world was updated 
    useEffect(() => {
        if(world && loading){
            
        }; 
    }, [world])

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

    // ------------------------------
    const Pages: Record<Page, ReactNode> = {
        start: <StartPage onStart={OnStart} />,
        game: world ? 
            <Box sx={{position: 'relative'}}>
                <GameMenu/>
                <GameMap/> 
            </Box>
        : <>World does not exists.</>,
        end: <Done />
    };

    // ---------------------------------
    return (
        <ThemeProvider theme={theme}>
        <CssBaseline />
        {!TESTING ? 
        <Box>
            {loading ? <LoadWorldPage loading={loading} setLoading={setLoading}/> : <></>}
            {<GameMenuItem/>}
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
        </Box> : <>Testing</>}
        </ThemeProvider>
    );
};