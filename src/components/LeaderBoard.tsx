import React, {useEffect, useState} from 'react'; 
import {Box, Table, TableBody, TableCell, TableContainer, TableRow, Typography} from '@mui/material';
import type { Game, Player } from '../assets/types'; 

type Props = {
    game: Game
    //setGame: (game: Game) => void;  
}; 

export const LeaderBoard: React.FC<Props> = ({game}) => {
    const [leaders, setLeaders] = useState<Player[]>([]); 
    const [showBoard, setShowBoard] = useState<boolean>(false); 

    // updates
    useEffect(() => {
        if(game.players.length > 0){
            setLeaders([...game.players, game.player]);
        }; 
    }, [game.players, game.player]); 

    const createBoard = () => {
        return (
            <TableContainer>
                <Typography 
                    variant="subtitle2" 
                    sx={{ 
                        padding: '8px', 
                        cursor: 'pointer', 
                        '&:hover': { color: 'primary.main' },
                        fontWeight: 'bold'
                    }}
                    onClick={() => setShowBoard(!showBoard)}
                >
                    Leaderboard
                </Typography>
                {  showBoard ? 
                    <Table size="small">
                        <TableBody>
                            {leaders
                            .sort((a, b) => b.score - a.score)
                            .map((p, i) => (
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
          color: '#2196f3'
        }}>
            {createBoard()}            
        </Box>
    ); 
}; 