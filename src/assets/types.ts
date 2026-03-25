//------------------------------------------------------------------------------------------//
export type HintIconTypes = 'internet' | 'walk' | 'drive' | 'here' | 'think';
export type GameStates = 'start' | 'game' | 'victory' | 'transition' | 'loading';
export type InputTypes = 'text' | 'scan' | 'detect';
export type LocationType = 'start' | 'point';
//------------------------------------CLUE OBJECT-------------------------------------------//
export type ClueObject = {
    location: Location; 
    hintIcon: HintIconTypes;
    text: string;
    hint: string;
    responses: string[];
    inputType?: InputTypes;
    reward?: number;
};

export type Location = {
    coordinates: [number, number];
    type?: LocationType;
    detail?: string; 

}; 

export type Game = {
    id: string; 
    current: number; // current clue index
    statue: GameStates; 
    title: string;
    date: Date;
    clues: ClueObject[];
    gameTime: number; 
    player: Player;
    players: Player[];
}; 
//------------------------------------------------------------------------------------------//
export type Player = {
    game_id: string;
    date: Date; 
    name: string; 
    score: number; 
    latitude: number; 
    longitude: number; 
    uuid: string; 
}; 
// "game_id","date","name","score","lat","long","uuid"
//------------------------------------------------------------------------------------------//
export type Coordinates = {
    latitude: number; 
    longitude: number; 
    accuracy?: number; 
}; 
//------------------------------------------------------------------------------------------//
//------------------------------------------------------------------------------------------//

//------------------------------------------------------------------------------------------//

//------------------------------------------------------------------------------------------//