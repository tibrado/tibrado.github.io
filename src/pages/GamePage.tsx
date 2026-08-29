import React, { type ReactNode } from 'react'; 
import type { MapMode } from '../assets/types';
import TrailCard from '../animations/TrialCard';
import GameCard from '../animations/GameCard';
import { GetPlayers, LoadTrial } from '../handlers/ApiHandler';
import { useWorld } from '../context';
import { GetTrials } from '../handlers/Tutorial';

type Props = {
    FocusOnPin: (lng: number, lat: number, zoom_offset: number) => void;
    setPopupCoord: (coord: {lat: number, lng: number} | undefined) => void; 
    setPoints: (v: number) => void; 
};

export const GamePage: React.FC<Props> = ({FocusOnPin, setPopupCoord, setPoints}) => {
    const {world, setWorld} = useWorld(); 
    
    const i: number = world.selected!.index; 
    const p: number = world.selected!.path ?? 0; 

    const OnSubmit = (valid: boolean, new_path: number) => {
        if(!valid) return; 

        const get_points = (): number => {
            const score = Math.round(((600 - world.worldTime) / 600) * 9) + 1;
            return score > 1 ? score : 1; 
        }; 
        
        // end trial
        if(i >= world.trials.length - 1){ 
            setWorld(pre => ({...pre, page: 'end'}));
        } else {
            FocusOnPin(
                world.trials[i + 1].location[p][1], 
                world.trials[i + 1].location[p][0],
                0
            );


            if(i === world.current.index){
                const points: number = get_points(); 
                setPoints(points); 
                
                setWorld(pre => ({
                    ...pre, 
                    current: {index: world.current.index+1, path: new_path}, 
                    player: {
                        ...world.player,
                        score: world.player.score + points
                    },
                    paths: [...world.paths, new_path],
                    worldTime: 0
                })); 
            }; 
        }; 
        handleCancel()
    };

    const handleCancel = () => {
        setPopupCoord(undefined); 
    };

    const handleGameAccept = () => {
        const g = world.games?.hunts[world?.selected?.index ?? 0]; 
        if(g){
            LoadTrial(setWorld, g, GetTrials([world.player.lat, world.player.lng]), FocusOnPin)
                .then(() => {
                    GetPlayers(world, setWorld);
                 }); 
        };

        setPopupCoord(undefined);
    }; 

    const DisplayCard: Record<MapMode, ReactNode> = {
        game: world.games ? <GameCard transition={world!.selected!.mode === 'game'} accept={handleGameAccept} cancel={handleCancel} info={world.games?.hunts[i] ?? ''}/> : <></>,
        trial: world.trials.length > i ?  
            <TrailCard 
                OnSubmit={OnSubmit}
                transition={true} 
                title={world.title} 
                trial={world.trials[i]} 
                path={p}
            /> : <></>
    };

    return DisplayCard[world!.selected!.mode]; 
};