import React, { useState, type ReactNode } from 'react'; 
import type { Trials, World, MapMode } from '../assets/types';
import TrailCard from '../animations/TrialCard';
import GameCard from '../animations/GameCard';
import { LoadTrial } from '../handlers/ApiHandler';

type Props = {
    world: World;
    selected: {mode: MapMode, index: number, path: number};
    setWorld: (game: World) => void; 
    nextTrial: (long: number, lat: number) => void;
    setPopupCoord: (coord: {lat: number, lng: number} | undefined) => void; 
};

export const GamePage: React.FC<Props> = ({world, selected, setWorld, nextTrial, setPopupCoord}) => {
    const [nope, setNope] = useState<boolean>(false); 
    const clue: Trials = world.trials[selected.index]; 
    
    const calculate_score = (): number => {
        const score = Math.round(((600 - world.worldTime) / 600) * 10);
        console.log(score, world.worldTime, ((600 - world.worldTime) / 600) * 10); 
        return score > 1 ? score : 1; 
    }; 


    const ValidateResponse = (response: string): boolean => {
        console.log("validation running")
        setNope(
            response === "" ? false :
            !clue.responses.some(item => item.startsWith(response.toLocaleLowerCase()))
        ); 

        if (clue.responses.includes(response.toLocaleLowerCase())) {
            if(selected.index >= world.trials.length - 1){ 
                setWorld({...world, page: 'end'});
            } else {
                console.log(`Here => ${world.current}`)

                nextTrial(
                    world.trials[selected.index + 1].location[selected.path][1], 
                    world.trials[selected.index + 1].location[selected.path][0]
                ); 
                if(selected.index === world.current){
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
            }; 
            handleCancel()
        };
        return false; 
    };


    const handleCancel = () => {
        setPopupCoord(undefined); 
    };

    const handleGameAccept = () => {
        const g = world.games?.hunts[selected.index]; 
        if(g){
            LoadTrial(world, setWorld, g); 
        };

        setPopupCoord(undefined);
    }; 

    const DisplayCard: Record<MapMode, ReactNode> = {
        game: world.games ? <GameCard transition={selected?.mode === 'game'} accept={handleGameAccept} cancel={handleCancel} info={world.games?.hunts[selected.index] ?? ''}/> : <></>,
        trial: world.trials.length > selected.index ?  <TrailCard transition={true} title={world.title} trial={world.trials[selected.index]} path={selected.path} ValidateResponse={ValidateResponse} invalidResponse={nope}/> : <></>
    };

    return DisplayCard[selected.mode]; 
};