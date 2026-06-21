import React, { useState, type ReactNode } from 'react'; 
import type { Trials, MapMode } from '../assets/types';
import TrailCard from '../animations/TrialCard';
import GameCard from '../animations/GameCard';
import { GetPlayers, LoadTrial } from '../handlers/ApiHandler';
import { useWorld } from '../context';

type Props = {
    selected: {mode: MapMode, index: number, path: number};
    FocusOnPin: (lng: number, lat: number, zoom_offset: number) => void;
    setPopupCoord: (coord: {lat: number, lng: number} | undefined) => void; 
};

export const GamePage: React.FC<Props> = ({selected, FocusOnPin, setPopupCoord}) => {
    const {world, setWorld} = useWorld(); 
    const [nope, setNope] = useState<boolean>(false); 
    const clue: Trials = world.trials[selected.index]; 
    
    const calculate_score = (): number => {
        const score = Math.round(((600 - world.worldTime) / 600) * 10);
        console.log(score, world.worldTime, ((600 - world.worldTime) / 600) * 10); 
        return score > 1 ? score : 1; 
    }; 


    const ValidateResponse = (response: string): boolean => {
        response = response.toLocaleLowerCase(); 
        setNope(
            response === "" ? false :
            !clue.responses.some(item => item.startsWith(response))
        ); 
        console.log(response, clue.responses)
        if (clue.responses.includes(response)) {
            if(selected.index >= world.trials.length - 1){ 
                setWorld(pre => ({...pre, page: 'end'}));
            } else {
                FocusOnPin(
                    world.trials[selected.index + 1].location[selected.path][1], 
                    world.trials[selected.index + 1].location[selected.path][0],
                    0
                ); 
                if(selected.index === world.current){
                    setWorld(pre => ({
                        ...pre, 
                        current: world.current + 1, 
                        player: {
                            ...world.player,
                            score: world.player.score + calculate_score()
                        },
                        paths: [...world.paths, clue.responses.indexOf(response)],
                        worldTime: 0
                    })); 
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
            LoadTrial(setWorld, g, FocusOnPin)
                .then(() => {
                    GetPlayers(world, setWorld);
                 }); 
        };

        setPopupCoord(undefined);
    }; 

    const DisplayCard: Record<MapMode, ReactNode> = {
        game: world.games ? <GameCard transition={selected?.mode === 'game'} accept={handleGameAccept} cancel={handleCancel} info={world.games?.hunts[selected.index] ?? ''}/> : <></>,
        trial: world.trials.length > selected.index ?  <TrailCard transition={true} title={world.title} trial={world.trials[selected.index]} path={selected.path} ValidateResponse={ValidateResponse} invalidResponse={nope}/> : <></>
    };

    return DisplayCard[selected.mode]; 
};