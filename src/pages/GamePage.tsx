import React, { useEffect, useState } from 'react'; 
import {Card, CardContent, CardHeader, CardActions, Slide, Typography, type SxProps, type Theme, Button} from '@mui/material'; 
import {GameClue} from '../components/map/GameClue';
import { Hint } from '../components/Hint';
import type { Trials, World } from '../assets/types';
import { QuestionAnswer } from '@mui/icons-material';


const glassStyle: SxProps<Theme> = {
    width: '250px',
    height: '350px',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 1,
    borderRadius: '20px',
    // 1. Semi-transparent background
    backgroundColor: 'rgba(255, 255, 255, 0.15)', 
    // 2. The "Frosted" effect
    backdropFilter: 'blur(12px) saturate(180%)',
    WebkitBackdropFilter: 'blur(12px) saturate(180%)', // Safari support
    // 3. Subtle border to define the edges
    border: '2px solid rgba(255, 255, 255, 0.1)',
    // 4. Soft shadow for depth
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2)',
    color: '#000000ff',
};

type Props = {
    world: World;
    selected: number;
    setWorld: (game: World) => void; 
    nextTrial: (long: number, lat: number) => void;
};

export const GamePage: React.FC<Props> = ({world, selected, setWorld, nextTrial}) => {
    const [open, setOpen] = useState<boolean>(false); 
    const [transition, setTransition] = useState<boolean>(false); 
    const [nope, setNope] = useState<boolean>(false); 
    const clue: Trials = world.trials[selected]; 
    
    const calculate_score = (): number => {
        const score = Math.round(((600 - world.worldTime) / 600) * 10);
        console.log(score, world.worldTime, ((600 - world.worldTime) / 600) * 10); 
        return score > 1 ? score : 1; 
    }; 

    const ValidateResponse = (response: string) => {
        setNope(
            response === "" ? false :
            !clue.responses.some(item => item.startsWith(response.toLocaleLowerCase()))
        ); 

        if (clue.responses.includes(response.toLocaleLowerCase())) {
            if(selected >= world.trials.length - 1){ 
                setWorld({...world, statue: 'victory'});
            } else {
                if(selected === world.current){
                    setWorld({
                        ...world, 
                        current: world.current + 1, 
                        player: {
                            ...world.player,
                            score: world.player.score + calculate_score()
                        },
                        worldTime: 0
                    })
                }; 
                
                setOpen(false); 
                setTransition(false); 
            }; 
        };
    };

    // --------- Transitions Animations 
    useEffect(() => {
        if(world.id){
            // fly to next clue 
            nextTrial(
                world.trials[world.current].location.coordinates[1], 
                world.trials[world.current].location.coordinates[0]
            ); 

        }; 
    }, [world.current]); 

    useEffect(() => {
        const timer = setTimeout(() => {
            setTransition(true); 
        }, 800); 
    
        return () => clearTimeout(timer); 

    }, [transition]); 

    return(
        <Slide direction={transition ? 'right' : 'left'} in={transition} mountOnEnter unmountOnExit>
            <Card sx={glassStyle}>
                <CardHeader
                    sx={{p: 0}}
                    avatar={<Hint hint={clue.hintIcon}/>}
                    title={
                        <Typography 
                            sx={{
                                color: '#000000ff',
                                alignContent: 'center',
                                fontFamily: 'system-ui',
                                fontSize: '15px',
                                fontWeight: 'bold',
                                textShadow: '1px 1px 3px rgba(25, 23, 23, 0.7)'
                            }}
                        >{world.title}</Typography>
                    }
                    subheader={
                        
                        <Typography 
                            sx={{
                                color: '#757575ff',
                                alignContent: 'center',
                                fontFamily: 'system-ui',
                                fontSize: '12px',
                                pl: '10px'
                            }}
                        >{`${selected}`}</Typography>
                    }
                />
            
                <CardContent sx={{p: 1, m:0, height: '240px', width: '100%'}}>
                    <GameClue 
                        showClue={open}
                        clue={clue.text}
                        validateResponse={ValidateResponse} 
                        inputType={clue.inputType ?? 'text'}
                        hint={`${clue.hint}`}//{game.clues[index].hint}
                        nope={nope}
                    />
                </CardContent>

                <CardActions disableSpacing>
                    <Button onClick={() => setOpen(!open)}
                        variant="contained"
                        color='success'
                        size='small'
                        startIcon={<QuestionAnswer />}
                        sx={{
                            boxShadow: '2px 2px 1px rgba(255, 255, 255, 0.7)'
                        }}
                    >
                        Answer
                    </Button>
                </CardActions>
            </Card>
        </Slide>
    ); 
};