import { EmojiEventsOutlined } from '@mui/icons-material';
import { Avatar, Backdrop, Box, Button, Grid, Menu, MenuItem, Typography, Divider
} from "@mui/material";
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
    const menuItemSx = {
        fontFamily: '"Inter", "Roboto", "Helvetica", sans-serif, sys',
        fontSize: '0.9rem',
        color: '#1a1a1a',
        letterSpacing: '0.05em',
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        opacity: 0.75,
        // Subtle offset and full clarity on hover
        '&:hover': {
            opacity: 1,
            transform: 'translateX(4px)',
        }
    };

    // const functions
    const handleClose = () => {
        setAnchorEl(null);
    };

    const socials = (img_name: string, link: string) => {
        return (
            <Button
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                    p: 0,
                    m: 0,
                    minWidth: 0,          // Removes default MUI button minimum width
                    width: 35,            // Matches Avatar size
                    height: 35,           // Matches Avatar size
                    borderRadius: 0,      // Keeps hover effect square to match "square" Avatar
                }}
            >
                <Avatar
                    alt={img_name}
                    src={`/${img_name}.png`}
                    variant="square"
                    sx={{ p: '5px', width: 35, height: 35 }}
                />
            </Button>
        );
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

                                {world.uuid ?
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
                    {world.uuid ? <Timer /> : <></>}
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
                sx={{
                    mt: 1
                }}
            >
                <Typography align='center' variant='subtitle1' fontWeight={'bold'}>
                    Menu
                </Typography>

                <Divider />
                
                { // Leader Board
                    world.uuid && <MenuItem 
                        onClick={() => {
                            handleClose();
                            setWorld(pre => ({
                                ...pre,
                                menu: 'leaderBoard'
                            }));
                        }}
                        sx={{minHeight: '35px' }}
                    >
                        <Typography sx={menuItemSx}>Leaderboard</Typography>
                    </MenuItem>
                }
                
                { // Quit Game
                    world.uuid && <MenuItem 
                        onClick={() => {
                            handleClose();
                            setWorld(pre => ({
                                ...pre,
                                uuid: undefined,
                                objectives: [],
                                players: [],
                                worldTime: 0,
                                selected: { mode: 'game', index: 0, path: 0 },
                                current: { index: 0, path: 0 },
                                player: {
                                    ...pre.player,
                                    score: 0
                                }
                            }));
                        }}
                        sx={{minHeight: '35px' }}
                    >
                        <Typography sx={menuItemSx}>Quit Game</Typography>
                    </MenuItem> 
                }

                { // Create a game
                    !world.uuid && <MenuItem 
                        onClick={() => {
                            handleClose();
                            setWorld(pre => ({
                                ...pre,
                                creationMode: {
                                    ...pre.creationMode,
                                    active: !world.creationMode.active
                                }
                            }));
                        }}
                        sx={{minHeight: '35px' }}
                    >
                        <Typography sx={menuItemSx}>
                            {   world.creationMode.active ? 
                                'Exit game creation' : 'Create a game'
                            }
                            
                        </Typography>
                    </MenuItem>
                }

                <MenuItem 
                    onClick={() => {
                        handleClose();
                        setWorld(pre => ({
                            ...pre,
                            page: 'feedback'

                        }));
                    }}

                    sx={{minHeight: '35px' }}
                >
                    <Typography sx={menuItemSx}>Feedback</Typography>
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        handleClose();
                        setWorld(pre => ({
                            ...pre,
                            reward: !pre.reward

                        }));
                    }}

                    sx={{ minHeight: '35px' }}
                >
                    <Typography sx={menuItemSx}>Test Reward</Typography>
                </MenuItem>
                <Divider/>

                <Grid container sx={{p: 0}}>
                    <Grid size={4} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>{socials('reddit', 'https://www.reddit.com/r/ScavengerHQ/')}</Grid>
                    <Grid size={4} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>{socials('patreon', 'https://www.patreon.com/c/ScavengerHQ')}</Grid>
                    <Grid size={4} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>{socials('instagram', 'https://www.instagram.com/scavenger.hq/?hl=en')}</Grid>
                </Grid>
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