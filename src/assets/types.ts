//------------------------------------------------------------------------------------------//
export type HintIconTypes = 'internet' | 'walk' | 'drive' | 'here' | 'think';
export type Page = 'start' | 'game' | 'end';
export type InputTypes = 'text' | 'scan' | 'detect';
export type LocationType = 'start' | 'point';
export type PlayerIcon = 'bear'|'buffalo'|'chick'|'chicken'|'cow'|'crocodile'|'dog'|
    'duck'|'elephant'|'frog'|'giraffe'|'goat'|'gorilla'|'hippo'|'horse'|'monkey'|
    'moose'|'narwhal'|'owl'|'panda'|'parrot'|'penguin'|'pig'|'rabbit'|'rhino'|
    'sloth'|'snake'|'walrus'|'whale'|'zebra';
export const PlayerIcons: string[] = ['bear','buffalo','chick','chicken','cow','crocodile','dog',
    'duck','elephant','frog','giraffe','goat','gorilla','hippo','horse','monkey',
    'moose','narwhal','owl','panda','parrot','penguin','pig','rabbit','rhino',
    'sloth','snake','walrus','whale','zebra'
]; 
export type MapMode = 'game' | 'trial'; 
export type GameType = undefined | 'Fire' | 'Water' | 'Earth' | 'Air' | 'Spirit' | 'Ether'; 

//------------------------------------GAME LIST---------------------------------------------//
export type GameInfo = {
    coord: [number, number]; // lat, lng 
    description: string; 
    title: string; 
    type: GameType; 
}; 

export type Games = {
    hunts: GameInfo[]; 
};

//------------------------------------------------------------------------------------------//
//------------------------------------ Load Status -----------------------------------------//
//------------------------------------------------------------------------------------------//
//------------------------------------CLUE OBJECT-------------------------------------------//
export type Trials = {
    hintIcon: HintIconTypes[];
    text: string[];
    hint: string[];
    responses: string[]; // three options: 1. Connect
    location: [number, number][]; 
    inputType?: InputTypes[];
};

export type Location = {
    coordinates: [number, number];
    type?: LocationType;
    detail?: string; 

}; 

export type World = {
    id: string | undefined; 
    description: string;
    current: number; // current clue index
    page: Page; 
    title: string;
    date: Date;
    gameType: GameType;
    trials: Trials[];
    worldTime: number; 
    player: Player;
    players: Player[];
    games: Games | undefined; 
    loading: boolean; 
}; 
//------------------------------------------------------------------------------------------//
export type Player = {
    game_id: string;
    date: Date; 
    name: string; 
    score: number; 
    latitude: number; 
    longitude: number; 
    icon: PlayerIcon; 
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