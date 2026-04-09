import React, {useEffect, useState} from 'react'; 
import {Box, Table, TableBody, TableCell, TableContainer, TableRow, Typography, Avatar} from '@mui/material';
import type { World, Player } from '../assets/types'; 
import Timer from './Timer';
type Props = {
    world: World
    setWorld: (world: World) => void;  
}; 

export const LeaderBoard: React.FC<Props> = ({world, setWorld}) => {
    const [leaders, setLeaders] = useState<Player[]>([]); 
    const [showBoard, setShowBoard] = useState<boolean>(false); 

    // updates
    useEffect(() => {
        if(world.players.length > 0){
            const _leads: Player[] = world.players.sort((a, b) => b.score - a.score).slice(0, 3)

            if(_leads[2])
            setLeaders([..._leads.slice(0, 3), world.player]);
        }; 
    }, [world.players, world.player]); 

    const createBoard = () => {
        return (
            <TableContainer>
                <Typography 
                    variant="subtitle2" 
                    sx={{ 
                        display: 'flex',       // Enables flexbox
                        alignItems: 'center',  // Vertically centers timer and avatar
                        gap: '1px',           // Adds space between them
                        padding: '1px', 
                        cursor: 'pointer', 
                        '&:hover': { color: 'primary.main' },
                        fontWeight: 'bold'
                    }}
                    onClick={() => setShowBoard(!showBoard)}
                >
                     <Avatar 
                        alt="UK" 
                        src={`/icons/${world.player.icon}.png`}
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
                    <Timer world={world} setWorld={setWorld}/>
                </Typography>
                {  showBoard ? 
                    <Table size="small">
                        <TableBody>
                            {leaders.map((p, i) => (
                                <TableRow
                                    key={i}
                                    hover
                                    onClick={() => console.log("Clicked:", p.name)}
                                    sx={{ cursor: 'pointer'}}
                                >
                                    <TableCell sx={{fontSize: '10px'}}>{i + 1}</TableCell>
                                    <TableCell sx={{fontSize: '10px'}}>{p.name}</TableCell>
                                    <TableCell sx={{fontSize: '10px'}} align="right">{p.score}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table> : <></>
                }
            </TableContainer>
        ); 
    };

    return (
        <Box 
            sx={{
            position: 'absolute', // Locks it relative to the container
            top: 10,
            left: 1,
            zIndex: 1,           // Ensures it stays above the map
            pl: 1, pr: 2, pb: 0,
            width: '200px',
            backgroundColor: 'rgba(248, 159, 6, 0.01)',
            color: '#f32121'
            }}
        >
            
            {createBoard()}            
        </Box>
    ); 
}; 