import React, { useState } from 'react'; 
import {Card, CardContent, CardHeader, CardActions, Typography} from '@mui/material'; 
import {GameClue} from '../components/GameClue';
import { Hint } from '../components/Hint';
import { GameProgress } from '../components/GameProgress';
import GameInputs  from '../components/inputs/GameInputs';
import type { Game, GameStates } from '../assets/types';
import GameModal from '../components/GameModal';

type Props = {
    game: Game | undefined;
    setState: (state: GameStates) => void; 
};
export const GamePage: React.FC<Props> = ({game, setState}) => {
    if(!game) return <>-_-</>; 

    const [index, setIndex] = useState<number>(0); 
    const [open, setOpen] = useState<boolean>(false); 

    const ValidateResponse = (response: string) => {
        if (game.clues[index].responses.includes(response.toLocaleLowerCase())) {
            setIndex(index + 1); 
            console.log(index, game.clues.length - 1); 
            if(index >= game.clues.length - 1){ 
                console.log("Game Completed"); 
                setIndex(0); 
                setState('victory');
            }; 
        };
    };

    return(
        <Card>
            <CardHeader
                avatar={<Hint hint={game!.clues[index].hint}/>}
                title={
                    <Typography sx={{alignContent: 'center', textAlign: 'center'}}>{game!.title}</Typography>
                }
                subheader={<GameProgress max={game!.clues.length + 1} current={ index + 1}/>}
            />
        
            <CardContent>
                <GameClue clue={game!.clues[index].text}/>
            </CardContent>

            <CardActions disableSpacing>
                <GameModal 
                    children={<GameInputs onSubmit={ValidateResponse} inputType={game!.clues[index].inputType ?? 'text'}/>} 
                    open={open} 
                    setOpen={setOpen} 
                />
            </CardActions>
        </Card>
    ); 
}