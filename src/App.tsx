import React, { useState, useEffect, type ReactNode } from 'react';
import { Box, CssBaseline, Paper, ThemeProvider, createTheme } from '@mui/material';
import { StartPage } from './pages/StartPage';
import {GameMap} from './components/map/GameMap';
import type { Page, PlayerIcon } from './assets/types';
import Done from './pages/DonePage';
import { PostPlayer, GetPlayers } from './handlers/ApiHandler';
import { LoadWorldPage } from './pages/LoadPage';
import GameMenu, {GameMenuItem} from './components/GameMenu';
import GameCreationMode from './components/GameCreationMode';
import { v4 as uuid } from 'uuid';
import { useWorld } from './context';

import { PhotoBooth } from './components/inputs/CameraInputHandler';

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
            uuid: _id,
            page: 'game',
            player: {
                game_id: _id ?? '', 
                date: new Date(Date.now()), 
                uuid: uuid(), 
                name: name, 
                score: 0, 
                location: {
                    latitude: 0,
                    longitude: 0
                },
                icon: icon as PlayerIcon
            }
        })); 
        setLoading(true); 
    }; 

    // Monitor Game Scores
    useEffect(() => {
        if(world){
            if(world.player.score > 0){
                PostPlayer(world.player); 
                GetPlayers(world, setWorld)
            }
        }
    }, [world?.player.score]); 

    // ------------------------------
    const Pages: Record<Page, ReactNode> = {
        start: <StartPage onStart={OnStart} />,
        game: world ? 
            <Box sx={{position: 'relative'}}>
                <GameMenu/>
                <GameMap/> 
                <GameCreationMode/>
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
                backgroundColor:'transparent',
                border: world.creationMode.active && world.page != 'start' ? '1px solid #b2102f' : undefined, // #b2102f
                boxShadow: world.creationMode.active && world.page != 'start' ? `0px 0px 10px #b2102f` : undefined,
                borderRadius: '5px',
                p: world.page == 'start' ? 1 : 0
            }}>
                {Pages[world ? world.page : 'start']}
            </Paper>
        </Box> : <>
        <Paper elevation={0} sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'green',
                p: 1
            }}>
                <PhotoBooth/>
            </Paper>
        </>}
        </ThemeProvider>
    );
};