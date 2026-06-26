import React, { type ReactNode } from "react";
import {Menu, MenuItem, Box, Button, Avatar, Backdrop} from "@mui/material"; 
import type { MenuOptions } from "../assets/types";
import Timer from "./Timer";
import LeaderBoard from './LeaderBoard';
import { useWorld } from "../context";

//--------------------------------------------------------------------------------//
function GameMenu() {
    const {world, setWorld} = useWorld(); 

    if(!world) return; 
    
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Box
            sx={{
                zIndex: 1, 
                top: 5,
                left: 5, 
                position: 'absolute', // Locks it relative to the container
                width: '100px',
                backgroundColor: 'rgba(248, 159, 6, 0)',
                color: '#f32121'
            }}
        >
            <Button
                onClick={(e) => setAnchorEl(e.currentTarget)}
                startIcon={
                    <Avatar 
                        alt="UK" 
                        src={`/player_icons/${world.player.icon}.png`}
                        sx={{
                            width: { xs: 40, md: 40, lg: 40 }, 
                            height: { xs: 40, md: 40, lg: 40 },
                            p: "5px", // Padding to keep the image away from the circle edge
                            "& img": {
                                objectFit: "contain", // Ensures the full PNG is visible
                                width: "100%",        // Forces image to respect container width
                                height: "100%",        // Forces image to respect container height
                                filter: "drop-shadow(0px 0px 2px rgba(0, 0, 0, 0.5))" // Shadow follows PNG shape
                            }
                        }}
                    />
                }
            >
                {world.id ? <Timer/> : <></>}
            </Button>

            <Menu
                id="menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                {/*OLeader Board */}
                <MenuItem onClick={() => {
                    handleClose(); 
                    setWorld(pre => ({
                        ...pre,
                        menu: 'leaderBoard'
                    }));
                }
                }>Leaderboard</MenuItem>
                <MenuItem onClick={() => {
                    handleClose(); 
                    setWorld( pre => ({
                        ...pre, 
                        id: undefined,
                        trials: [],
                        players: [],
                        worldTime: 0,
                        selected: {mode: 'game', index: 0, path: 0},
                        current: {index: 0, path: 0}
                    }));
                }}>Quit Game</MenuItem>
            </Menu>
            
        </Box>
    )

}; 

export default GameMenu;

//------------------------------------Menu Backdrop--------------------------------------------//
export function GameMenuItem(){
    const {world, setWorld} = useWorld(); 

    if(!world?.menu) return; 

    const handleClose = () => {
        setWorld(pre => ({...pre, menu: 'none'})); 
    }; 

    const Menus: Record<MenuOptions, ReactNode> = {
        none: <></>,
        leaderBoard: <LeaderBoard/> 
    };

    return(
        <Backdrop
            sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
            open={world?.menu != 'none'}
            onClick={handleClose}
        >
            {Menus[world.menu]}
        </Backdrop>
    )
}; 