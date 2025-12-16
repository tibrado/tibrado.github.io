//------------------------------------------------------------------------------------------//
export type HintIconTypes = 'internet' | 'walk' | 'drive' | 'here' | 'think';
//------------------------------------CLUE OBJECT-------------------------------------------//
export type ClueObject = {
    hint: HintIconTypes;
    text: string;
    response: string;
    location?: Location; 
};

export type Location = {
    country: string;
    state: string; 
    city: string;
    address: string; 
    zip: number; 
}; 

export type Game = {
    title: string;
    date: Date;
    clues: ClueObject[];
}; 
//------------------------------------------------------------------------------------------//
export type GameStates = 'start' | 'game' | 'victory' | 'transition' | 'loading';
//------------------------------------------------------------------------------------------//

