import React, { useState, type ReactNode } from 'react'; 
import type { Trials, MapMode } from '../assets/types';
import TrailCard from '../animations/TrialCard';
import GameCard from '../animations/GameCard';
import { GetPlayers, LoadTrial } from '../handlers/ApiHandler';
import { useWorld } from '../context';

type Props = {
    FocusOnPin: (lng: number, lat: number, zoom_offset: number) => void;
    setPopupCoord: (coord: {lat: number, lng: number} | undefined) => void; 
};

export const GamePage: React.FC<Props> = ({FocusOnPin, setPopupCoord}) => {
    const {world, setWorld} = useWorld(); 
    const [nope, setNope] = useState<boolean>(false); 
    const clue: Trials = world.trials[world?.selected?.index ?? 0]; 
    
    const i: number = world.selected!.index; 
    const p: number = world.selected!.path ?? 0; 

    const calculate_score = (): number => {
        const score = Math.round(((600 - world.worldTime) / 600) * 10);
        return score > 1 ? score : 1; 
    }; 


    const ValidateResponse = (response: string): boolean => {
        response = response.toLocaleLowerCase(); 
        setNope(
            response === "" ? false :
            !clue.responses.some(item => item.startsWith(response))
        ); 

        if (clue.responses.includes(response)) {
            console.log('Valid: ', world)
            if(i >= world.trials.length - 1){ 
                setWorld(pre => ({...pre, page: 'end'}));
            } else {
                FocusOnPin(
                    world.trials[i + 1].location[p][1], 
                    world.trials[i + 1].location[p][0],
                    0
                ); 
                if(i === world.current.index){
                    setWorld(pre => ({
                        ...pre, 
                        current: {index: world.current.index+1, path: clue.responses.indexOf(response)}, 
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
        const g = world.games?.hunts[world?.selected?.index ?? 0]; 
        if(g){
            LoadTrial(setWorld, g, FocusOnPin)
                .then(() => {
                    GetPlayers(world, setWorld);
                 }); 
        };

        setPopupCoord(undefined);
    }; 

    const DisplayCard: Record<MapMode, ReactNode> = {
        game: world.games ? <GameCard transition={world!.selected!.mode === 'game'} accept={handleGameAccept} cancel={handleCancel} info={world.games?.hunts[i] ?? ''}/> : <></>,
        trial: world.trials.length > i ?  <TrailCard transition={true} title={world.title} trial={world.trials[i]} path={p} ValidateResponse={ValidateResponse} invalidResponse={nope}/> : <></>
    };

    return DisplayCard[world!.selected!.mode]; 
};