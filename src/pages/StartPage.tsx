import React, { useState } from 'react'; 
import { PlayerIcons, type World } from '../assets/types';
import { Button, Card, CardActions, CardContent, CardHeader, TextField,
    Avatar, Grid,  Typography
} from '@mui/material';
import { Public } from '@mui/icons-material';
import { v4 as uuid } from 'uuid';

type Props = {
    setWorld: (world: World | undefined) => void; 
};
export const StartPage: React.FC<Props> = ({setWorld}) => {
    const [name, setName] = useState<string>('')
    const [icon, setIcon] = useState<string>('')
    
    // -- If user access through qr-scan
    const params = new URLSearchParams(window.location.search); 

    // ------------------------------------------------------------
    const OnStart = () => {
        const _id = params.get('gameId') ?? undefined; 
        setWorld(
            {
                id: _id, 
                description: '',
                current: 0,
                statue: 'game',
                title: '',
                date: new Date(),
                trials:[],
                worldTime: 0,
                player: {game_id: _id ?? '', date: new Date(Date.now()), uuid: uuid(), name: name, score: 0, latitude: 0, longitude: 0, icon: icon},
                players: [],
                games: undefined
            } as World
        )
    }; 

    return (
        <Card 
            sx={{
                maxWidth: '430px', // Standard max-width for modern large phones
                width: '100%',     // Occupies full width on actual mobile devices
                height: '90vh',   // Mimics phone screen height
                margin: '0 auto',  // Centers the "phone" on desktop
                boxShadow: 3,      // Optional: adds a slight shadow to define the "phone" edge on desktop
                display: 'flex',
                flexDirection: 'column',
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
                            mb: 2,
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
                                    width: { xs: 80, md: 90, lg: 100 }, 
                                    height: { xs: 80, md: 90, lg: 100 },
                                    p: "5px",
                                    mb: 0, // Added margin bottom to separate from text
                                    "& img": {
                                        objectFit: "contain",
                                        filter: "drop-shadow(0px 5px 2px rgba(0, 0, 0, 0.38))"
                                    },
                                    bgcolor: 'rgba(0, 0, 0, 0.03)'
                                }}
                            />
                        </Grid>
                        <Grid>
                            <Typography 
                                variant='subtitle2' 
                                sx={{ 
                                    minWidth: '10em',
                                    minHeight: '2em',
                                    fontWeight: 'bold',
                                    border: '2px solid rgba(0, 0, 0, 0.1)',
                                    p: '1px',
                                    mt: '5px',
                                    mb: '0',
                                    borderRadius: '5px',
                                    boxShadow: '2px 3px 2px rgba(0, 0, 0, 0.1)'

                                }}
                            >
                                {name}
                            </Typography>
                        </Grid>
                    </Grid>
                }
                subheader={
                    <TextField
                        id="player-name"
                        label="name your self"
                        defaultValue={name}
                        helperText={`letters remaining ${15 - name.length}`}
                        fullWidth
                        error={name.length > 15}
                        onChange={(e) => setName(e.target.value)}
                    />
                }
            />
        
            <CardContent
                sx={{
                    flexGrow: 1, 
                    pl: 2, 
                    pr: 2, 
                    mb: 2,
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflowY: 'auto',
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#8888884f #f1f1f1',
                    height: { xs: 370, md: 480, lg: 500 },
                }}
            >
                 <Grid 
                    container spacing={2.5}
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
                                    width: { xs: 60, md: 70, lg: 80 }, 
                                    height: { xs: 65, md: 65, lg: 65 },
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
                                        width: { xs: 60, md: 65, lg: 65 }, 
                                        height: { xs: 60, md: 65, lg: 65 },
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