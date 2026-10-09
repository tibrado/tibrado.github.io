import React, { type ReactNode } from 'react';
import type { MapMode } from '../assets/types';
import ObjectiveCard from '../animations/ObjectiveCard';
import GameCard from '../animations/GameCard';
import CreationCard from '../animations/CreationCard';
import { GetPlayers, GetObjectives } from '../handlers/ApiHandler';
import { useWorld } from '../context';
import { GetTrials } from '../handlers/Tutorial';

type Props = {
    FocusOnPin: (lng: number, lat: number, zoom_offset: number) => void;
    setPopupCoord: (coord: { lat: number, lng: number } | undefined) => void;
    setPoints?: (v: number) => void;
};

export const GamePage: React.FC<Props> = ({ FocusOnPin, setPopupCoord, setPoints }) => {
    const { world, setWorld } = useWorld();

    const i: number = world.selected!.index;
    const p: number = world.selected!.path ?? 0;

    const OnSubmit = (valid: boolean, new_path: number) => {
        if (!valid || !setPoints) return;

        const get_points = (): number => {
            const score = Math.round(((600 - world.worldTime) / 600) * 9) + 1;
            return score > 1 ? score : 1;
        };

        // end trial
        if (i >= world.objectives.length - 1) {
            setWorld(pre => ({ ...pre, page: 'end' }));
        } else {
            FocusOnPin(
                world.objectives[i + 1].location[p].longitude,
                world.objectives[i + 1].location[p].latitude,
                0
            );


            if (i === world.current.index) {
                const points: number = get_points();
                setPoints(points);

                setWorld(pre => ({
                    ...pre,
                    current: { index: world.current.index + 1, path: new_path },
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
        const g = world.games[world?.selected?.index ?? 0];
        
        if (g) {
            GetObjectives(setWorld, g, GetTrials(world.player.location), FocusOnPin)
                .then(() => {
                    GetPlayers(world, setWorld);
                });
        };

        setPopupCoord(undefined);
    };

    const DisplayCard: Record<MapMode, ReactNode> = {
        game: world.games ? <GameCard transition={world!.selected!.mode === 'game'} accept={handleGameAccept} cancel={handleCancel} info={world.games[i] ?? ''} /> : <></>,
        creation: world.games ? <CreationCard transition={world!.selected!.mode === 'creation'} close={handleCancel}/> : <></>,
        trial: world.objectives.length > i ?
            <ObjectiveCard
                OnSubmit={OnSubmit}
                transition={true}
                title={world.title}
                trial={world.objectives[i]}
                path={p}
            /> : <></>
    };

    return DisplayCard[world!.selected!.mode];
};