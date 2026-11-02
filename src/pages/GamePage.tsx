import React, { type ReactNode} from 'react';
import type { MapMode } from '../assets/types';
import ObjectiveCard from '../animations/ObjectiveCard';
import GameCard from '../animations/GameCard';
import CreationCard from '../animations/CreationCard';
import { GetObjectives } from '../handlers/ApiHandler';
import { useWorld } from '../context';
import { GetTutorialObjData } from '../handlers/Tutorial';

type Props = {
    FocusOnPin: (lng: number, lat: number) => void;
    setPopupCoord: (coord: { lat: number, lng: number } | undefined) => void;
    setPoints?: (v: number) => void;
};

export const GamePage: React.FC<Props> = ({ FocusOnPin, setPopupCoord, setPoints }) => {
    const { world, setWorld } = useWorld();

    const index: number = world.selected!.index;
    const path: number = world.selected!.path ?? 0;

    const scorer = (i: number, p: number) => {
        if(!setPoints) return; 

        const score: number = Math.round(((600 - world.worldTime) / 600) * 9) + 1;
        const points: number = score > 1 ? score : 1; 
        const objs = world.objectives; 

        objs[index].done = true
        setPoints(points);

        // check if p is in index 
        p = objs[i].clue.length >= p ? p : 0; 

        setWorld(pre => ({
            ...pre,
            current: { index: i, path: p },
            player: {
                ...world.player,
                score: world.player.score + points
            },
            paths: [...world.paths, p],
            worldTime: 0,
            reward: objs.every(o => o?.done),
            objectives: objs
        }));
    };

    const score_scavenger = () => {
        scorer(index, path); 
    }; 

    const score_treasure = (new_path: number) => {
        const i = world.objectives.length - 1 > index ? index + 1 : index; 
        
        FocusOnPin(
            world.objectives[i].location[path].longitude,
            world.objectives[i].location[path].latitude
        );

        scorer(
            i, // next objective
            new_path 
        ); 
    }; 

    const score_murder_mystery = () => {
        console.warn('TODO'); 
    };

    const OnSubmit = (valid: boolean, new_path: number) => {
        if (!valid && !world.objectives[index]) return;

        switch(world.gameType) {
            case 'murder_mystery': 
                score_murder_mystery(); 
            break;
            case 'scavenger_hunt': 
                score_scavenger();  
            break;
            case 'treasure_hunt':
                score_treasure(new_path);
            break;
            default: {
                console.error(`Game Type >${world.gameType}< not recognized.`) 
            }
        }
        
        handleCancel()
    };

    const handleCancel = () => {
        setPopupCoord(undefined);
    };

    const handleGameAccept = () => {
        const g = world.games[world?.selected?.index ?? 0];
        
        if (g) {
            GetObjectives(setWorld, g, GetTutorialObjData(world.player.location), FocusOnPin)
        };

        if(world.player.location.noGps){
            setWorld(pre => ({
                ...pre,
                player: {
                    ...pre.player,
                    location: {
                        ...pre.player.location,
                        latitude: g.location.latitude,
                        longitude: g.location.longitude
                    }
                }
            }));
        }; 

        setPopupCoord(undefined);
    };

    const DisplayCard: Record<MapMode, ReactNode> = {
        game: world.games ? <GameCard transition={world!.selected!.mode === 'game'} accept={handleGameAccept} cancel={handleCancel} info={world.games[index] ?? ''} /> : <></>,
        creation: world.games ? <CreationCard transition={world!.selected!.mode === 'creation'} close={handleCancel}/> : <></>,
        trial: world.objectives.length > index ?
            <ObjectiveCard
                OnSubmit={OnSubmit}
                transition={true}
                title={world.title}
                trial={world.objectives[index]}
                path={path}
            /> : <></>
    };

    return DisplayCard[world!.selected!.mode];
};