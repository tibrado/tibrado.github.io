import React, {createContext, useContext, useState, type ReactNode} from "react"; 
import type { World, PlayerIcon } from "./assets/types";

type WorldContextType = {
    world: World; 
    setWorld: React.Dispatch<React.SetStateAction<World>>; 
}; 

const WorldContext = createContext<WorldContextType | undefined>(undefined); 

// Default World
const defaultWorld: World = {
    uuid: undefined, 
    description: '',
    current: {index: 0, path: 0},
    page: 'start',
    title: '',
    date: new Date(),
    objectives:[],
    paths: [],
    worldTime: 0,
    player: {
        game_id: '', 
        date: new Date(Date.now()), 
        uuid: '', 
        name: 'default', 
        score: 0, 
        location: {latitude: 0, longitude: 0}, 
        icon: 'bear' as PlayerIcon
    },
    players: [],
    gameType: undefined,
    games: [],
    creationMode: {active: false, location: {active: false, LatLng: undefined}, data: []}
}; 
// Provider
export function WorldProvider({children}: {children: ReactNode}){
    const [world, setWorld] = useState<World>(defaultWorld); 

    return (
        <WorldContext.Provider value={{world, setWorld}}>
            {children}
        </WorldContext.Provider>
    );
};

// Hook
export function useWorld() {
    const context = useContext(WorldContext); 
    
    if(!context){
        throw new Error("useWorld must be used within a WorldProvider");
    }; 

    return context; 
};