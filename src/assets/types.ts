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
export const OtherIcons: string[] = ['quest', 'search'];
export type MapMode = 'game' | 'trial'; 
export type GameType = 'Fire' | 'Water' | 'Earth' | 'Air' | 'Spirit' | 'Ether'; 
export type MenuOptions = 'none' | 'leaderBoard';
export const Team: Record<GameType, string> = {
    Fire: 'red',
    Water: 'blue',
    Earth: 'brown',
    Air: 'gray',
    Spirit: 'white',
    Ether: 'purple' 
}; 

//------------------------------------GAME LIST---------------------------------------------//
export type GameInfo = {
    coord: [number, number]; // lat, lng 
    description: string; 
    title: string; 
    type: GameType; 
}; 
export type UserSelection = {
    mode: 'game' | 'trial';
    index: number;
    path?: number;
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
    inputType: InputTypes[];
    path_selected?: number; 
};

export type Location = {
    coordinates: [number, number];
    type?: LocationType;
    detail?: string; 

}; 

export type World = {
    id: string | undefined; 
    description: string;
    current: {index: number, path: number},
    page: Page; 
    title: string;
    date: Date;
    gameType?: GameType;
    trials: Trials[];
    paths: number[]; 
    worldTime: number; 
    player: Player;
    players: Player[];
    games: Games | undefined;
    menu?: MenuOptions;
    selected?: UserSelection;
}; 
//------------------------------------------------------------------------------------------//
export type Player = {
    game_id: string;
    date: Date; 
    name: string; 
    score: number; 
    lat: number; 
    lng: number; 
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