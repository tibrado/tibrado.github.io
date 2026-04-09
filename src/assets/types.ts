//------------------------------------------------------------------------------------------//
export type HintIconTypes = 'internet' | 'walk' | 'drive' | 'here' | 'think';
export type WorldStates = 'start' | 'game' | 'victory' | 'transition' | 'loading';
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
//------------------------------------GAME LIST---------------------------------------------//
export type GameInfo = {
    latitude: number; 
    longitude: number; 
    description: string; 
}; 

export type Games = {
    hunts: GameInfo[]; 
};

//------------------------------------------------------------------------------------------//
//------------------------------------ Load Status -----------------------------------------//
//------------------------------------------------------------------------------------------//
//------------------------------------CLUE OBJECT-------------------------------------------//
export type Trials = {
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

export type World = {
    id: string | undefined; 
    description: string;
    current: number; // current clue index
    statue: WorldStates; 
    title: string;
    date: Date;
    trials: Trials[];
    worldTime: number; 
    player: Player;
    players: Player[];
    games: Games | undefined; 
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