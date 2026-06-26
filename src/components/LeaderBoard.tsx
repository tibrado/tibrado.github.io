import {Table, TableBody, TableCell, TableContainer, TableRow, Typography, Avatar, Backdrop} from '@mui/material';
import { useWorld } from '../context';
import BaseCard from '../animations/BaseCard';

function LeaderBoard(){
    const {world} = useWorld(); 
    return (
        <Backdrop
            sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
            open={true}
            onClick={undefined}
        >
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
                >{'You\'re #1 to someone'}</Typography>
            }
            content={
                <TableContainer sx={{overflowY: 'auto', height: '100%' }}>
                    <Table size="small" stickyHeader>
                        <TableBody>
                        {world.players.map((p, i) => (
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
                                        src={`/player_icons/${p.icon}.png`}
                                        sx={{
                                            width:25, 
                                            height: 25,
                                            p: "0px", // Padding to keep the image away from the circle edge
                                            mr: '10px',
                                            "& img": {
                                                objectFit: "contain", // Ensures the full PNG is visible
                                                width: "100%",        // Forces image to respect container width
                                                height: "100%",        // Forces image to respect container height
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
        </Backdrop>
  );
};

export default LeaderBoard; 