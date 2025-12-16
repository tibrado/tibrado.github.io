import React from 'react'; 
import { UserFreeTextInput } from '../components/inputs/InputTypes';
import type { Game, GameStates } from '../assets/types';
import { GetGame } from '../components/setup/TheHunt';

type Props = {
    setGame: (game: Game | undefined) => void; 
    setState: (state: GameStates) => void; 
};
export const StartPage: React.FC<Props> = ({setGame, setState}) => {

    // on submit get game 
    async function submit(value: string){
        try{
            const g = await GetGame(value); 
            setGame(g);
            
            if(g) setState('game'); 
        } catch {
            setGame(undefined); 
            setState('start'); 
        };
    }; 

    return (
        <UserFreeTextInput onSubmit={submit}/>
    ); 
}; 