import React from 'react'; 
import GameInputs from '../components/inputs/GameInputs';
import type { Game, GameStates } from '../assets/types';
import { GetGame } from '../components/setup/TheHunt';

type Props = {
    setGame: (game: Game | undefined) => void; 
    setState: (state: GameStates) => void; 
};
export const StartPage: React.FC<Props> = ({setGame, setState}) => {

    // -- Check for Game ID on screen load
    const params = new URLSearchParams(window.location.search); 
    const gameId = params.get('gameId'); 

    if(gameId){
        submit(gameId); 
    }; 

    // on submit get game 
    async function submit(value: string){
        try{
            const g = await GetGame(value); 
            setGame(g);
            if(g) setState('game'); 
        } catch(e) {
            setGame(undefined); 
            setState('start'); 
        };
    }; 

    return (
        <GameInputs onSubmit={submit} inputType={'text'} label={'What\'s the game code?'} helperText={'You\'re either in the loop or you\'re walking in circles.'}/>
    ); 
}; 