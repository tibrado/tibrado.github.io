//------------------------------------------------------------------------------------------//
export type HintIconTypes = 'internet' | 'walk' | 'drive' | 'here' | 'think';
export type Page = 'start' | 'game' | 'end';
export type InputTypes = 'text' | 'scan' | 'detect';
export type LocationType = 'start' | 'point';
export type PlayerIcon = 'bear' | 'buffalo' | 'chick' | 'chicken' | 'cow' | 'crocodile' | 'dog' |
    'duck' | 'elephant' | 'frog' | 'giraffe' | 'goat' | 'gorilla' | 'hippo' | 'horse' | 'monkey' |
    'moose' | 'narwhal' | 'owl' | 'panda' | 'parrot' | 'penguin' | 'pig' | 'rabbit' | 'rhino' |
    'sloth' | 'snake' | 'walrus' | 'whale' | 'zebra';
export const PlayerIcons: string[] = ['bear', 'buffalo', 'chick', 'chicken', 'cow', 'crocodile', 'dog',
    'duck', 'elephant', 'frog', 'giraffe', 'goat', 'gorilla', 'hippo', 'horse', 'monkey',
    'moose', 'narwhal', 'owl', 'panda', 'parrot', 'penguin', 'pig', 'rabbit', 'rhino',
    'sloth', 'snake', 'walrus', 'whale', 'zebra'
];
export const OtherIcons: string[] = ['quest', 'search', 'locked'];
export type MapMode = 'game' | 'trial' | 'creation';
export type ClueLocks = undefined | 'time' | 'distance' | 'clue'; 
export type GameType = 'scavenger_hunt' | 'murder_mystery';
export type MenuOptions = 'none' | 'leaderBoard';

export const Color: Record<string, string> = { // Shade 400 -> https://mui.com/material-ui/customization/color/
    'red': '#ef5350',
    'blue': '#42a5f5',
    'green': '#66bb6a'
};

export type AppPermissionOptions = 'granted' | 'denied' | 'prompt' | 'unsupported' | 'error';
//------------------------------------GAME LIST---------------------------------------------//
export type GameData = {
    uuid: string;
    title: string;
    description: string;
    type: GameType;
    location: LatLng; 
};

export type ObjectiveData = {
    clue: string[];
    hint: string[];
    solution: string[]; // three options: 1. Connect
    inputType: InputTypes[];
    location: LatLng[];
};

export type UserSelection = {
    mode: MapMode;
    index: number;
    path?: number;
    lock?: boolean; 
};

//------------------------------------------------------------------------------------------//
//------------------------------------ Load Status -----------------------------------------//
//------------------------------------------------------------------------------------------//
//------------------------------------CLUE OBJECT-------------------------------------------//

export type Location = {
    coordinates: [number, number];
    type?: LocationType;
    detail?: string;

};

export type NewGameData = {
    value?: string,
    description?: string,
    type?: InputTypes | GameType,
    coordinates?: LatLng
};

export type World = {
    uuid: string | undefined;
    description: string;
    current: { index: number, path: number },
    page: Page;
    title: string;
    date: Date;
    gameType?: GameType;
    paths: number[];
    worldTime: number;
    player: Player;
    players: Player[];
    games: GameData[];
    objectives: ObjectiveData[];
    menu?: MenuOptions;
    selected?: UserSelection;
    creationMode: {
        active: boolean,
        location: {
            active: boolean, LatLng?: LatLng
        }, 
        data: NewGameData[],
        edit?: number
    }
};
//------------------------------------------------------------------------------------------//
export type Player = {
    game_id: string;
    date: Date;
    name: string;
    score: number;
    location: LatLng; 
    icon: PlayerIcon;
    uuid: string;
};
// "game_id","date","name","score","lat","long","uuid"
//------------------------------------------------------------------------------------------//
export type LatLng = {
    latitude: number;
    longitude: number;
    accuracy?: number;
};
//------------------------------------------------------------------------------------------//
//------------------------------------------------------------------------------------------//

//------------------------------------------------------------------------------------------//

//------------------------------------------------------------------------------------------//