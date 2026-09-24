import { EmojiEventsOutlined } from '@mui/icons-material';
import { Avatar, Backdrop, Box, Button, Grid, Menu, MenuItem, Typography } from "@mui/material";
import React, { type ReactNode } from "react";
import type { MenuOptions } from "../assets/types";
import { useWorld } from "../context";
import LeaderBoard from './LeaderBoard';
import Timer from "./Timer";

//--------------------------------------------------------------------------------//
function GameMenu() {
    const { world, setWorld } = useWorld();

    if (!world) return;

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Box
            sx={{
                zIndex: 1,
                position: 'absolute', // Locks it relative to the container
                width: '100%',
                pointerEvents: 'none'
            }}
        >
            <Grid container spacing={1}>
                <Grid size={4}
                    sx={{
                        display: 'flex',
                        justifyContent: 'left',
                        alignItems: 'center'
                    }}
                >
                    <Button
                        onClick={(e) => setAnchorEl(e.currentTarget)}
                        sx={{
                            pointerEvents: 'auto'
                        }}
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
                                        filter: "drop-shadow(0px 3px 10px rgba(15, 143, 232, 1))" // Shadow follows PNG shape
                                    }
                                }}
                            />
                        }
                        children={
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    fontFamily: 'system-ui',
                                    color: '#0000007d',
                                    bgcolor: '#fdfdfd45',
                                    borderRadius: '3px',
                                    boxShadow: '2px 2px 5px #00000023',
                                    p: '2px'
                                }}
                            >

                                {world.id ?
                                    <>
                                        <EmojiEventsOutlined sx={{ fontSize: '15px', ml: '2px' }} />
                                        <Typography
                                            sx={{
                                                mb: '-3px',
                                                mr: '5px',
                                                fontSize: '12px'
                                            }}
                                        >
                                            {world.player.score}
                                        </Typography>
                                    </> : <></>
                                }
                            </Box>

                        }
                    />
                </Grid>

                <Grid size={4}
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    {world.id ? <Timer /> : <></>}
                </Grid>

                <Grid size={4}
                    sx={{
                        display: 'flex',
                        justifyContent: 'right',
                        alignItems: 'right'
                    }}
                >
                </Grid>
            </Grid>


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
                    setWorld(pre => ({
                        ...pre,
                        id: undefined,
                        trials: [],
                        players: [],
                        worldTime: 0,
                        selected: { mode: 'game', index: 0, path: 0 },
                        current: { index: 0, path: 0 },
                        player: {
                            ...pre.player,
                            score: 0
                        }

                    }));
                }}>Quit Game</MenuItem>

                {/*
                <MenuItem onClick={() => {
                    handleClose();
                    setWorld(pre => ({
                        ...pre,
                        id: undefined,
                        trials: [],
                        players: [],
                        worldTime: 0,
                        selected: { mode: 'game', index: 0, path: 0 },
                        current: { index: 0, path: 0 },
                        player: {
                            ...pre.player,
                            score: 0
                        }

                    }));
                }}>
                    <FormControlLabel
                        control={
                            <Checkbox checked={false} onChange={undefined} name="antoine" />
                        }
                        label="Quester"
                    />
                </MenuItem>
                */}
            </Menu>

        </Box>
    )

};

export default GameMenu;

//------------------------------------Menu Backdrop--------------------------------------------//
export function GameMenuItem() {
    const { world, setWorld } = useWorld();

    if (!world?.menu) return;

    const handleClose = () => {
        setWorld(pre => ({ ...pre, menu: 'none' }));
    };

    const Menus: Record<MenuOptions, ReactNode> = {
        none: <></>,
        leaderBoard: <LeaderBoard />
    };

    return (
        <Backdrop
            sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
            open={world?.menu != 'none'}
            onClick={handleClose}
        >
            {Menus[world.menu]}
        </Backdrop>
    )
}; 