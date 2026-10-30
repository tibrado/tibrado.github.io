import React from 'react';
import { Avatar, Box,  Chip,  Stack,  Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@mui/material';
import { QrCode } from '@mui/icons-material';
import BaseCard, {RewardBaseCard} from '../animations/BaseCard';
import type { Player, LatLng } from '../assets/types';

type Props = {
    players: Player[]; 
}; 



const loc: LatLng = {
    latitude: 0,
    longitude: 0
}
const P1: Player = { game_uuid: '0',date: new Date(0),name: 'my name is',score: 1, location: loc, icon: 'buffalo',uuid: '0'}
const P2: Player = { game_uuid: '0', date: new Date(0), name: 'p2', score: 1, location: loc,icon: 'buffalo',uuid: '1'}
const P3: Player = { game_uuid: '0', date: new Date(0), name: 'p3', score: 1, location: loc,icon: 'buffalo',uuid: '2'}

export const LeaderBoardCard: React.FC<Props> = ({players}) => {
    players = [P1, P2, P3,P1, P2, P3,P1, P2, P3,P1, P2, P3,P1, P2, P3,P1, P2, P3,P1, P2, P3,P1, P2, P3,P1, P2, P3,P1, P2, P3,P1, P2, P3,P1, P2, P3]; 

    players.forEach(p => p.score = Math.floor(Math.random() * 100))
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
import { Language } from '@mui/icons-material';
type PropCard = {}
export const RewardCard: React.FC<PropCard> = ({}) => {
    return (
        <Box>
        <RewardBaseCard
                style={{
                width: '300px',
                height: '460px',
                position: 'relative',
                borderRadius: 4,
                boxShadow: '0px 10px 30px rgba(0,0,0,0.15)',
                background: '#ffffff',
                overflow: 'hidden',
                fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
            }}
            content={
                <>
                
                    {/* FOREGROUND CONTENT LAYER */}
                    <Box sx={{ position: 'relative', zIndex: 2, p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>

                        {/* 1. Header Logo */}
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                            <Stack spacing={0.2} sx={{ alignItems: 'flex-start' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                                    {/* Custom Mini Icon Grid Representing the colorful abstract icon */}
                                    <Box sx={{ width: 14, height: 14, background: '#E040FB', borderRadius: '50% 50% 0 50%' }} />
                                    <Box sx={{ width: 14, height: 14, background: '#00E676', borderRadius: '50% 50% 50% 0' }} />
                                </Box>
                                <Typography variant="caption" sx={{ fontWeight: 900, color: '#111', fontSize: '0.55rem', tracking: 1 }}>
                                    GRAPHICSFAMILY
                                </Typography>
                            </Stack>
                        </Box>


                        {/* 2. Centered Hexagonal Profile Picture Frame */}
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1, mb: 1 }}>
                            <Box
                            >
                                <Box
                                    sx={{
                                        width: 200,
                                        height: 200,
                                        background: '#eee',
                                        overflow: 'hidden',
                                    }}
                                >
                                    <Avatar
                                        src="https://ecdn.teacherspayteachers.com/cdn-cgi/image/format=avif,quality=70,onerror=redirect/thumbitem/Ratio-Pixel-Project-Yoshi--8646329-1665421446/750f-8646329-1.jpg"
                                        alt="Angel Rose"
                                        sx={{ width: '100%', height: '100%', borderRadius: 0, objectPosition: 'top center' }}
                                    />
                                </Box>
                            </Box>
                        </Box>
                        
                        {/* 3. QR Code Placement */}
                        <Box sx={{  position: 'absolute' }}>
                            <Box
                                sx={{
                                    background: '#ffffff',
                                    p: 0.5,
                                    borderRadius: 1,
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <QrCode sx={{ fontSize: 62, color: '#1A1A1A' }} />
                            </Box>
                        </Box>

                        
                        {/* 4. Identity & Core Personal Details */}
                        <Stack spacing={1} sx={{ alignItems: 'center', textAlign: 'center', mt: 'auto', mb: 0 }}>
                            <Typography
                                variant="h4"
                                sx={{
                                    fontWeight: 900,
                                    textTransform: 'uppercase',
                                    letterSpacing: 1.5,
                                    color: '#000000',
                                    fontSize: '1.3rem',
                                }}
                            >
                                Angel Rose
                            </Typography>
        
                            <Chip
                                label="Graphic Designer"
                                sx={{
                                    background: 'linear-gradient(90deg, #4A154B 0%, #D45025 100%)',
                                    color: '#ffffff',
                                    fontWeight: 'bold',
                                    px: 3,
                                    py: 2,
                                    borderRadius: 1.5,
                                    fontSize: '0.95rem',
                                    textTransform: 'capitalize',
                                    boxShadow: '0 4px 10px rgba(212,80,37,0.3)'
                                }}
                            />
        
                            <Stack spacing={0.5} sx={{ mt: 3, width: '100%', px: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#444' }}>
                                        ID :
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 500, color: '#222', letterSpacing: 0.5 }}>
                                        102030405060708090100
                                    </Typography>
                                </Box>
        
                                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#444' }}>
                                        Email :
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 500, color: '#222' }}>
                                        example@gmail.com
                                    </Typography>
                                </Box>
                            </Stack>
                        </Stack>
                    </Box>


                    {/* 5. Footer Brand Bar */}
                    <Box
                        sx={{
                            position: 'relative',
                            zIndex: 3,
                            background: '#F5E6DC',
                            py: 1,
                            px: 3,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderTop: '1px solid rgba(0,0,0,0.05)'
                        }}
                    >
                        {/* Left Side Curved Accent Circle inside the footer */}
                        <Box
                            sx={{
                                position: 'absolute',
                                left: -15,
                                bottom: -5,
                                width: 60,
                                height: 50,
                                background: 'linear-gradient(135deg, #4A154B, #2D0B30)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                paddingLeft: 1.5
                            }}
                        >
                            <Language sx={{ color: '#ffffff', fontSize: 20 }} />
                        </Box>

                        <Typography
                            variant="body2"
                            sx={{
                                fontWeight: 600,
                                color: '#3A2010',
                                fontSize: '0.85rem',
                                letterSpacing: 0.5
                            }}
                        >
                            www.graphicsfamily.com
                        </Typography>
                    </Box>

                </>
            }
            actions={
                <Box>Test</Box>
            }
        />
        </Box>
  );
};


