import React from "react";
import { Box, Button, CircularProgress } from "@mui/material";
import type { World} from "../assets/types";
import {LoadGames} from "../handlers/ApiHandler"; 
import { v4 as uuid } from 'uuid';

type Props = {
    world: World | undefined;
    setWorld: (world: World | undefined) => void; 
};

export const LoadWorldPage: React.FC<Props> = ({world, setWorld}) => {
    
    function Load() {
        if(!world){
            // Create a new world 
            const _world: World = {
                id: undefined, 
                description: '',
                current: 0,
                page: 'start',
                title: '',
                date: new Date(),
                trials:[],
                worldTime: 0,
                player: {game_id: '', date: new Date(Date.now()), uuid: uuid(), name: 'Unknown', score: 0, latitude: 0, longitude: 0, icon: 'cow'},
                players: [],
                games: undefined,
                loading: false
            };

            LoadGames(_world, setWorld); 
        }
        else if(!world.games){
            LoadGames(world, setWorld); 
        };
    }


    return (
        <Box
            sx={{
                height: '95dvh', 
                width: '95dvw',
                borderRadius: '10px',
            }}
        >
            <CircularProgress enableTrackSlot/>
            <Button
                onClick={() => Load()}
            >
            
                {world?.games ? "World Loaded" : "Loading Games..."}    
            </Button>
        </Box>
    );
   
}; 