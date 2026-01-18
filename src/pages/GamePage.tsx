import React, { useEffect, useState } from 'react'; 
import {Card, CardContent, CardHeader, CardActions, Slide, Typography, type SxProps, type Theme, Button} from '@mui/material'; 
import {GameClue} from '../components/GameClue';
import { Hint } from '../components/Hint';
import type { Game, GameStates } from '../assets/types';
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
    game: Game | undefined;
    setState: (state: GameStates) => void; 
};

export const GamePage: React.FC<Props> = ({game, setState}) => {
    if(!game) return <>-_-</>; 

    const [index, setIndex] = useState<number>(0); 
    const [open, setOpen] = useState<boolean>(false); 
    const [transition, setTransition] = useState<boolean>(false); 
    const [nope, setNope] = useState<boolean>(false); 

    const ValidateResponse = (response: string) => {
        setNope(
            response === "" ? false :
            !game.clues[index].responses.some(item => item.startsWith(response.toLocaleLowerCase()))
        ); 

        if (game.clues[index].responses.includes(response.toLocaleLowerCase())) {
            setIndex(index + 1);

            if(index >= game.clues.length - 1){ 
                setIndex(0); 
                setOpen(false);
                setState('victory');
            } else {
                
                setOpen(false);
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
                    avatar={<Hint hint={game!.clues[index].hintIcon}/>}
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
                        >{game!.title}</Typography>
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
                        >{'testing stuff'}</Typography>
                    }
                />
            
                <CardContent sx={{p: 1, m:0, height: '240px', width: '100%'}}>
                    <GameClue 
                        showClue={open}
                        clue={game!.clues[index].text}
                        validateResponse={ValidateResponse} 
                        inputType={game!.clues[index].inputType ?? 'text'}
                        hint={game!.clues[index].hint}
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
}