import React from 'react';
import { Avatar, Box,  Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@mui/material';
import BaseCard, {RewardBaseCard} from '../animations/BaseCard';
import type { Player } from '../assets/types';

type Props = {
    players: Player[]; 
}; 



const P1: Player = { game_id: '0',date: new Date(0),name: 'my name is',score: 1, lat: 0,lng: 0,icon: 'buffalo',uuid: '0'}
const P2: Player = { game_id: '0',date: new Date(0),name: 'p2',score: 1, lat: 0,lng: 0,icon: 'buffalo',uuid: '1'}
const P3: Player = { game_id: '0',date: new Date(0),name: 'p3',score: 1, lat: 0,lng: 0,icon: 'buffalo',uuid: '2'}

export const LeaderBoardCard: React.FC<Props> = ({players}) => {
    players = [P1, P2, P3,P1, P2, P3,P1, P2, P3,P1, P2, P3,P1, P2, P3,P1, P2, P3,P1, P2, P3,P1, P2, P3,P1, P2, P3,P1, P2, P3,P1, P2, P3,P1, P2, P3]; 

    return (
        <BaseCard
            style={{
                width: '250px',
                height: '350px',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 1,
                borderRadius: '5px',
                // 1. Semi-transparent background
                backgroundColor: 'rgba(255, 255, 255, 0.7)', 
                // 2. The "Frosted" effect
                backdropFilter: 'blur(12px) saturate(180%)',
                WebkitBackdropFilter: 'blur(12px) saturate(180%)', // Safari support
                // 3. Subtle border to define the edges
                border: '2px solid rgba(255, 255, 255, 0.1)',
                // 4. Soft shadow for depth
                boxShadow: '0px 0px 1px 2px rgba(255, 255, 255, 0.93)',
                color: '#000000ff',
            }}

            header={
                <Typography 
                    sx={{
                        color: '#000000ff',
                        alignContent: 'center',   
                        fontFamily: 'system-ui',
                        fontSize: '15px',
                        fontWeight: 'bold',
                        textShadow: '1px 1px 3px rgba(23, 23, 25, 0.7)'
                    }}
                >
                    {"Leader Board"}
                </Typography>
            }
            subheader={
                <Typography 
                    sx={{
                        color: 'rgb(0, 0, 0)',
                        alignContent: 'center',
                        fontFamily: 'system-ui',
                        fontSize: '12px',
                        pl: '10px'
                    }}
                >{`Sub Header or Game title`}</Typography>
            }
            content={
                <TableContainer sx={{overflowY: 'auto', height: '100%' }}>
                    <Table size="small" stickyHeader>
                        <TableBody>
                        {players.map((p, i) => (
                            <TableRow 
                            key={i} 
                            hover 
                            onClick={() => console.log("Clicked:", p.name)} 
                            sx={{ 
                                cursor: 'pointer', display: 'flex',
                                width: '95%',
                            }} 
                            >
                                
                                <TableCell sx={{ fontSize: '14px', width: '100%', display: 'flex', alignItems: 'center' }}>
                                    <Avatar 
                                        key={`pia_${i}`}
                                        variant="square"
                                        alt="UK" 
                                        src={`/icons/${p.icon}.png`}
                                        sx={{
                                            width:25, 
                                            height: 25,
                                            p: "0px", // Padding to keep the image away from the circle edge
                                            mr: '10px',
                                            "& img": {
                                                objectFit: "contain", // Ensures the full PNG is visible
                                                width: "100%",        // Forces image to respect container width
                                                height: "100%",        // Forces image to respect container height
                                                filter: "drop-shadow(2px 3px 2px rgba(0, 0, 0, 0.38))" // Shadow follows PNG shape
                                            }
                                        }}
                                        
                                    />
                                    {p.name}
                                </TableCell>
                                
                                <TableCell sx={{ fontSize: '10px', width: '25%' }} align="right">
                                    {p.score}
                                </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            }
        />
  );
};


// --------------------------------------------------------------------
import { Cancel } from '@mui/icons-material';
type PropCard = {}
export const RewardCard: React.FC<PropCard> = ({}) => {
    return (
        <Box>
        <RewardBaseCard
            style={{
                width: '250px',
                height: '350px',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 1,
                borderRadius: '5px',
                // 1. Semi-transparent background
                backgroundColor: 'rgba(255, 255, 255, 0.7)', 
                // 2. The "Frosted" effect
                backdropFilter: 'blur(12px) saturate(180%)',
                WebkitBackdropFilter: 'blur(12px) saturate(180%)', // Safari support
                // 3. Subtle border to define the edges
                border: '2px solid rgba(255, 255, 255, 0.1)',
                // 4. Soft shadow for depth
                boxShadow: '0 8px 32px 0 rgb(255, 255, 255)',
                color: '#000000ff',
            }}
            content={
                <Box sx={{bgcolor: 'yellow', width: '100%', height: '100%'}}>
                    <Box>
                        <Cancel/>
                    </Box>
                    
                    <Box sx={{alignContent: 'center'}}>
                        'Name'
                    </Box>
                </Box>
            }
            actions={
                <Box>Test</Box>
            }
        />
        </Box>
  );
};