import React, { useEffect, useState } from 'react'; 
import { PlayerIcons, type PlayerIcon, type World } from '../assets/types';
import { Button, Card, CardActions, CardContent, CardHeader, TextField,
    Avatar, Grid
} from '@mui/material';
import { Public } from '@mui/icons-material';
import { v4 as uuid } from 'uuid';
import { LoadGames } from '../handlers/ApiHandler';

type Props = {
    setWorld: (world: World | undefined) => void; 
};
export const StartPage: React.FC<Props> = ({setWorld}) => {
    const [name, setName] = useState<string>('')
    const [icon, setIcon] = useState<string>('bear')
    const [gps, setGps] = useState<{lat: number, lng: number} | undefined>(); 
    
    const valid = name.length > 15 || name.length < 3; 
    // -- If user access through qr-scan
    const params = new URLSearchParams(window.location.search); 

    // ----- get user location on start 
    useEffect(() => {
        if(!navigator.geolocation) {
            console.log('Geolocation is not supported by your browser');
            return;
        }; 
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setGps({
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                });
            },
            (err) => {
                console.log(`Error: ${err.message}`);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        );

    }, []); 

    // ------------------------------------------------------------
    const OnStart = () => {
        const _id = params.get('gameId') ?? undefined; 
        const _world: World = {
            id: _id, 
            description: '',
            current: 0,
            page: 'game',
            title: '',
            date: new Date(),
            trials:[],
            worldTime: 0,
            player: {game_id: _id ?? '', date: new Date(Date.now()), uuid: uuid(), name: name, score: 0, latitude: gps?.lat ?? 0, longitude: gps?.lng ?? 0, icon: icon as PlayerIcon},
            players: [],
            games: undefined,
            loading: true
        }; 
        console.log(gps)
        LoadGames(_world, setWorld); 
    }; 

    return (
        <Card 
            sx={{
                maxWidth: '400px', // Standard max-width for modern large phones,
                width: '100%',     // Occupies full width on actual mobile devices
                margin: '0 auto',  // Centers the "phone" on desktop
                boxShadow: 3,      // Optional: adds a slight shadow to define the "phone" edge on desktop
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
                overflow: 'hidden' // Keeps the "screen" contained
            }}
        >
            <CardHeader
                sx={{
                    display: 'flex',
                    overflow: 'auto',
                }}
                title={
                    <Grid 
                        container
                        sx={{
                            display: "flex",
                            flexDirection: "column", 
                            alignItems: "center",
                            justifyContent: "center", 
                            textAlign: "center",   
                            mb: 0,
                            p: 0,   
                        }}
                    >
                        <Grid> 
                            <Avatar 
                                key={`selected_icon`}
                                variant="square"
                                src={`/icons/${icon}.png`}
                                sx={{
                                    borderRadius: '10%',
                                    width: 120, 
                                    height: 120,
                                    p: "20px",
                                    mb: 0, // Added margin bottom to separate from text
                                    "& img": {
                                        objectFit: "contain",
                                        filter: "drop-shadow(0px 10px 3px rgba(0, 0, 0, 0.5))"
                                    },
                                    zIndex: 5
                                }}
                            />
                        </Grid>
                        <Grid>
                            <TextField
                                id="player-name"
                                label="NAME"
                                defaultValue={name}
                                helperText={`letters remaining ${15 - name.length}`}
                                fullWidth
                                error={valid}
                                onChange={(e) => setName(e.target.value)}
                                size='small'
                                sx={{
                                    input: { 
                                        textAlign: 'center',
                                    }
                                }}
                            />
                        </Grid>
                    </Grid>
                }
            />
        
            <CardContent
                sx={{
                    flexGrow: 1, 
                    pl: 2, 
                    pr: 2, 
                    mb: 1,
                    mt: 1,
                    width: '100%',
                    maxHeight: {xs: 300, md: 800},
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflowY: 'auto',
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#8888884f #f1f1f1',
                }}
            >
                 <Grid 
                    container 
                    spacing={2.5}
                    justifyContent="center"
                >
                    {
                        PlayerIcons.map((p, i) => (
                            <Grid 
                                key={`pig_${i}`} 
                                container
                                sx={{
                                    display: "flex",
                                    flexDirection: "column", 
                                    alignItems: "center",      // Horizontal centering
                                    justifyContent: "center",   // Vertical centering
                                    alignContent: "center",     // Centers multi-line content
                                    width: 55, 
                                    height: 55,
                                }}
                            >
                                <Avatar 
                                    key={`pia_${i}`}
                                    variant="square"
                                    alt="UK" 
                                    src={`/icons/${p}.png`}
                                    sx={{
                                        border: '1px solid rgba(0, 0, 0, 0.38)',
                                        borderRadius:  '25% 5%',
                                        boxShadow: '3px 3px 2px rgba(0, 0, 0, 0.38)',
                                        width: 55, 
                                        height: 55,
                                        p: "10px", // Padding to keep the image away from the circle edge
                                        "& img": {
                                            objectFit: "contain", // Ensures the full PNG is visible
                                            width: "100%",        // Forces image to respect container width
                                            height: "100%",        // Forces image to respect container height
                                            filter: "drop-shadow(2px 3px 2px rgba(0, 0, 0, 0.38))" // Shadow follows PNG shape
                                        },
                                        cursor: 'pointer',
                                        bgcolor: `${icon == p ? 'rgba(28, 211, 53, 0.43)' : 'white'}`
                                    }}
                                    onClick={() => setIcon(p)}
                                    
                                />
                            </Grid>
                        ))
                    }
                   
                </Grid>       
            </CardContent>

            <CardActions disableSpacing>
                <Button 
                    onClick={OnStart}
                    variant="contained"
                    color='success'
                    size='small'
                    startIcon={<Public/>}
                    disabled={valid}
                    fullWidth
                    sx={{
                        height: '40px',
                        boxShadow: '2px 2px 1px rgba(255, 255, 255, 0.7)'
                    }}
                >
                    Join World
                </Button>
            </CardActions>
        </Card>
    ); 
}; 