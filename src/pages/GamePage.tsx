import React, { useEffect, useState } from 'react'; 
import {Card, CardContent, CardHeader, CardActions, Slide, Typography, type SxProps, type Theme, Button} from '@mui/material'; 
import {GameClue} from '../components/GameClue';
import { Hint } from '../components/Hint';
import type { ClueObject, Game } from '../assets/types';
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
    game: Game;
    selected: number;
    setGame: (game: Game) => void; 
    nextClue: (index: number) => void;
};

export const GamePage: React.FC<Props> = ({game, selected,setGame, nextClue}) => {
    const [open, setOpen] = useState<boolean>(false); 
    const [transition, setTransition] = useState<boolean>(false); 
    const [nope, setNope] = useState<boolean>(false); 
    const clue: ClueObject = game.clues[selected]; 
    
    const ValidateResponse = (response: string) => {
        setNope(
            response === "" ? false :
            !clue.responses.some(item => item.startsWith(response.toLocaleLowerCase()))
        ); 

        if (clue.responses.includes(response.toLocaleLowerCase())) {
            if(selected >= game.clues.length - 1){ 
                    setGame({...game, statue: 'victory'});
            } else {
                console.log(game.current)
                if(selected === game.current){
                    setGame({...game, current: game.current + 1})
                }
                nextClue(selected + 1); 
                setTransition(false); 
            }; 
        };
    };

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
                        >{game.title}</Typography>
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
                        hint={`${clue.location}`}//{game.clues[index].hint}
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